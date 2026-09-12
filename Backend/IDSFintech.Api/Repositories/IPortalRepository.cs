using IDSFintech.Api.DTOs;
namespace IDSFintech.Api.Repositories;
public interface IPortalRepository {
 Task<bool> UserExistsAsync(string username,string email); Task<int> CreateUserAsync(string username,string email,string hash); Task<UserLogin?> FindUserAsync(string username);
 Task<IReadOnlyList<ManagedUserResponse>> UsersAsync(); Task<IReadOnlyList<ManagedUserResponse>> PendingEmployeesAsync(); Task<int> CreateManagedUserAsync(CreateManagedUserRequest item,string passwordHash); Task<bool> UpdateManagedUserAsync(int id,UpdateManagedUserRequest item); Task<bool> DeleteUserAsync(int id); Task<bool> SetEmployeeStatusAsync(int id,string status,int approvedBy);
 Task<IReadOnlyList<ProductResponse>> ProductsAsync(string? search); Task<ProductResponse?> ProductAsync(int id); Task<int> AddProductAsync(ProductRequest x); Task<bool> UpdateProductAsync(int id,ProductRequest x); Task<bool> DeleteProductAsync(int id);
 Task<IReadOnlyList<ClientResponse>> ClientsAsync(string? search); Task<ClientResponse?> ClientAsync(int id); Task<int> AddClientAsync(ClientRequest x); Task<bool> UpdateClientAsync(int id,ClientRequest x); Task<bool> DeleteClientAsync(int id);
 Task<IReadOnlyList<ModuleResponse>> ModulesAsync(int? productId); Task<IReadOnlyList<DeploymentResponse>> DeploymentsAsync(int? clientId,int? productId); Task<int> AddDeploymentAsync(DeploymentRequest x); Task<bool> UpdateDeploymentAsync(int id,DeploymentRequest x); Task<bool> DeleteDeploymentAsync(int id); Task<DashboardSummary> SummaryAsync();
}
public sealed record UserLogin(int Id,string Username,string Email,string PasswordHash,int RoleId,string RoleName,string Status);
