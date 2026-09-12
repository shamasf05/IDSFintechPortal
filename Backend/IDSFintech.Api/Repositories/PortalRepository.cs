using Dapper;
using IDSFintech.Api.Data;
using IDSFintech.Api.DTOs;
namespace IDSFintech.Api.Repositories;
public sealed partial class PortalRepository(IDbConnectionFactory factory) : IPortalRepository {
 private async Task<T> One<T>(string sql,object? p=null){await using var c=factory.CreateConnection();return await c.QuerySingleAsync<T>(sql,p);}
 private async Task<IReadOnlyList<T>> Many<T>(string sql,object? p=null){await using var c=factory.CreateConnection();return (await c.QueryAsync<T>(sql,p)).AsList();}
 private async Task<bool> Exec(string sql,object p){await using var c=factory.CreateConnection();return await c.ExecuteAsync(sql,p)>0;}
 public async Task<bool> UserExistsAsync(string u,string e)=>(await One<int>("SELECT COUNT(*) FROM Users WHERE Username=@u OR Email=@e",new{u,e}))>0;
public Task<int> CreateUserAsync(string u, string e, string h)
    => One<int>(
        "INSERT INTO Users (Username, Email, PasswordHash, RoleId, Status) " +
        "SELECT @u, @e, @h, Id, 'Pending' " +
        "FROM Roles WHERE Name = 'Employee'; " +
        "SELECT LAST_INSERT_ID();",
        new { u, e, h }
    );
 public async Task<UserLogin?> FindUserAsync(string u){await using var c=factory.CreateConnection();return await c.QuerySingleOrDefaultAsync<UserLogin>("SELECT u.Id,u.Username,u.Email,u.PasswordHash,u.RoleId,r.Name RoleName,u.Status FROM Users u JOIN Roles r ON r.Id=u.RoleId WHERE u.Username=@u",new{u});}
 public Task<IReadOnlyList<ProductResponse>> ProductsAsync(string? s)=>Many<ProductResponse>("SELECT * FROM Products WHERE @s='' OR Name LIKE CONCAT('%',@s,'%') ORDER BY Name",new{s=s??""});
 public async Task<ProductResponse?> ProductAsync(int id){await using var c=factory.CreateConnection();return await c.QuerySingleOrDefaultAsync<ProductResponse>("SELECT * FROM Products WHERE Id=@id",new{id});}
 public Task<int> AddProductAsync(ProductRequest x)=>One<int>("INSERT INTO Products(Name,Description,BusinessPurpose,LifecycleStatus,CurrentVersion,SupportedMarkets,Criticality,Technologies,Notes) VALUES(@Name,@Description,@BusinessPurpose,@LifecycleStatus,@CurrentVersion,@SupportedMarkets,@Criticality,@Technologies,@Notes); SELECT LAST_INSERT_ID();",x);
 public Task<bool> UpdateProductAsync(int id,ProductRequest x)=>Exec("UPDATE Products SET Name=@Name,Description=@Description,BusinessPurpose=@BusinessPurpose,LifecycleStatus=@LifecycleStatus,CurrentVersion=@CurrentVersion,SupportedMarkets=@SupportedMarkets,Criticality=@Criticality,Technologies=@Technologies,Notes=@Notes,UpdatedAt=UTC_TIMESTAMP() WHERE Id=@id",new{id,x.Name,x.Description,x.BusinessPurpose,x.LifecycleStatus,x.CurrentVersion,x.SupportedMarkets,x.Criticality,x.Technologies,x.Notes});
 public Task<bool> DeleteProductAsync(int id)=>Exec("DELETE FROM Products WHERE Id=@id",new{id});
 public Task<IReadOnlyList<ClientResponse>> ClientsAsync(string? s)=>Many<ClientResponse>("SELECT * FROM Clients WHERE @s='' OR CompanyName LIKE CONCAT('%',@s,'%') ORDER BY CompanyName",new{s=s??""});
 public async Task<ClientResponse?> ClientAsync(int id){await using var c=factory.CreateConnection();return await c.QuerySingleOrDefaultAsync<ClientResponse>("SELECT * FROM Clients WHERE Id=@id",new{id});}
 public Task<int> AddClientAsync(ClientRequest x)=>One<int>("INSERT INTO Clients(CompanyName,Country,ContactInformation,Status,Notes) VALUES(@CompanyName,@Country,@ContactInformation,@Status,@Notes); SELECT LAST_INSERT_ID();",x);
 public Task<bool> UpdateClientAsync(int id,ClientRequest x)=>Exec("UPDATE Clients SET CompanyName=@CompanyName,Country=@Country,ContactInformation=@ContactInformation,Status=@Status,Notes=@Notes WHERE Id=@id",new{id,x.CompanyName,x.Country,x.ContactInformation,x.Status,x.Notes});
 public Task<bool> DeleteClientAsync(int id)=>Exec("DELETE FROM Clients WHERE Id=@id",new{id});
 public Task<IReadOnlyList<ModuleResponse>> ModulesAsync(int? id)=>Many<ModuleResponse>("SELECT * FROM Modules WHERE @id IS NULL OR ProductId=@id ORDER BY Name",new{id});
 public Task<IReadOnlyList<DeploymentResponse>> DeploymentsAsync(int? c,int? p)=>Many<DeploymentResponse>("SELECT d.*,c.CompanyName ClientName,p.Name ProductName FROM Deployments d JOIN Clients c ON c.Id=d.ClientId JOIN Products p ON p.Id=d.ProductId WHERE (@c IS NULL OR d.ClientId=@c) AND (@p IS NULL OR d.ProductId=@p) ORDER BY d.Id DESC",new{c,p});
 public Task<int> AddDeploymentAsync(DeploymentRequest x)=>One<int>("INSERT INTO Deployments(ClientId,ProductId,ProductVersion,GoLiveDate,DeploymentStatus,SupportTier,ClientSpecificNotes) VALUES(@ClientId,@ProductId,@ProductVersion,@GoLiveDate,@DeploymentStatus,@SupportTier,@ClientSpecificNotes); SELECT LAST_INSERT_ID();",x);
 public Task<bool> UpdateDeploymentAsync(int id,DeploymentRequest x)=>Exec("UPDATE Deployments SET ClientId=@ClientId,ProductId=@ProductId,ProductVersion=@ProductVersion,GoLiveDate=@GoLiveDate,DeploymentStatus=@DeploymentStatus,SupportTier=@SupportTier,ClientSpecificNotes=@ClientSpecificNotes WHERE Id=@id",new{id,x.ClientId,x.ProductId,x.ProductVersion,x.GoLiveDate,x.DeploymentStatus,x.SupportTier,x.ClientSpecificNotes});
 public Task<bool> DeleteDeploymentAsync(int id)=>Exec("DELETE FROM Deployments WHERE Id=@id",new{id});
 public async Task<DashboardSummary> SummaryAsync(){ await using var c=factory.CreateConnection(); var sql="SELECT (SELECT COUNT(*) FROM Products) Products,(SELECT COUNT(*) FROM Clients) Clients,(SELECT COUNT(*) FROM Deployments) Deployments,(SELECT COUNT(*) FROM TeamMembers) TeamMembers,(SELECT COUNT(*) FROM Modules) Modules,(SELECT COUNT(*) FROM Users WHERE Status=''Pending'') PendingUsers"; var row=await c.QuerySingleAsync(sql); return new DashboardSummary((int)row.Products,(int)row.Clients,(int)row.Deployments,(int)row.TeamMembers,(int)row.Modules,(int)row.PendingUsers); }
public Task<IReadOnlyList<PendingUserResponse>> GetPendingUsersAsync()
    => Many<PendingUserResponse>(
        @"SELECT 
              u.Id,
              u.Username,
              u.Email,
              r.Name AS RoleName,
              u.Status,
              u.CreatedAt
          FROM Users u
          JOIN Roles r ON r.Id = u.RoleId
          WHERE u.Status = 'Pending'
          ORDER BY u.CreatedAt DESC"
    );

public Task<bool> ApproveUserAsync(int userId)
    => Exec(
        "UPDATE Users SET Status = 'Active' WHERE Id = @userId AND Status = 'Pending'",
        new { userId }
    );
}

