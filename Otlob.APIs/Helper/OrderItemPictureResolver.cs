using AutoMapper;
using Otlob.APIs.DTOs;
using Otlob.Core.Models.Order;

namespace Otlob.APIs.Helper
{
    public class OrderItemPictureResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {
        private readonly IConfiguration _configuration;
        public OrderItemPictureResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {

            if (!string.IsNullOrEmpty(source.Product.PictureUrl))
            {
                return $"{_configuration["ApiBaseUrl"]}/{source.Product.PictureUrl}";
            }
            else
            {
                return string.Empty;
            }
        }
    }
}
