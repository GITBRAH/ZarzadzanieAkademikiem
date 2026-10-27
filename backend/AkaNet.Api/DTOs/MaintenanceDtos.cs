namespace AkaNet.Api.DTOs;

public record CreateTicketRequest(
    string Title,
    string Category,
    string Description,
    string Priority
);

public record UpdateTicketStatusRequest(
    string Status,
    string? AdminResponse
);
