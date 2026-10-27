using System.ComponentModel.DataAnnotations;

namespace AkaNet.Api.Models;

public class Reservation
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int FacilityId { get; set; }
    public Facility? Facility { get; set; }

    [Required]
    public string Date { get; set; } = string.Empty; // e.g. "2026-10-28"

    [Required]
    public string TimeSlot { get; set; } = string.Empty; // e.g. "14:00"

    public int DurationMinutes { get; set; } = 60;

    public string Status { get; set; } = "Confirmed"; // Confirmed, Cancelled, Completed

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
