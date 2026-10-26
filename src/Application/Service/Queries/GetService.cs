using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetServiceQuery(Guid Id) : IRequest<ServiceDto>;

public class GetServiceQueryHandler : IRequestHandler<GetServiceQuery, ServiceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetServiceQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceDto> Handle(GetServiceQuery request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services
        .Where(s => s.Id == request.Id)
        .Select(s => new ServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            VehicleName = s.Vehicle!.Make + " " + s.Vehicle.Model,
            Cost = s.Cost,
            ServicedAt = s.ServicedAt,
            NextServiceDue = s.NextServiceDue,
            NextOdometerDue = s.NextOdometerDue
        }).FirstAsync(cancellationToken);

        return service;
    }
}