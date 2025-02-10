using AutoMapper;
using Otlob.APIs.DTOs;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;

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
            CreateMap<CustomerBasketDto,CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Address>();   
        }
    }
}
