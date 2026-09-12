using IDSFintech.Api.DTOs;
using IDSFintech.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class EnvironmentsController(EnvironmentRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(int? deploymentId) =>
        Ok(new ApiResponse<object>("Environments retrieved.", await repository.GetAsync(deploymentId)));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id) =>
        await repository.GetAsync(id) is { } item
            ? Ok(new ApiResponse<object>("Environment retrieved.", item))
            : NotFound(new { message = "Environment not found." });

    [HttpPost, Authorize(Roles = "CEO,Manager")]
    public async Task<IActionResult> Create(EnvironmentRequest item)
    {
        var id = await repository.CreateAsync(item);
        return CreatedAtAction(nameof(Get), new { id },
            new ApiResponse<object>("Environment created.", await repository.GetAsync(id)));
    }

    [HttpPut("{id:int}"), Authorize(Roles = "CEO,Manager")]
    public async Task<IActionResult> Update(int id, EnvironmentRequest item) =>
        await repository.UpdateAsync(id, item)
            ? Ok(new { message = "Environment updated." })
            : NotFound(new { message = "Environment not found." });

    [HttpDelete("{id:int}"), Authorize(Roles = "CEO,Manager")]
    public async Task<IActionResult> Delete(int id) =>
        await repository.DeleteAsync(id)
            ? NoContent()
            : NotFound(new { message = "Environment not found." });
}
