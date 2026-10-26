using MediatR;

public record DeleteServiceCommand(Guid Id) : IRequest;

public class DeleteServiceCommandHandler : IRequestHandler<DeleteServiceCommand>
{
    private readonly IApplicationDbContext _dbContext;

    public DeleteServiceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services.FindAsync(new object[] { request.Id }, cancellationToken);

        if (service == null)
        {
            throw new Exception($"Service with ID {request.Id} not found.");
        }

        _dbContext.Services.Remove(service);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}