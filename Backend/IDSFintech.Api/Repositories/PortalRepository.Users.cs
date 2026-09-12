using IDSFintech.Api.DTOs;
namespace IDSFintech.Api.Repositories;
public sealed partial class PortalRepository {
 public Task<IReadOnlyList<ManagedUserResponse>> UsersAsync()=>Many<ManagedUserResponse>("SELECT u.Id,u.Username,u.Email,u.RoleId,r.Name RoleName,u.Status,u.CreatedAt,u.ApprovedAt,u.ApprovedBy FROM Users u JOIN Roles r ON r.Id=u.RoleId ORDER BY r.Name,u.Username");
 public Task<IReadOnlyList<ManagedUserResponse>> PendingEmployeesAsync()=>Many<ManagedUserResponse>("SELECT u.Id,u.Username,u.Email,u.RoleId,r.Name RoleName,u.Status,u.CreatedAt,u.ApprovedAt,u.ApprovedBy FROM Users u JOIN Roles r ON r.Id=u.RoleId WHERE u.Status='Pending' AND r.Name='Employee' ORDER BY u.CreatedAt");
 public Task<int> CreateManagedUserAsync(CreateManagedUserRequest x,string hash)=>One<int>("INSERT INTO Users(Username,Email,PasswordHash,RoleId,Status,ApprovedAt) SELECT @Username,@Email,@hash,Id,'Active',UTC_TIMESTAMP() FROM Roles WHERE Name=@RoleName; SELECT LAST_INSERT_ID();",new{x.Username,x.Email,hash,x.RoleName});
 public Task<bool> UpdateManagedUserAsync(int id,UpdateManagedUserRequest x)=>Exec("UPDATE Users u JOIN Roles r ON r.Name=@RoleName SET u.RoleId=r.Id,u.Status=@Status WHERE u.Id=@id",new{id,x.RoleName,x.Status});
 public Task<bool> DeleteUserAsync(int id)=>Exec("DELETE FROM Users WHERE Id=@id",new{id});
 public Task<bool> SetEmployeeStatusAsync(int id,string status,int approvedBy)=>Exec("UPDATE Users u JOIN Roles r ON r.Id=u.RoleId SET u.Status=@status,u.ApprovedAt=UTC_TIMESTAMP(),u.ApprovedBy=@approvedBy WHERE u.Id=@id AND u.Status='Pending' AND r.Name='Employee'",new{id,status,approvedBy});
}
