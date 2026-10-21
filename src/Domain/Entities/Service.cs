public class Service
{
    public Guid Id { get; set; }
    public decimal Cost { get; set; }
    public DateTime ServicedAt { get; set; }
    public DateTime NextServiceDue { get; set; }
    public int NextOdometerDue { get; set; }
    public Guid VehicleId { get; set; }
    public List<Item> Items { get; set; } = [];
}