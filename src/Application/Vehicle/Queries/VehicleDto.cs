public class VehicleDto
{
    public Guid Id { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public required int Year { get; set; }
    public int Odometer { get; set; }
    public required string LicensePlate { get; set; }
    public string? OwnerName { get; set; }
    public DateTime? Rego { get; set; }
}