using IDSFintech.Api.DTOs;
using IDSFintech.Api.Repositories;

namespace IDSFintech.Api.Services;

public class DeploymentModuleService
{
    private readonly DeploymentModuleRepository _repository;

    public DeploymentModuleService(
        DeploymentModuleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<DeploymentModuleDto>>
        GetByDeploymentIdAsync(int deploymentId)
    {
        return await _repository.GetByDeploymentIdAsync(
            deploymentId
        );
    }

    public async Task AddAsync(
        int deploymentId,
        int moduleId)
    {
        await _repository.AddAsync(
            deploymentId,
            moduleId
        );
    }

    public async Task<bool> RemoveAsync(
        int deploymentId,
        int moduleId)
    {
        return await _repository.RemoveAsync(
            deploymentId,
            moduleId
        );
    }
}