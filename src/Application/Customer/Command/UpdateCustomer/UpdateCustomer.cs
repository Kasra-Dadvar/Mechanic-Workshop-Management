using MediatR;

public record UpdateCustomerCommand(Guid Id) : IRequest<UpdateCustomerDto>
{
    public string? Name { get; init; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, UpdateCustomerDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateCustomerCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateCustomerDto> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _dbContext.Customers.FindAsync(new object[] { request.Id }, cancellationToken);

        if (customer == null)
        {
            throw new Exception($"Customer with ID {request.Id} not found.");
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            customer.Name = request.Name;
        }

        if (!string.IsNullOrEmpty(request.Email))
        {
            customer.Email = request.Email;
        }

        if (!string.IsNullOrEmpty(request.Phone))
        {
            customer.Phone = request.Phone;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateCustomerDto
        {
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone
        };
    }
}