using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AkaNet.Api.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string Role { get; set; } = "Resident"; // Resident, Admin, Staff

    public int? RoomId { get; set; }
    public Room? Room { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
