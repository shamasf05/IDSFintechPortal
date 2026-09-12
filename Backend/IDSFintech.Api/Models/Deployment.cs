namespace IDSFintech.Api.Models;

public class Deployment
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int ProductId { get; set; }

    public string? ProductVersion { get; set; }

    public DateOnly? GoLiveDate { get; set; }

    public string? DeploymentStatus { get; set; }

    public string? SupportTier { get; set; }

    public string? ClientSpecificNotes { get; set; }
}
