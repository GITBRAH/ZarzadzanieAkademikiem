using System.Security.Claims;
using AkaNet.Api.Data;
using AkaNet.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkaNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly AkaNetDbContext _context;

    public RoomsController(AkaNetDbContext context)
    {
        _context = context;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyRoom()
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users
            .Include(u => u.Room)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null || user.Room == null)
        {
            return NotFound(new { message = "Nie znaleziono przypisanego pokoju." });
        }

        var roommates = await _context.Users
            .Where(u => u.RoomId == user.RoomId && u.Id != user.Id)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.PhoneNumber
            })
            .ToListAsync();

        return Ok(new
        {
            user.Room.Id,
            user.Room.RoomNumber,
            user.Room.Building,
            user.Room.Floor,
            user.Room.Capacity,
            CurrentOccupancy = roommates.Count + 1,
            user.Room.MonthlyRent,
            user.Room.Deposit,
            DepositPaid = true,
            RentStatus = "Opłacone do 31 października",
            Roommates = roommates
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRooms()
    {
        var rooms = await _context.Rooms
            .Include(r => r.Residents)
            .Select(r => new
            {
                r.Id,
                r.RoomNumber,
                r.Building,
                r.Floor,
                r.Capacity,
                Occupancy = r.Residents.Count,
                r.MonthlyRent,
                Residents = r.Residents.Select(res => res.FullName).ToList()
            })
            .ToListAsync();

        return Ok(rooms);
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var id) ? id : 1;
    }
}
