using MediatR;

public class Items
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost("/", CreateItem);
        groupBuilder.MapGet("/{id}", GetItem);
        groupBuilder.MapPut("/{id}/update", UpdateItem);
        groupBuilder.MapDelete("/{id}/delete", DeleteItem);
    }

    public static async Task<IResult> CreateItem (ISender sender, CreateItemCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/items/{id}", id);
    }

    public static async Task<IResult> GetItem(ISender sender, Guid id)
    {
        var item = await sender.Send(new GetItemQuery(id));

        return TypedResults.Ok(item);
    }

    public static async Task<IResult> UpdateItem(ISender sender, Guid id, UpdateItemCommand command)
    {
        var updatedItem = await sender.Send(command with { Id = id });

        return TypedResults.Ok(updatedItem);
    }

    public static async Task<IResult> DeleteItem(ISender sender, Guid Id)
    {
        await sender.Send(new DeleteItemCommand(Id));

        return TypedResults.NoContent();
    }
}








