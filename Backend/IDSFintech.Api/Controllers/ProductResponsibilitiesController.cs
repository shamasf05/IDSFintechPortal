using IDSFintech.Api.DTOs;
using IDSFintech.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductResponsibilitiesController : ControllerBase
{
    private readonly ProductResponsibilityService _service;

    public ProductResponsibilitiesController(
        ProductResponsibilityService service)
    {
        _service = service;
    }

    [HttpGet("product/{productId:int}")]
    public async Task<IActionResult> GetByProduct(
        int productId)
    {
        var result =
            await _service.GetByProductIdAsync(productId);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        ProductResponsibilityDto dto)
    {
        if (dto.ProductId <= 0)
            return BadRequest("Product is required.");

        if (dto.TeamMemberId <= 0)
            return BadRequest("Team member is required.");

        var id = await _service.CreateAsync(dto);

        return Ok(new
        {
            id,
            message = "Product responsibility created successfully."
        });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}