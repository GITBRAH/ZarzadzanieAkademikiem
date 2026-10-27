using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AkaNet.Api.Models;

public class Facility
{
    public int Id { get; set; }

    [Required]
    public string Type { get; set; } = "Laundry"; // "Laundry" or "Court"

    [Required]
    public string Name { get; set; } = string.Empty; // e.g. "Pralka 01", "Boisko wielofunkcyjne"

    [Required]
    public string Location { get; set; } = string.Empty; // e.g. "Pralnia · Budynek B"

    public string Status { get; set; } = "Active"; // Active, OutOfOrder

    [JsonIgnore]
    public List<Reservation> Reservations { get; set; } = new();
}
