namespace IDSFintech.Api.Models;

public class Environment
{
    public int Id { get; set; }

    public int DeploymentId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? EnvironmentType { get; set; }

    public string? Purpose { get; set; }

    public string? ServerName { get; set; }

    public string? OperatingSystem { get; set; }

    public string? ApplicationUrl { get; set; }

    public string? DatabaseInformation { get; set; }

    public string? MonitoringLink { get; set; }

    public string? AccessInstructions { get; set; }

    public string? Notes { get; set; }
}
