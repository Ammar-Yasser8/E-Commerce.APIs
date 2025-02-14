using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Otlob.APIs.DTOs;
using Otlob.APIs.Helper;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Specification;
using Otlob.Core.Specification.ProductSpecifications;

namespace Otlob.APIs.Controllers
{
   
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IGenericRepository<ProductCategory> _productCategoryRepository;
        private readonly IMapper _mapper;   
        public ProductsController(IGenericRepository<Product> productRepository, IMapper mapper,
            IGenericRepository<ProductBrand> productBrandRepository, 
            IGenericRepository<ProductCategory> productCategoryRepository)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _productBrandRepository = productBrandRepository;
            _productCategoryRepository = productCategoryRepository;
        }
        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReverseDto>>> GetProducts([FromQuery] ProductSpecParams specParams)
        {
            var spec = new ProductWithBrandandCategory(specParams);
            var products = await _productRepository.GetAllAsyncWithSpec(spec);
            var countSpec = new ProductWithFiltersForCountSpecification(specParams);
            var totalItems = await _productRepository.GetWithCountAsync(countSpec);
            var data = _mapper.Map<IEnumerable<Product>, IEnumerable<ProductToReverseDto>>(products);
            return Ok(new Pagination<ProductToReverseDto>(specParams.PageIndex,specParams.PageSize, totalItems, data));
        }
        // GET: api/Products/id
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReverseDto>> GetProduct(int id)
        {
          var spec = new ProductWithBrandandCategory(id);
            var product = await _productRepository.GetAsyncWithSpec(spec);
            if (product == null)
            {
                return NotFound(new { Message = "Not found", StatusCode = 404 });
            }
            return Ok(_mapper.Map<Product, ProductToReverseDto>(product));
        }
        // GET: api/Products/brands
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepository.GetAllAsync());
        }
        // GET: api/Products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IReadOnlyList<ProductCategory>>> GetProductCategories()
        {
            return Ok(await _productCategoryRepository.GetAllAsync());
        }

    }
}
