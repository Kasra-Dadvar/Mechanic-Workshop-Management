using MediatR;

public class Services
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost("/", CreateService);
        groupBuilder.MapGet("/{id}", GetService);
        groupBuilder.MapPut("/{id}/update", UpdateService);
        groupBuilder.MapDelete("/{id}/delete", DeleteService);

        groupBuilder.MapGet("/{id}/items", GetServiceItems);
    }

    public static async Task<IResult> CreateService(ISender sender, CreateServiceCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/services/{id}", id);
    }

    public static async Task<IResult> GetService(ISender sender, Guid id)
    {
        var service = await sender.Send(new GetServiceQuery(id));

        return TypedResults.Ok(service);
    }

    public static async Task<IResult> UpdateService(ISender sender, Guid id, UpdateServiceCommand command)
    {
        var updatedService = await sender.Send(command with { Id = id });

        return TypedResults.Ok(updatedService);
    }

    public static async Task<IResult> DeleteService(ISender sender, Guid id)
    {
        await sender.Send(new DeleteServiceCommand(id));

        return TypedResults.NoContent();
    }

    public static async Task<IResult> GetServiceItems(ISender sender, Guid id)
    {
        var listItems = await sender.Send(new GetServiceItemsQuery(id));

        return TypedResults.Ok(listItems);
    } 
}