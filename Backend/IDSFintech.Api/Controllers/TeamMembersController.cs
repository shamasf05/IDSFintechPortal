using IDSFintech.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IDSFintech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly TeamMemberService _service;

    public TeamMembersController(TeamMemberService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await _service.GetByIdAsync(id);

        if (member == null)
            return NotFound();

        return Ok(member);
    }
}