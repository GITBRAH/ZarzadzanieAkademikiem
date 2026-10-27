namespace AkaNet.Api.DTOs;

public record CreateApplicationRequest(
    string Type,
    string Title,
    string Justification
);

public record UpdateApplicationStatusRequest(
    string Status,
    string? AdminComment
);
