using Dapper;
using IDSFintech.Api.Models;
using MySqlConnector;

namespace IDSFintech.Api.Repositories;

public class ProductResponsibilityRepository
{
    private readonly IConfiguration _configuration;

    public ProductResponsibilityRepository(
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

 public async Task<IEnumerable<ProductResponsibility>> GetByProductIdAsync(int productId)
{
    using var connection = CreateConnection();

    const string sql = @"
        SELECT
            pr.Id,
            pr.ProductId,
            pr.TeamMemberId,
            pr.Responsibility,
            pr.Description,

            u.Username AS TeamMemberName,
            NULL AS JobTitle,
            NULL AS Department,
            u.Email

        FROM ProductResponsibilities pr

        INNER JOIN Users u
            ON pr.TeamMemberId = u.Id

        WHERE pr.ProductId = @ProductId

        ORDER BY u.Username;
    ";

    return await connection.QueryAsync<ProductResponsibility>(
        sql,
        new { ProductId = productId });
}

    public async Task<int> CreateAsync(
        ProductResponsibility responsibility)
    {
        using var connection = CreateConnection();

        const string sql = """
            INSERT INTO ProductResponsibilities
                (
                    ProductId,
                    TeamMemberId,
                    Responsibility,
                    Description
                )
            VALUES
                (
                    @ProductId,
                    @TeamMemberId,
                    @Responsibility,
                    @Description
                );

            SELECT LAST_INSERT_ID();
        """;

        return await connection.ExecuteScalarAsync<int>(
            sql,
            responsibility
        );
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = CreateConnection();

        const string sql = """
            DELETE FROM ProductResponsibilities
            WHERE Id = @Id
        """;

        var rows = await connection.ExecuteAsync(
            sql,
            new { Id = id }
        );

        return rows > 0;
    }
}