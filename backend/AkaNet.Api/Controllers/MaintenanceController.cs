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
public class MaintenanceController : ControllerBase
{
    private readonly AkaNetDbContext _context;

    public MaintenanceController(AkaNetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        var userId = GetCurrentUserId();
        var userRole = User.FindFirstValue(ClaimTypes.Role);

        var query = _context.MaintenanceTickets.Include(m => m.User).AsQueryable();

        // If not admin, return user's tickets
        if (userRole != "Admin")
        {
            query = query.Where(m => m.UserId == userId);
        }

        var tickets = await query
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new
            {
                m.Id,
                m.Title,
                m.Category,
                m.Description,
                m.RoomNumber,
                m.Priority,
                m.Status,
                m.AdminResponse,
                Author = m.User != null ? m.User.FullName : "Nieznany",
                m.CreatedAt,
                m.ResolvedAt
            })
            .ToListAsync();

        return Ok(tickets);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.Id == userId);

        var roomNumber = user?.Room?.RoomNumber ?? "Brak pokoju";

        var ticket = new MaintenanceTicket
        {
            UserId = userId,
            Title = request.Title,
            Category = request.Category,
            Description = request.Description,
            RoomNumber = roomNumber,
            Priority = request.Priority,
            Status = "Nowe",
            CreatedAt = DateTime.UtcNow
        };

        _context.MaintenanceTickets.Add(ticket);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, ticket);
    }

    [Authorize]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusRequest request)
    {
        var ticket = await _context.MaintenanceTickets.FindAsync(id);
        if (ticket == null)
        {
            return NotFound(new { message = "Zgłoszenie nie zostało odnalezione." });
        }

        ticket.Status = request.Status;
        if (!string.IsNullOrEmpty(request.AdminResponse))
        {
            ticket.AdminResponse = request.AdminResponse;
        }

        if (request.Status == "Rozwiązane" || request.Status == "Odrzucone")
        {
            ticket.ResolvedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(ticket);
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var id) ? id : 1;
    }
}
