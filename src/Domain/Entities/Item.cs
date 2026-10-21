public class Item
{
    public Guid Id { get; set; }
    public required  string Name { get; set; }
    public required decimal Cost { get; set; }
    public int Quantity { get; set; }
    public Guid ServiceId { get; set; }
}