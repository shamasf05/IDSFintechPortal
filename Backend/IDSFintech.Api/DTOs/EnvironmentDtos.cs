using System.ComponentModel.DataAnnotations;

namespace IDSFintech.Api.DTOs;

public sealed class EnvironmentRequest
{
    [Range(1, int.MaxValue)]
    public int DeploymentId { get; init; }

    [Required, StringLength(100)]
    public string Name { get; init; } = string.Empty;

    [StringLength(50)] public string? EnvironmentType { get; init; }
    [StringLength(500)] public string? Purpose { get; init; }
    [StringLength(200)] public string? ServerName { get; init; }
    [StringLength(100)] public string? OperatingSystem { get; init; }
    [StringLength(500)] public string? ApplicationUrl { get; init; }
    [StringLength(500)] public string? DatabaseInformation { get; init; }
    [StringLength(500)] public string? MonitoringLink { get; init; }
    [StringLength(500)] public string? AccessInstructions { get; init; }
    [StringLength(1000)] public string? Notes { get; init; }
}

public sealed record EnvironmentResponse(
    int Id, int DeploymentId, string Name, string? EnvironmentType,
    string? Purpose, string? ServerName, string? OperatingSystem,
    string? ApplicationUrl, string? DatabaseInformation, string? MonitoringLink,
    string? AccessInstructions, string? Notes);
