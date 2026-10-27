namespace AkaNet.Api.DTOs;

public record CreateReservationRequest(
    int FacilityId,
    string Date,
    string TimeSlot
);

public record FacilityStatusDto(
    int Id,
    string Name,
    string Location,
    string Type,
    List<string> BusySlots
);
