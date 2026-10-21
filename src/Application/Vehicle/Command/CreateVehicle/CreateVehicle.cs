using System.ComponentModel.DataAnnotations;
using MediatR;

public record CreateVehicleCommand(): IRequest<Guid>
{
    [Required]
    public required string Make { get; init; }
    [Required]
    public required string Model { get; init; }
    [Required]
    public required int Year { get; init; }
    [Required]
    public int Odometer { get; init; }
    [Required]
    public required string LicensePlate { get; init; }
    [Required]
    public Guid CustomerId { get; init; }
    public DateTime? Rego {get; init;}
}

public class CreateVehicleCommandHandler : IRequestHandler<CreateVehicleCommand, Guid>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateVehicleCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
    {
     if (request.CustomerId != Guid.Empty)
        {
            throw new ArgumentException("CustomerId cannot be empty.", nameof(request.CustomerId));
        }
    if (request.Year < 1900)
        {
            throw new ArgumentException("Year must be a valid year.", nameof(request.Year));
        }
    if (request.Odometer < 0)
        {
            throw new ArgumentException("Odometer must be a non-negative value.", nameof(request.Odometer));
        }

    var customer = await _dbContext.Customers.FindAsync(new object[] { request.CustomerId }, cancellationToken);
    if (customer == null)
        {
            throw new Exception($"Customer with ID {request.CustomerId} not found.");
        }
    
    var vehicle = new Vehicle
    {
        Id = Guid.NewGuid(),
        Make = request.Make,
        Model = request.Model,
        Year = request.Year,
        Odometer = request.Odometer,
        LicensePlate = request.LicensePlate,
        CustomerId = request.CustomerId,
        Rego = request.Rego
    };

    customer.Vehicles.Add(vehicle);
    _dbContext.Vehicles.Add(vehicle);
    await _dbContext.SaveChangesAsync(cancellationToken);
    
    return vehicle.Id;
    }

}