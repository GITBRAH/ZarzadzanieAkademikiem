using System.ComponentModel.DataAnnotations;

namespace AkaNet.Api.Models;

public class Announcement
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string Category { get; set; } = "Ogólne";

    public string Priority { get; set; } = "normal"; // "normal" (niebieski) or "coral" (czerwony/ważny)

    public string DayBadge { get; set; } = string.Empty; // e.g. "18"

    public string MonthBadge { get; set; } = string.Empty; // e.g. "PAŹ"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
