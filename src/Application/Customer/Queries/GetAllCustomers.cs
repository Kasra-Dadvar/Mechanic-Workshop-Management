using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAllCustomersQuery() : IRequest<List<CustomerDto>>;

public class GetAllCustomersQueryHandler : IRequestHandler<GetAllCustomersQuery, List<CustomerDto>>
{
    private readonly IApplicationDbContext _dbContext;
    public GetAllCustomersQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<List<CustomerDto>> Handle(GetAllCustomersQuery request, CancellationToken cancellationToken)
    {
        var customers = await _dbContext.Customers
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone
            })
            .ToListAsync(cancellationToken);

        return customers;
    }
}