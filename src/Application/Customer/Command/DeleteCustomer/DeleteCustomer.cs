using MediatR;

public record DeleteCustomerCommand(Guid id) : IRequest;

public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand>
{
    public ApplicationDbContext _dbContext;

    public DeleteCustomerCommandHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
    {
       var customer = await _dbContext.Customers.FindAsync(new object[] { request.id }, cancellationToken);
       
        if (customer == null)
        {
            throw new Exception($"Customer with ID {request.id} not found.");
        }
        _dbContext.Customers.Remove(customer);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}