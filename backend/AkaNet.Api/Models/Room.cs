using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AkaNet.Api.Models;

public class Room
{
    public int Id { get; set; }

    [Required]
    public string RoomNumber { get; set; } = string.Empty; // e.g. "202B"

    [Required]
    public string Building { get; set; } = string.Empty; // e.g. "Budynek B"

    public int Floor { get; set; } = 2;

    public int Capacity { get; set; } = 2;

    public decimal MonthlyRent { get; set; } = 650.00m;

    public decimal Deposit { get; set; } = 1000.00m;

    [JsonIgnore]
    public List<User> Residents { get; set; } = new();
}
