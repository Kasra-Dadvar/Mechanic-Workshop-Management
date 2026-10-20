using Microsoft.EntityFrameworkCore;

public interface IApplicationDbContext
{
    DbSet<Customer> Customers { get; set; }
    DbSet<Vehicle> Vehicles { get; set; }
    DbSet<Service> Services { get; set; }
    DbSet<Item> Items { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}