using MySqlConnector;

namespace IDSFintech.Api.Data;

public interface IDbConnectionFactory
{
    MySqlConnection CreateConnection();
}
