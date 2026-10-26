using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetVehicleQuery(Guid id) : IRequest<VehicleDto>;

public class GetVehicleQueryHandler : IRequestHandler<GetVehicleQuery, VehicleDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetVehicleQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<VehicleDto> Handle(GetVehicleQuery request, CancellationToken cancellationToken)
    {
        var vehicle = await _dbContext.Vehicles
            .Where(v => v.Id == request.id)
            .Select(v => new VehicleDto
            {
              Id = v.Id,
              Make = v.Make,
              Model = v.Model,
              Year = v.Year,
              Odometer = v.Odometer,
              LicensePlate = v.LicensePlate,
              OwnerName = v.Customer!.Name,
              Rego = v.Rego
            })
            .FirstAsync(cancellationToken);
        
        return vehicle;
    }
}