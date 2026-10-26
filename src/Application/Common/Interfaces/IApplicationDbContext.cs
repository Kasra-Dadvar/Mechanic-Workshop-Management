using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public interface IApplicationDbContext
{
    DbSet<Customer> Customers { get; set; }
    DbSet<Vehicle> Vehicles { get; set; }
    DbSet<Service> Services { get; set; }
    DbSet<Item> Items { get; set; }

    EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}