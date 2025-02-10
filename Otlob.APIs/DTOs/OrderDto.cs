using System.ComponentModel.DataAnnotations;

namespace Otlob.APIs.DTOs
{
    public class OrderDto
    {
        [Required]
        public string BuyerEmail { get; set; }
        [Required]
        public int DeliveryMethodId { get; set; }
        [Required]
        public AddressDto ShipppingAddress { get; set; }
        [Required]
        public string BasketId { get; set; }

    }
}
