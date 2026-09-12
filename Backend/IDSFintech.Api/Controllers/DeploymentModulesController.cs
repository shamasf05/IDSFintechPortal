using IDSFintech.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeploymentModulesController : ControllerBase
{
    private readonly DeploymentModuleService _service;

    public DeploymentModulesController(
        DeploymentModuleService service)
    {
        _service = service;
    }

    [HttpGet("deployment/{deploymentId:int}")]
    public async Task<IActionResult> GetByDeployment(
        int deploymentId)
    {
        var modules =
            await _service.GetByDeploymentIdAsync(
                deploymentId
            );

        return Ok(modules);
    }

    [HttpPost]
    public async Task<IActionResult> Add(
        [FromBody] DeploymentModuleRequest request)
    {
        await _service.AddAsync(
            request.DeploymentId,
            request.ModuleId
        );

        return Ok(new
        {
            message = "Module enabled for deployment."
        });
    }

    [HttpDelete]
    public async Task<IActionResult> Remove(
        [FromQuery] int deploymentId,
        [FromQuery] int moduleId)
    {
        var removed =
            await _service.RemoveAsync(
                deploymentId,
                moduleId
            );

        if (!removed)
            return NotFound();

        return NoContent();
    }
}

public class DeploymentModuleRequest
{
    public int DeploymentId { get; set; }

    public int ModuleId { get; set; }
}