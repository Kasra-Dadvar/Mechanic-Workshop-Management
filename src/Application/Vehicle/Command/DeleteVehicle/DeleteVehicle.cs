using MediatR;

public record DeleteVehicleCommand(Guid id) : IRequest;

public class DeleteVehicleCommandHandler : IRequestHandler<DeleteVehicleCommand>
{
    private readonly IApplicationDbContext _dbContext;

    public DeleteVehicleCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _dbContext.Vehicles.FindAsync(new object[] { request.id }, cancellationToken);

        if (vehicle == null)
        {
            throw new Exception($"Vehicle with ID {request.id} not found.");
        }

        _dbContext.Vehicles.Remove(vehicle);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}