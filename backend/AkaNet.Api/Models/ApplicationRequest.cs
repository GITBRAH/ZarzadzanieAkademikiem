using System.ComponentModel.DataAnnotations;

namespace AkaNet.Api.Models;

public class ApplicationRequest
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public string Type { get; set; } = "Zmiana pokoju"; // Zmiana pokoju, Przedłużenie pobytu, Zgłoszenie gościa, Wymeldowanie, Inne

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Justification { get; set; } = string.Empty;

    public string Status { get; set; } = "Oczekujące"; // Oczekujące, Zaakceptowane, Odrzucone

    public string? AdminComment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ProcessedAt { get; set; }
}
