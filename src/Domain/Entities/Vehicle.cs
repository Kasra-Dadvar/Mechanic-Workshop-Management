public class Vehicle
{
    public Guid Id { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public required int Year { get; set; }
    public int Odometer { get; set; }
    public required string LicensePlate { get; set; }
    public Guid CustomerId { get; set; }
    public List<Service> Services { get; set; } = [];
    public DateTime? Rego { get; set; }
}