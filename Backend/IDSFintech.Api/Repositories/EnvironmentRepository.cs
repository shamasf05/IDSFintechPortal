using Dapper;
using IDSFintech.Api.Data;
using IDSFintech.Api.DTOs;

namespace IDSFintech.Api.Repositories;

public sealed class EnvironmentRepository(IDbConnectionFactory factory)
{
    public async Task<IReadOnlyList<EnvironmentResponse>> GetAsync(int? deploymentId)
    {
        await using var connection = factory.CreateConnection();
        return (await connection.QueryAsync<EnvironmentResponse>(
            "SELECT * FROM Environments WHERE @deploymentId IS NULL OR DeploymentId = @deploymentId ORDER BY Name",
            new { deploymentId })).AsList();
    }

    public async Task<EnvironmentResponse?> GetAsync(int id)
    {
        await using var connection = factory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<EnvironmentResponse>(
            "SELECT * FROM Environments WHERE Id = @id", new { id });
    }

    public async Task<int> CreateAsync(EnvironmentRequest item)
    {
        const string sql = "INSERT INTO Environments (DeploymentId,Name,EnvironmentType,Purpose,ServerName,OperatingSystem,ApplicationUrl,DatabaseInformation,MonitoringLink,AccessInstructions,Notes) VALUES (@DeploymentId,@Name,@EnvironmentType,@Purpose,@ServerName,@OperatingSystem,@ApplicationUrl,@DatabaseInformation,@MonitoringLink,@AccessInstructions,@Notes); SELECT LAST_INSERT_ID();";
        await using var connection = factory.CreateConnection();
        return await connection.QuerySingleAsync<int>(sql, item);
    }

    public async Task<bool> UpdateAsync(int id, EnvironmentRequest item)
    {
        const string sql = "UPDATE Environments SET DeploymentId=@DeploymentId,Name=@Name,EnvironmentType=@EnvironmentType,Purpose=@Purpose,ServerName=@ServerName,OperatingSystem=@OperatingSystem,ApplicationUrl=@ApplicationUrl,DatabaseInformation=@DatabaseInformation,MonitoringLink=@MonitoringLink,AccessInstructions=@AccessInstructions,Notes=@Notes WHERE Id=@id";
        await using var connection = factory.CreateConnection();
        return await connection.ExecuteAsync(sql, new { id, item.DeploymentId, item.Name, item.EnvironmentType, item.Purpose, item.ServerName, item.OperatingSystem, item.ApplicationUrl, item.DatabaseInformation, item.MonitoringLink, item.AccessInstructions, item.Notes }) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        await using var connection = factory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM Environments WHERE Id=@id", new { id }) > 0;
    }
}
