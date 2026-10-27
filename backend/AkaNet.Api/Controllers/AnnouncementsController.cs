using AkaNet.Api.Data;
using AkaNet.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkaNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly AkaNetDbContext _context;

    public AnnouncementsController(AkaNetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAnnouncements()
    {
        var announcements = await _context.Announcements
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(announcements);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateAnnouncement([FromBody] Announcement announcement)
    {
        announcement.CreatedAt = DateTime.UtcNow;
        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnnouncements), new { id = announcement.Id }, announcement);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnnouncement(int id)
    {
        var item = await _context.Announcements.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        _context.Announcements.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ogłoszenie usunięte." });
    }
}
