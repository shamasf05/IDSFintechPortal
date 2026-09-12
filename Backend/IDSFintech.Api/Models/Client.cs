namespace IDSFintech.Api.Models;

public class Client
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? ContactEmail { get; set; }

    public DateTime CreatedAt { get; set; }
}