using MediatR;

public record UpdateServiceCommand(Guid Id) : IRequest<UpdateServiceDto>
{
    public string? Name { get; init; }
    public decimal Cost { get; init; }
    public DateTime ServicedAt { get; init; }
    public DateTime NextServiceDue { get; init; }
    public int NextOdometerDue { get; init; }
}

public class UpdateServiceCommandHandler : IRequestHandler<UpdateServiceCommand, UpdateServiceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateServiceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateServiceDto> Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services.FindAsync(new object[] { request.Id }, cancellationToken);

        if (service == null)
        {
            throw new Exception($"Service with ID {request.Id} not found.");
        }
        if (!string.IsNullOrEmpty(request.Name))
        {
            service.Name = request.Name;
        }
        if (request.Cost != service.Cost && request.Cost > 0)
        {
            service.Cost = request.Cost;
        }
        if (request.ServicedAt > service.ServicedAt)
        {
            service.ServicedAt = request.ServicedAt;
        }
        if (request.NextServiceDue != service.NextServiceDue && request.NextServiceDue > DateTime.UtcNow)
        {
            service.NextServiceDue = request.NextServiceDue;
        }
        if (request.NextOdometerDue > service.NextOdometerDue)
        {
            service.NextOdometerDue = request.NextOdometerDue;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateServiceDto
        {
            Name = service.Name,
            Cost = service.Cost,
            ServicedAt = service.ServicedAt,
            NextServiceDue = service.NextServiceDue,
            NextOdometerDue = service.NextOdometerDue
        };
    }
}