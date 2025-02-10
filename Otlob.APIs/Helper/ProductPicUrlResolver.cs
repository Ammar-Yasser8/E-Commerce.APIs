using AutoMapper;
using Otlob.APIs.DTOs;
using Otlob.Core.Models;

namespace Otlob.APIs.Helper
{
    public class ProductPicUrlResolver : IValueResolver<Product, ProductToReverseDto, string>
    {
        private readonly IConfiguration configuration;

        public ProductPicUrlResolver(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public string Resolve(Product source, ProductToReverseDto destination, string destMember, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source.PictureUrl))
            {
                return string.Empty;
            }
            return $"{configuration["ApiBaseUrl"]}/{source.PictureUrl}";

        }
    }
}
