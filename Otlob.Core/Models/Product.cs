using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Models
{
    public class Product : Base
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        
        public int CategoryId { get; set; } // Foreign Key for ProductCategory
        public ProductCategory ProductCategory { get; set; } // Navigation Property for ProductCategory
        public int BrandId { get; set; } // Foreign Key for ProductBrand
        public ProductBrand ProductBrand { get; set; } // Navigation Property for ProductBrand
    }
}
