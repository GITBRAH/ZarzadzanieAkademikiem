using System.ComponentModel.DataAnnotations;

namespace AkaNet.Api.Models;

public class MaintenanceTicket
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = "Inne"; // Hydraulika, Elektryka, Meble, Sieć / Internet, Inne

    [Required]
    public string Description { get; set; } = string.Empty;

    public string RoomNumber { get; set; } = string.Empty;

    public string Priority { get; set; } = "Średni"; // Niski, Średni, Wysoki, Pilny

    public string Status { get; set; } = "Nowe"; // Nowe, W trakcie, Rozwiązane, Odrzucone

    public string? AdminResponse { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }
}
