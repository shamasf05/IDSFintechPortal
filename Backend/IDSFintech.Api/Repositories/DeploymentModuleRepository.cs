using Dapper;
using IDSFintech.Api.DTOs;
using MySqlConnector;

namespace IDSFintech.Api.Repositories;

public class DeploymentModuleRepository
{
    private readonly IConfiguration _configuration;

    public DeploymentModuleRepository(
        IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private MySqlConnection CreateConnection()
    {
        return new MySqlConnection(
            _configuration.GetConnectionString("DefaultConnection")
        );
    }

    public async Task<IEnumerable<DeploymentModuleDto>>
        GetByDeploymentIdAsync(int deploymentId)
    {
        using var connection = CreateConnection();

        const string sql = """
            SELECT
                dm.DeploymentId,
                m.Id AS ModuleId,
                m.Name AS ModuleName,
                m.Description,
                m.Status,
                TRUE AS Enabled

            FROM DeploymentModules dm

            INNER JOIN Modules m
                ON m.Id = dm.ModuleId

            WHERE dm.DeploymentId = @DeploymentId

            ORDER BY m.Name
        """;

        return await connection.QueryAsync<DeploymentModuleDto>(
            sql,
            new { DeploymentId = deploymentId }
        );
    }

    public async Task AddAsync(
        int deploymentId,
        int moduleId)
    {
        using var connection = CreateConnection();

        const string sql = """
            INSERT IGNORE INTO DeploymentModules
                (DeploymentId, ModuleId)
            VALUES
                (@DeploymentId, @ModuleId)
        """;

        await connection.ExecuteAsync(
            sql,
            new
            {
                DeploymentId = deploymentId,
                ModuleId = moduleId
            }
        );
    }

    public async Task<bool> RemoveAsync(
        int deploymentId,
        int moduleId)
    {
        using var connection = CreateConnection();

        const string sql = """
            DELETE FROM DeploymentModules
            WHERE DeploymentId = @DeploymentId
              AND ModuleId = @ModuleId
        """;

        var rows = await connection.ExecuteAsync(
            sql,
            new
            {
                DeploymentId = deploymentId,
                ModuleId = moduleId
            }
        );

        return rows > 0;
    }
}