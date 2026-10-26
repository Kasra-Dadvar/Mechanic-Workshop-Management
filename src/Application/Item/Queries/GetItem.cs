using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetItemQuery(Guid Id) : IRequest<ItemDto>;

public class GetItemQueryHandler : IRequestHandler<GetItemQuery, ItemDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetItemQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ItemDto> Handle(GetItemQuery request, CancellationToken cancellationToken)
    {
        var item = await _dbContext.Items
                    .Where(i => i.Id == request.Id)
                    .Select(i => new ItemDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Cost = i.Cost,
                        Quantity = i.Quantity,
                        ServiceName = i.Service!.Name
                    })
                    .FirstAsync(cancellationToken);
        return item;
    }
}