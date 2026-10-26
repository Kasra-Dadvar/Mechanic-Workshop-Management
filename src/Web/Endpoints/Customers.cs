using MediatR;


public class Customers 
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
       groupBuilder.MapPost("/", CreateCustomer);
       groupBuilder.MapGet("/{id}", GetCustomers);
       groupBuilder.MapPut("/{id}/update", UpdateCustomer);
       groupBuilder.MapDelete("/{id}/delete", DeleteCustomer);

       groupBuilder.MapGet("/{id}/vehicles", GetCustomerVehicles);
    }

    public static async Task<IResult> CreateCustomer(ISender sender, CreateCustomerCommand command)
    {
        var id = await sender.Send(command);


        return TypedResults.Created($"/customers/{id}", id);
    }

    public static async Task<IResult> GetCustomers(ISender sender, Guid id)
    {
        var customer = await sender.Send(new GetCustomerQuery(id));

        return TypedResults.Ok(customer);
    }

    public static async Task<IResult> UpdateCustomer(ISender sender, Guid id, UpdateCustomerCommand command)
    {

        var updatedCustomer = await sender.Send(command with { Id = id });

        return TypedResults.Ok(updatedCustomer);
    }

    public static async Task<IResult> DeleteCustomer(ISender sender, Guid id)
    {
        await sender.Send(new DeleteCustomerCommand(id));

        return TypedResults.NoContent();
    }

    public static async Task<IResult> GetCustomerVehicles(ISender sender, Guid id)
    {
        var customerVehicles = await sender.Send(new GetCustomerVehiclesQuery(id));

        return TypedResults.Ok(customerVehicles);
    } 
}