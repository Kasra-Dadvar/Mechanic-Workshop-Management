public class UpdateServiceDto
{
    public string? Name { get; set; }
    public decimal Cost { get; set; }
    public DateTime ServicedAt { get; set; }
    public DateTime NextServiceDue { get; set; }
    public int NextOdometerDue { get; set; }
}