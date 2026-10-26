using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetVehicleServicesQuery(Guid id) : IRequest<List<ServiceDto>>;

public class GetVehicleServicesQueryHandler : IRequestHandler<GetVehicleServicesQuery, List<ServiceDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetVehicleServicesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ServiceDto>> Handle(GetVehicleServicesQuery request, CancellationToken cancellationToken)
    {
        var listServices = await _dbContext.Vehicles
                          .Where(v => v.Id == request.id)
                          .SelectMany(v => v.Services)
                          .Select(v => new ServiceDto
                          {
                              Id = v.Id,
                              Name = v.Name,
                              Cost = v.Cost,
                              ServicedAt = v.ServicedAt,
                              NextServiceDue = v.NextServiceDue,
                              NextOdometerDue = v.NextOdometerDue
                          })
                          .ToListAsync();
        return listServices;
    }
}