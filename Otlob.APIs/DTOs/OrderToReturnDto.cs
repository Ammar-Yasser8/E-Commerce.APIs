using Otlob.Core.Models.Order;

namespace Otlob.APIs.DTOs
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } 
        public string OrderStatus { get; set; } 
        public Address ShippingAddress { get; set; }
       
        public string DeliveryMethod { get; set; }
        public decimal DeliveryCost { get; set; }
        public ICollection<OrderItemDto> Items { get; set; } = new HashSet<OrderItemDto>();
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }
        public string PaymentIntentId { get; set; } 
    }
}
