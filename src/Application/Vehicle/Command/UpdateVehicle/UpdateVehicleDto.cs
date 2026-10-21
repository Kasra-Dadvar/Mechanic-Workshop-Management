public class UpdateVehicleDto
{
    public int Odometer { get; set; }
    public string? LicensePlate { get; set; }
    public Guid CustomerId { get; set; }
    public DateTime? Rego { get; set; }
}