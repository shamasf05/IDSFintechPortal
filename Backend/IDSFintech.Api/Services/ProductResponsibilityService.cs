using IDSFintech.Api.DTOs;
using IDSFintech.Api.Models;
using IDSFintech.Api.Repositories;

namespace IDSFintech.Api.Services;

public class ProductResponsibilityService
{
    private readonly ProductResponsibilityRepository _repository;

    public ProductResponsibilityService(
        ProductResponsibilityRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProductResponsibilityDto>>
        GetByProductIdAsync(int productId)
    {
        var responsibilities =
            await _repository.GetByProductIdAsync(productId);

        return responsibilities.Select(x =>
            new ProductResponsibilityDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                TeamMemberId = x.TeamMemberId,
                Responsibility = x.Responsibility,
                Description = x.Description,
                TeamMemberName = x.TeamMemberName,
                JobTitle = x.JobTitle,
                Department = x.Department,
                Email = x.Email
            });
    }

    public async Task<int> CreateAsync(
        ProductResponsibilityDto dto)
    {
        var responsibility = new ProductResponsibility
        {
            ProductId = dto.ProductId,
            TeamMemberId = dto.TeamMemberId,
            Responsibility = dto.Responsibility,
            Description = dto.Description
        };

        return await _repository.CreateAsync(responsibility);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}
