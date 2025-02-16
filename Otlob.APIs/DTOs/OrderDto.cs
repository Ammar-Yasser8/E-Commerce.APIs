using System.ComponentModel.DataAnnotations;

namespace Otlob.APIs.DTOs
{
    public class OrderDto
    {
        
        [Required]
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipppingAddress { get; set; }
        [Required]
        public string BasketId { get; set; }

    }
}
