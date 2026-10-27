using AkaNet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AkaNet.Api.Data;

public class AkaNetDbContext : DbContext
{
    public AkaNetDbContext(DbContextOptions<AkaNetDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Facility> Facilities => Set<Facility>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<MaintenanceTicket> MaintenanceTickets => Set<MaintenanceTicket>();
    public DbSet<ApplicationRequest> ApplicationRequests => Set<ApplicationRequest>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User - Room relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Room)
            .WithMany(r => r.Residents)
            .HasForeignKey(u => u.RoomId)
            .OnDelete(DeleteBehavior.SetNull);

        // Reservation relationships
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Facility)
            .WithMany(f => f.Reservations)
            .HasForeignKey(r => r.FacilityId)
            .OnDelete(DeleteBehavior.Cascade);

        // MaintenanceTicket relationship
        modelBuilder.Entity<MaintenanceTicket>()
            .HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ApplicationRequest relationship
        modelBuilder.Entity<ApplicationRequest>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
