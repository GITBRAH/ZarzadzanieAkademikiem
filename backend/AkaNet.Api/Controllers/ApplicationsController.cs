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
public class ApplicationsController : ControllerBase
{
    private readonly AkaNetDbContext _context;

    public ApplicationsController(AkaNetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetApplications()
    {
        var userId = GetCurrentUserId();
        var userRole = User.FindFirstValue(ClaimTypes.Role);

        var query = _context.ApplicationRequests.Include(a => a.User).AsQueryable();

        if (userRole != "Admin")
        {
            query = query.Where(a => a.UserId == userId);
        }

        var applications = await query
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.Type,
                a.Title,
                a.Justification,
                a.Status,
                a.AdminComment,
                Applicant = a.User != null ? a.User.FullName : "Nieznany",
                a.CreatedAt,
                a.ProcessedAt
            })
            .ToListAsync();

        return Ok(applications);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateApplication([FromBody] CreateApplicationRequest request)
    {
        var userId = GetCurrentUserId();

        var app = new ApplicationRequest
        {
            UserId = userId,
            Type = request.Type,
            Title = request.Title,
            Justification = request.Justification,
            Status = "Oczekujące",
            CreatedAt = DateTime.UtcNow
        };

        _context.ApplicationRequests.Add(app);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplications), new { id = app.Id }, app);
    }

    [Authorize]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusRequest request)
    {
        var app = await _context.ApplicationRequests.FindAsync(id);
        if (app == null)
        {
            return NotFound(new { message = "Wniosek nie został odnaleziony." });
        }

        app.Status = request.Status;
        if (!string.IsNullOrEmpty(request.AdminComment))
        {
            app.AdminComment = request.AdminComment;
        }
        app.ProcessedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(app);
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out var id) ? id : 1;
    }
}
