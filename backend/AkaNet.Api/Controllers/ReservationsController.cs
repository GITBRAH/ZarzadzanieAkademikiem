using System.Security.Claims;
using AkaNet.Api.Data;
using AkaNet.Api.DTOs;
using AkaNet.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkaNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly AkaNetDbContext _context;

    public ReservationsController(AkaNetDbContext context)
    {
        _context = context;
    }

    [HttpGet("facilities")]
    public async Task<IActionResult> GetFacilities([FromQuery] string type, [FromQuery] string date)
    {
        var targetDate = string.IsNullOrWhiteSpace(date) ? DateTime.UtcNow.ToString("yyyy-MM-dd") : date;

        var facilities = await _context.Facilities
            .Where(f => f.Type.ToLower() == type.ToLower())
            .ToListAsync();

        var reservations = await _context.Reservations
            .Where(r => r.Date == targetDate && r.Status != "Cancelled")
            .ToListAsync();

        var result = facilities.Select(f => new FacilityStatusDto(
            f.Id,
            f.Name,
            f.Location,
            f.Type,
            reservations.Where(r => r.FacilityId == f.Id).Select(r => r.TimeSlot).ToList()
        ));

        return Ok(result);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReservations()
    {
        var userId = GetCurrentUserId();
        var reservations = await _context.Reservations
            .Include(r => r.Facility)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Date)
            .ThenByDescending(r => r.TimeSlot)
            .Select(r => new
            {
                r.Id,
                r.FacilityId,
                FacilityName = r.Facility != null ? r.Facility.Name : "",
                FacilityLocation = r.Facility != null ? r.Facility.Location : "",
                FacilityType = r.Facility != null ? r.Facility.Type : "",
                r.Date,
                r.TimeSlot,
                r.DurationMinutes,
                r.Status,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reservations);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] CreateReservationRequest request)
    {
        var userId = GetCurrentUserId();

        // Check if facility exists
        var facility = await _context.Facilities.FindAsync(request.FacilityId);
        if (facility == null)
        {
            return NotFound(new { message = "Wybrany obiekt nie istnieje." });
        }

        // Check for double booking
        var isBooked = await _context.Reservations.AnyAsync(r =>
            r.FacilityId == request.FacilityId &&
            r.Date == request.Date &&
            r.TimeSlot == request.TimeSlot &&
            r.Status != "Cancelled");

        if (isBooked)
        {
            return BadRequest(new { message = "Ten termin został już zarezerwowany przez innego mieszkańca." });
        }

        var reservation = new Reservation
        {
            UserId = userId,
            FacilityId = request.FacilityId,
            Date = request.Date,
            TimeSlot = request.TimeSlot,
            DurationMinutes = 60,
            Status = "Confirmed"
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            FacilityName = facility.Name,
            FacilityLocation = facility.Location,
            facility.Type,
            reservation.Date,
            reservation.TimeSlot,
            reservation.DurationMinutes,
            reservation.Status
        });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelReservation(int id)
    {
        var userId = GetCurrentUserId();
        var userRole = User.FindFirstValue(ClaimTypes.Role);

        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound(new { message = "Rezerwacja nie została znaleziona." });
        }

        if (reservation.UserId != userId && userRole != "Admin")
        {
            return Forbid();
        }

        reservation.Status = "Cancelled";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rezerwacja została anulowana." });
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var id) ? id : 1; // Default to user 1 if mock/guest
    }
}
