using System.Security.Claims;
using IDSFintech.Api.DTOs;
using IDSFintech.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController, Authorize, Route("api/[controller]")]
public sealed class UsersController(IPortalRepository repository) : ControllerBase
{
    [HttpGet, Authorize(Roles = "CEO")]
    public async Task<IActionResult> GetAll() => Ok(new ApiResponse<object>("Users retrieved.", await repository.UsersAsync()));

    [HttpGet("pending"), Authorize(Roles = "CEO,Manager")]
    public async Task<IActionResult> Pending() => Ok(new ApiResponse<object>("Pending employees retrieved.", await repository.PendingEmployeesAsync()));

    [HttpPost, Authorize(Roles = "CEO")]
    public async Task<IActionResult> Create(CreateManagedUserRequest request)
    {
        if (await repository.UserExistsAsync(request.Username, request.Email))
            return Conflict(new { message = "Username or email is already registered." });
        var id = await repository.CreateManagedUserAsync(request, BCrypt.Net.BCrypt.HashPassword(request.Password));
        return Created($"/api/users/{id}", new { message = "User created.", data = new { id } });
    }

    [HttpPut("{id:int}"), Authorize(Roles = "CEO")]
    public async Task<IActionResult> Update(int id, UpdateManagedUserRequest request) =>
        await repository.UpdateManagedUserAsync(id, request) ? Ok(new { message = "User updated." }) : NotFound(new { message = "User not found." });

    [HttpPut("{id:int}/approve"), Authorize(Roles = "CEO,Manager")]
    public Task<IActionResult> Approve(int id) => SetStatus(id, "Active", "Employee approved.");

    [HttpPut("{id:int}/reject"), Authorize(Roles = "CEO,Manager")]
    public Task<IActionResult> Reject(int id) => SetStatus(id, "Rejected", "Employee rejected.");

    [HttpDelete("{id:int}"), Authorize(Roles = "CEO")]
    public async Task<IActionResult> Delete(int id) =>
        await repository.DeleteUserAsync(id) ? NoContent() : NotFound(new { message = "User not found." });

    private async Task<IActionResult> SetStatus(int id, string status, string message)
    {
        var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await repository.SetEmployeeStatusAsync(id, status, actorId)
            ? Ok(new { message })
            : NotFound(new { message = "Pending employee not found." });
    }
}
