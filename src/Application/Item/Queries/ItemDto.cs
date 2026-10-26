public class ItemDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public decimal Cost { get; set; }
    public int Quantity { get; set; }
    public string? ServiceName { get; set; }
}