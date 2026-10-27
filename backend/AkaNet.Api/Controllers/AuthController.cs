using System.Security.Claims;
using AkaNet.Api.Data;
using AkaNet.Api.DTOs;
using AkaNet.Api.Models;
using AkaNet.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkaNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AkaNetDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(AkaNetDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Room)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Nieprawidłowy adres email lub hasło." });
        }

        var token = _jwtService.GenerateToken(user);
        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.FullName,
            user.PhoneNumber,
            user.Role,
            user.Room?.RoomNumber,
            user.Room?.Building
        );

        return Ok(new AuthResponse(token, userDto));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return BadRequest(new { message = "Użytkownik o podanym adresie email już istnieje." });
        }

        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomNumber == request.RoomNumber);

        var newUser = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Role = "Resident",
            RoomId = room?.Id
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(newUser);
        var userDto = new UserDto(
            newUser.Id,
            newUser.Email,
            newUser.FullName,
            newUser.PhoneNumber,
            newUser.Role,
            room?.RoomNumber,
            room?.Building
        );

        return Ok(new AuthResponse(token, userDto));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Room)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.FullName,
            user.PhoneNumber,
            user.Role,
            user.Room?.RoomNumber,
            user.Room?.Building
        );

        return Ok(userDto);
    }
}
