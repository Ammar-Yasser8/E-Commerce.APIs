using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Models.Order
{
    public class Order :Base
    {
        public Order()
        {
            
        }
        public Order(string buyerName, Address shippingAddress, DeliveryMethod deliveryMethod, ICollection<OrderItem> orders, decimal subTotal)
        {
            BuyerName = buyerName;
            ShippingAddress = shippingAddress;
            DeliveryMethod = deliveryMethod;
            Orders = orders;
            SubTotal = subTotal;
        }


        public string BuyerName { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow;
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public Address ShippingAddress { get; set; }
        //public int DeliveryMethodId { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public ICollection<OrderItem> Orders { get; set; } = new HashSet<OrderItem>();
        public decimal SubTotal { get; set; }
        public decimal GetTotal()
            => SubTotal + DeliveryMethod.Cost;
        public string PaymentIntentId { get; set; } = "";
    }
}
