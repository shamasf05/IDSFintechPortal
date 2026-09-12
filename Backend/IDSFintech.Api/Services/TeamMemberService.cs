using IDSFintech.Api.DTOs;
using IDSFintech.Api.Repositories;

namespace IDSFintech.Api.Services;

public class TeamMemberService
{
    private readonly TeamMemberRepository _repository;

    public TeamMemberService(TeamMemberRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TeamMemberDto>> GetAllAsync()
    {
        var members = await _repository.GetAllAsync();

        return members.Select(member => new TeamMemberDto
        {
            Id = member.Id,
            FullName = member.FullName,
            JobTitle = member.JobTitle,
            Department = member.Department,
            Email = member.Email,
            Status = member.Status
        });
    }

    public async Task<TeamMemberDto?> GetByIdAsync(int id)
    {
        var member = await _repository.GetByIdAsync(id);

        if (member == null)
            return null;

        return new TeamMemberDto
        {
            Id = member.Id,
            FullName = member.FullName,
            JobTitle = member.JobTitle,
            Department = member.Department,
            Email = member.Email,
            Status = member.Status
        };
    }
}