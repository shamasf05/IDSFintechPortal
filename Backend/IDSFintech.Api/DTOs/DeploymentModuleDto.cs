namespace IDSFintech.Api.DTOs;

public class DeploymentModuleDto
{
    public int DeploymentId { get; set; }

    public int ModuleId { get; set; }

    public string ModuleName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Status { get; set; }

    public bool Enabled { get; set; }
}