public class ServiceDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? VehicleName { get; set; }
    public decimal Cost { get; set; }
    public DateTime ServicedAt { get; set; }
    public DateTime NextServiceDue { get; set; }
    public int NextOdometerDue { get; set; }
}