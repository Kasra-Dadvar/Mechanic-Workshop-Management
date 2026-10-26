using MediatR;

public record CreateServiceCommand() : IRequest<Guid>
{
    public required string Name { get; set; }
    public required decimal Cost { get; set; }
    public Guid VehicleId { get; set; }
}

public class CreateServiceCommandHandler: IRequestHandler<CreateServiceCommand, Guid>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateServiceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
    {
        if (request.VehicleId == Guid.Empty)
        {
            throw new ArgumentException("VehicleId cannot be empty.", nameof(request.VehicleId));
        }
        if (string.IsNullOrEmpty(request.Name))
        {
            throw new ArgumentException("Name cannot be empty.", nameof(request.Name));
        }
        if (request.Cost < 0)
        {
            throw new ArgumentException("Cost must be a non-negative value.", nameof(request.Cost));
        }

        var vehicle = await _dbContext.Vehicles.FindAsync(new object[] { request.VehicleId }, cancellationToken);
        if (vehicle == null)
        {
            throw new Exception($"Vehicle with ID {request.VehicleId} not found.");
        }

        var service = new Service
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Cost = request.Cost,
            ServicedAt = DateTime.UtcNow,
            NextServiceDue = DateTime.UtcNow.AddMonths(12),
            NextOdometerDue = vehicle.Odometer + 15000,
            VehicleId = request.VehicleId,
        };

        //vehicle.Services.Add(service);
        _dbContext.Services.Add(service);
        await _dbContext.SaveChangesAsync(cancellationToken);


        // await _dbContext.Entry(service).Reference(s => s.Vehicle).LoadAsync(cancellationToken);

        return service.Id;
    }
}