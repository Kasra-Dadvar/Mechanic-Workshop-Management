using MediatR;

public record UpdateItemCommand(Guid Id) : IRequest<UpdateItemDto>
{
    public string? Name { get; set; }
    public decimal Cost { get; set; }
    public int Quantity { get; set; }
};

public class UpdateItemCommandHandler : IRequestHandler<UpdateItemCommand, UpdateItemDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateItemDto> Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _dbContext.Items.FindAsync(new object[] {request.Id}, cancellationToken);
        if (item == null)
        {
            throw new Exception($"Item with ID {request.Id} not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            item.Name = request.Name;
        }

        if (request.Cost > 0)
        {
            item.Cost = request.Cost;
        }

        if (request.Quantity > 0)
        {
            item.Quantity = request.Quantity;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateItemDto
        {
            Name = item.Name,
            Cost = item.Cost,
            Quantity = item.Quantity
        };
    }
}