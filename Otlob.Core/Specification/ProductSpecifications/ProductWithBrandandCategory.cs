using Otlob.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Specification.ProductSpecifications
{
    public class ProductWithBrandandCategory : BaseSpecification<Product>
    {
        public ProductWithBrandandCategory(ProductSpecParams specParams) 
            : base(p =>
            (string.IsNullOrEmpty(specParams.Search) || p.Name.ToLower().Contains(specParams.Search.ToLower())) &&
            (!specParams.BrandId.HasValue || p.BrandId == specParams.BrandId.Value) &&
            (!specParams.CategoryId.HasValue || p.CategoryId == specParams.CategoryId.Value)
        )
        {
            // Apply Includes
            Includes.Add(p => p.ProductBrand);
            Includes.Add(p=> p.ProductCategory);
            // Apply Sorting
            if (!string.IsNullOrEmpty(specParams.Sort))
            {
                switch (specParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                }
            }
            else
                AddOrderBy(p => p.Name);
            //ApplyPaging(,);
            // 
            ApplyPaging((specParams.PageIndex - 1)* specParams.PageSize , specParams.PageSize);
        }
        public ProductWithBrandandCategory(int id)
        {
            Includes.Add(p => p.ProductBrand);
            Includes.Add(p => p.ProductCategory);
        }

    }
}
