using MediatR;
public class Vehicles{

    public static void Map(RouteGroupBuilder groupBuilder)
        {
            groupBuilder.MapPost("/", CreateVehicle);
            groupBuilder.MapGet("/{id}", GetVehicle);
            groupBuilder.MapPut("/{id}/update", UpdateVehicle);
            groupBuilder.MapDelete("/{id}/delete", DeleteVehicle);

            groupBuilder.MapGet("/{id}/services", GetVehicleServices);
        }

    public static async Task<IResult> CreateVehicle(ISender sender, CreateVehicleCommand command)
    {
       var id = await sender.Send(command);
       
       return TypedResults.Created($"/vehicles/{id}", id);
    }

    public static async Task<IResult> GetVehicle(ISender sender, Guid id)
    {
        var vehicle = await sender.Send(new GetVehicleQuery(id));

        return TypedResults.Ok(vehicle);
    }

    public static async Task<IResult> UpdateVehicle(ISender sender, UpdateVehicleCommand command, Guid id)
    {
        var updatedVehicle = await sender.Send(command with { id = id });

        return TypedResults.Ok(updatedVehicle);
    }

    public static async Task<IResult> DeleteVehicle(ISender sender, Guid id)
    {
        await sender.Send(new DeleteVehicleCommand(id));

        return TypedResults.NoContent();
    }

    public static async Task<IResult> GetVehicleServices(ISender sender, Guid id)
    {
        var vehicleServices = await sender.Send(new GetVehicleServicesQuery(id));

        return TypedResults.Ok(vehicleServices);
    }
    
}
 
