namespace IDSFintech.Api.Models;

public class ProductResponsibility
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int TeamMemberId { get; set; }

    public string? Responsibility { get; set; }

    public string? Description { get; set; }

    public string? TeamMemberName { get; set; }

    public string? JobTitle { get; set; }

    public string? Department { get; set; }

    public string? Email { get; set; }
}