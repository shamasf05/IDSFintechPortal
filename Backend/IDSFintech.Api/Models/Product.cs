namespace IDSFintech.Api.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Version { get; set; }

    public string? RepositoryUrl { get; set; }

    public string? DocumentationUrl { get; set; }

    public DateTime CreatedAt { get; set; }
}