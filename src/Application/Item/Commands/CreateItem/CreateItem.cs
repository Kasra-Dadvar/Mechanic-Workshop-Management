using MediatR;

public record CreateItemCommand() : IRequest<Guid>
{
    public required string Name { get; set; }
    public required decimal Cost { get; set; }
    public int Quantity { get; set; }
    public Guid ServiceId { get; set; }
}

public class CreateItemCommandHandler : IRequestHandler<CreateItemCommand, Guid>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        if (request.Cost <= 0)
        {
            throw new ArgumentException("Cost must be greater than zero.", nameof(request.Cost));
        }
        if (request.ServiceId == Guid.Empty)
        {
            throw new ArgumentException("ServiceId cannot be empty.", nameof(request.ServiceId));
        }
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Name cannot be empty.", nameof(request.Name));
        }

        var item = new Item
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Cost = request.Cost,
            Quantity = request.Quantity,
            ServiceId = request.ServiceId
        };

        _dbContext.Items.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return item.Id;
    }
}