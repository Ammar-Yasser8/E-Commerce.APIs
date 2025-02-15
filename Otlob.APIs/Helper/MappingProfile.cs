using AutoMapper;
using Otlob.APIs.DTOs;
using Otlob.Core.Models;
using Otlob.Core.Models.Identity;
using Otlob.Core.Models.Order;
using Address = Otlob.Core.Models.Identity.Address;

namespace Otlob.APIs.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductToReverseDto>()
                    .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.ProductBrand.Name))
                    .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.ProductCategory.Name))
                    .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom<ProductPicUrlResolver>());
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.DeliveryCost, o => o.MapFrom(s => s.DeliveryMethod.Cost));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.Product.ProductId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.Product.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.Product.PictureUrl))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemPictureResolver>());

            // Address of Identity to AddressDTo
            CreateMap<Address, AddressDto>();
              



        }    
    }
}
