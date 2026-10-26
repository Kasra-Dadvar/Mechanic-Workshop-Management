using MediatR;

public record DeleteItemCommand(Guid Id) : IRequest;

public class DeleteItemCommandHandler : IRequestHandler<DeleteItemCommand>
{
    private readonly IApplicationDbContext _dbContext;

    public DeleteItemCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _dbContext.Items.FindAsync(new object[] {request.Id}, cancellationToken);
        if (item == null)
        {
            throw new Exception($"Item with ID {request.Id} not found.");
        }

        _dbContext.Items.Remove(item);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}