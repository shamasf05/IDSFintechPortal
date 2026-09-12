using System.ComponentModel.DataAnnotations;
namespace IDSFintech.Api.DTOs;
public sealed record ManagedUserResponse(int Id,string Username,string Email,int RoleId,string RoleName,string Status,DateTime CreatedAt,DateTime? ApprovedAt,int? ApprovedBy);
public sealed class CreateManagedUserRequest { [Required,StringLength(100)] public string Username {get;init;}=""; [Required,EmailAddress] public string Email {get;init;}=""; [Required,MinLength(8)] public string Password {get;init;}=""; [Required] public string RoleName {get;init;}="Employee"; }
public sealed class UpdateManagedUserRequest { [Required] public string RoleName {get;init;}="Employee"; [Required] public string Status {get;init;}="Active"; }
