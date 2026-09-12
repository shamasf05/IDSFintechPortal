using MySqlConnector;

namespace IDSFintech.Api.Data;

public sealed class DbConnectionFactory(IConfiguration configuration) : IDbConnectionFactory
{
    public MySqlConnection CreateConnection()
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
        return new MySqlConnection(connectionString);
    }
}
