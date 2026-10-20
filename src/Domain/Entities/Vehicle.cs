public class Vehicle
{
    public Guid Id { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public int Odometer { get; set; }
    public string LicensePlate { get; set; }
    public Guid CustomerId { get; set; }
    public List<Service> Services { get; set; }
    public DateTime Rego { get; set; }
}