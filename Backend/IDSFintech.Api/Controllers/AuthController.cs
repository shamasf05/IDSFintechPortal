using IDSFintech.Api.DTOs;
using IDSFintech.Api.Repositories;
using IDSFintech.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(
    IPortalRepository repo,
    JwtService jwt
) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest x)
    {
        if (await repo.UserExistsAsync(x.Username, x.Email))
        {
            return Conflict(new
            {
                message = "Username or email is already registered."
            });
        }

        await repo.CreateUserAsync(
            x.Username,
            x.Email,
            BCrypt.Net.BCrypt.HashPassword(x.Password)
        );

        return Ok(new
        {
            message = "Registration submitted. An administrator must approve your account."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest x)
    {
        var u = await repo.FindUserAsync(x.Username);

        // User does not exist or password is incorrect
        if (u is null ||
            !BCrypt.Net.BCrypt.Verify(x.Password, u.PasswordHash))
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        // Only Employees require approval.
        // CEO and Manager can log in immediately when Active.
        if (u.RoleId == 3 &&
            !string.Equals(u.Status, "Active", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new
            {
                message = "Your account is awaiting approval."
            });
        }

        // CEO and Manager must be Active.
        if (u.RoleId != 3 &&
            !string.Equals(u.Status, "Active", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new
            {
                message = "Your account is inactive."
            });
        }

        var user = new UserResponse(
            u.Id,
            u.Username,
            u.Email,
            u.RoleId,
            u.RoleName,
            u.Status
        );

        return Ok(
            new ApiResponse<LoginData>(
                "Login successful.",
                new LoginData(
                    jwt.Create(u),
                    user
                )
            )
        );
    }
}