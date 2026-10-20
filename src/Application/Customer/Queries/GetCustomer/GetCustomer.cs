using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetCustomerQuery(Guid Id) : IRequest<CustomerDto>;

public class GetCustomerQueryHandler : IRequestHandler<GetCustomerQuery, CustomerDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCustomerQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CustomerDto> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
    {
        var customer = await _dbContext.Customers
            .Where(c => c.Id == request.Id && c.DeletedAt == null)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {request.Id} not found.");
        }

        return customer;
    }
}