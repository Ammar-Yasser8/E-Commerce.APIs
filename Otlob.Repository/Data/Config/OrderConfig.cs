using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Otlob.Core.Models.Order;

namespace Otlob.Repository.Data.Config
{
    internal class OrderConfig : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.OwnsOne(o => o.ShippingAddress, sa =>
            {
                sa.WithOwner(); // Ensures it's owned by Order
                sa.Property(a => a.FirstName).HasMaxLength(100);
                sa.Property(a => a.LastName).HasMaxLength(100); 
                sa.Property(a => a.Street).HasMaxLength(200);
                sa.Property(a => a.City).HasMaxLength(100);
                sa.Property(a => a.Country).HasMaxLength(100);
            });

            builder.Property(O => O.OrderStatus)
                .HasConversion(
                        oStutes => oStutes.ToString(),
                        oStatus => (OrderStatus)Enum.Parse(typeof(OrderStatus), oStatus)
                );
            builder.Property(O => O.SubTotal)
                .HasColumnType("decimal(18,2)");
            builder.HasOne(O => O.DeliveryMethod)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);
        }
    }

}
