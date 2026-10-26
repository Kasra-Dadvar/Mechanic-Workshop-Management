using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetServiceItemsQuery(Guid id) : IRequest<List<ItemDto>>;

public class GetServiceItemsQueryHandler : IRequestHandler<GetServiceItemsQuery, List<ItemDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetServiceItemsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ItemDto>> Handle(GetServiceItemsQuery request, CancellationToken cancellationToken)
    {
        var listItems = await _dbContext.Services
                        .Where(s => s.Id == request.id)
                        .SelectMany(s => s.Items)
                        .Select(s => new ItemDto
                        {
                            Id = s.Id,
                            Name = s.Name,
                            Cost = s.Cost,
                            Quantity = s.Quantity,
                        })
                        .ToListAsync();
        return listItems;
    }
}