using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Specification.ProductSpecifications
{
    public class ProductSpecParams
    {
        private const int MaxSize = 10;
        public string? Sort { get; set; }
        public int? BrandId { get; set; }
        public int? CategoryId { get; set; }
        public string? Search { get; set; }
        public int PageIndex { get; set; } = 1;
        private int pageSize;

        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value > MaxSize ? MaxSize : value; }
        }



    }
}
