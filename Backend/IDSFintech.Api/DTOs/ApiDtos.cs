using System.ComponentModel.DataAnnotations;
namespace IDSFintech.Api.DTOs;
public sealed class RegisterRequest { [Required,StringLength(100)] public string Username {get;init;}=""; [Required,EmailAddress,StringLength(200)] public string Email {get;init;}=""; [Required,MinLength(8)] public string Password {get;init;}=""; }
public sealed class LoginRequest { [Required] public string Username {get;init;}=""; [Required] public string Password {get;init;}=""; }
public sealed record UserResponse(int Id,string Username,string Email,int RoleId,string RoleName,string Status);
public sealed record LoginData(string Token,UserResponse User);
public sealed record ApiResponse<T>(string Message,T? Data);
public sealed class ProductRequest { [Required,StringLength(150)] public string Name {get;init;}=""; public string? Description {get;init;} public string? BusinessPurpose {get;init;} [Required] public string LifecycleStatus {get;init;}=""; public string? CurrentVersion {get;init;} public string? SupportedMarkets {get;init;} public string? Criticality {get;init;} public string? Technologies {get;init;} public string? Notes {get;init;} }
public sealed record ProductResponse(int Id,string Name,string? Description,string? BusinessPurpose,string LifecycleStatus,string? CurrentVersion,string? SupportedMarkets,string? Criticality,string? Technologies,string? Notes,DateTime CreatedAt,DateTime? UpdatedAt);
public sealed class ClientRequest { [Required,StringLength(200)] public string CompanyName {get;init;}=""; public string? Country {get;init;} public string? ContactInformation {get;init;} public string? Status {get;init;} public string? Notes {get;init;} }
public sealed record ClientResponse(int Id,string CompanyName,string? Country,string? ContactInformation,string? Status,string? Notes,DateTime CreatedAt);
public sealed record ModuleResponse(int Id,int ProductId,string Name,string? Description,string? Status);
public sealed class DeploymentRequest { [Range(1,int.MaxValue)] public int ClientId {get;init;} [Range(1,int.MaxValue)] public int ProductId {get;init;} public string? ProductVersion {get;init;} public DateOnly? GoLiveDate {get;init;} public string? DeploymentStatus {get;init;} public string? SupportTier {get;init;} public string? ClientSpecificNotes {get;init;} }
public sealed record DeploymentResponse(int Id,int ClientId,int ProductId,string? ProductVersion,DateTime? GoLiveDate,string? DeploymentStatus,string? SupportTier,string? ClientSpecificNotes,string ClientName,string ProductName);
public sealed record DashboardSummary(int Products,int Clients,int Deployments,int TeamMembers,int Modules,int PendingUsers);
public sealed record PendingUserResponse(
    int Id,
    string Username,
    string Email,
    string RoleName,
    string Status,
    DateTime CreatedAt
);
