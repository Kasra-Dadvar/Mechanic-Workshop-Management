using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetCustomerVehiclesQuery(Guid id) : IRequest<List<VehicleDto>>;

public class GetCustomerVehiclesQueryHandler : IRequestHandler<GetCustomerVehiclesQuery, List<VehicleDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCustomerVehiclesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<VehicleDto>> Handle(GetCustomerVehiclesQuery request, CancellationToken cancellationToken)
    {
        var vehicles = await _dbContext.Customers
                       .Where(c => c.Id == request.id)
                       .SelectMany(c => c.Vehicles)
                       .Select(c => new VehicleDto
                       {
                           Id = c.Id,
                           Make = c.Make,
                           Model = c.Model,
                           Year = c.Year,
                           Odometer = c.Odometer,
                           LicensePlate = c.LicensePlate,
                           Rego = c.Rego
                       })
                       .ToListAsync();
        
        return vehicles;

    }
}