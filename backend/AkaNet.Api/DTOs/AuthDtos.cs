namespace AkaNet.Api.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Email, string Password, string FullName, string? PhoneNumber, string RoomNumber);

public record AuthResponse(string Token, UserDto User);

public record UserDto(int Id, string Email, string FullName, string? PhoneNumber, string Role, string? RoomNumber, string? Building);
