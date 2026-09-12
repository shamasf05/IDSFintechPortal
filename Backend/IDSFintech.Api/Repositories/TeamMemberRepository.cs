using Dapper;
using IDSFintech.Api.Models;
using MySqlConnector;

namespace IDSFintech.Api.Repositories;

public class TeamMemberRepository
{
    private readonly IConfiguration _configuration;

    public TeamMemberRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private MySqlConnection CreateConnection()
    {
        return new MySqlConnection(
            _configuration.GetConnectionString("DefaultConnection"));
    }

    public async Task<IEnumerable<TeamMember>> GetAllAsync()
    {
        using var connection = CreateConnection();

        const string sql = @"
            SELECT
                u.Id,
                u.Username AS FullName,
                NULL AS JobTitle,
                NULL AS Department,
                u.Email,
                u.Status
            FROM Users u
            INNER JOIN Roles r ON u.RoleId = r.Id
            WHERE r.Name = 'Employee'
              AND u.Status = 'Active'
            ORDER BY u.Username;
        ";

        return await connection.QueryAsync<TeamMember>(sql);
    }

    public async Task<TeamMember?> GetByIdAsync(int id)
    {
        using var connection = CreateConnection();

        const string sql = @"
            SELECT
                u.Id,
                u.Username AS FullName,
                NULL AS JobTitle,
                NULL AS Department,
                u.Email,
                u.Status
            FROM Users u
            INNER JOIN Roles r ON u.RoleId = r.Id
            WHERE u.Id = @Id
              AND r.Name = 'Employee'
              AND u.Status = 'Active';
        ";

        return await connection.QueryFirstOrDefaultAsync<TeamMember>(
            sql,
            new { Id = id });
    }
}