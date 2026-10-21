using MediatR;

public record UpdateVehicleCommand(Guid id) : IRequest<UpdateVehicleDto>
{
    public int Odometer { get; set; }
    public string? LicensePlate { get; set; }
    public Guid CustomerId { get; set; }
    public DateTime? Rego { get; set; }
}

public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, UpdateVehicleDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateVehicleCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateVehicleDto> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _dbContext.Vehicles.FindAsync(new object[] { request.id }, cancellationToken);
        if (vehicle == null)
        {
            throw new Exception($"Vehicle with ID {request.id} not found.");
        }

        if (request.Odometer > vehicle.Odometer)
        {
            vehicle.Odometer = request.Odometer;
        }
        if (!string.IsNullOrEmpty(request.LicensePlate) && request.LicensePlate != vehicle.LicensePlate)
        {
            vehicle.LicensePlate = request.LicensePlate;
        }
        if (request.CustomerId != Guid.Empty && request.CustomerId != vehicle.CustomerId)
        {
            vehicle.CustomerId = request.CustomerId;
        }
        if (request.Rego != null && request.Rego != vehicle.Rego)
        {
            vehicle.Rego = request.Rego;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return new UpdateVehicleDto
        {
            Odometer = vehicle.Odometer,
            LicensePlate = vehicle.LicensePlate,
            CustomerId = vehicle.CustomerId,
            Rego = vehicle.Rego
        };
    }
}