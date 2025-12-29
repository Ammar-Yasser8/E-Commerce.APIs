using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Otlob.APIs.DTOs;
using Otlob.APIs.Helper;
using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Specification;
using Otlob.Core.Specification.ProductSpecifications;

namespace Otlob.APIs.Controllers
{
   
    public class ProductsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReverseDto>>> GetProducts([FromQuery] ProductSpecParams specParams)
        {
            var spec = new ProductWithBrandandCategory(specParams);
            var products = await _unitOfWork.Repository<Product>().GetAllAsyncWithSpec(spec);
            var countSpec = new ProductWithFiltersForCountSpecification(specParams);
            var totalItems = await _unitOfWork.Repository<Product>().GetWithCountAsync(countSpec);
            var data = _mapper.Map<IEnumerable<Product>, IEnumerable<ProductToReverseDto>>(products);
            return Ok(new Pagination<ProductToReverseDto>(specParams.PageIndex, specParams.PageSize, totalItems, data));
        }

        // GET: api/Products/id
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReverseDto>> GetProduct(int id)
        {
            var spec = new ProductWithBrandandCategory(id);
            var product = await _unitOfWork.Repository<Product>().GetAsyncWithSpec(spec);
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
            return Ok(await _unitOfWork.Repository<ProductBrand>().GetAllAsync());
        }

        // GET: api/Products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IReadOnlyList<ProductCategory>>> GetProductCategories()
        {
            return Ok(await _unitOfWork.Repository<ProductCategory>().GetAllAsync());
        }

        // POST: api/Products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductToReverseDto>> CreateProduct([FromForm] ProductCreateDto productDto)
        {
            if (productDto.Picture != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.Picture.FileName);
                var filePath = Path.Combine("wwwroot", "images", "products", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.Picture.CopyToAsync(stream);
                }
                productDto.PictureUrl = $"images/products/{fileName}";
            }

            var product = _mapper.Map<ProductCreateDto, Product>(productDto);
            _unitOfWork.Repository<Product>().AddAsync(product);
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest("Problem creating product");
            return Ok(_mapper.Map<Product, ProductToReverseDto>(product));
        }

        // PUT: api/Products/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductToReverseDto>> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var product = await _unitOfWork.Repository<Product>().GetAsync(id);
            if (product == null) return NotFound();

            if (productDto.Picture != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.Picture.FileName);
                var filePath = Path.Combine("wwwroot", "images", "products", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.Picture.CopyToAsync(stream);
                }
                productDto.PictureUrl = $"images/products/{fileName}"; 
            }
            else
            {
                // Preserve existing URL if no new picture is uploaded
                productDto.PictureUrl = product.PictureUrl;
            }

            _mapper.Map(productDto, product);
            _unitOfWork.Repository<Product>().Update(product); // Assuming Update just marks it modified
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest("Problem updating product");
            return Ok(_mapper.Map<Product, ProductToReverseDto>(product));
        }

        // DELETE: api/Products/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetAsync(id);
            if (product == null) return NotFound();

            _unitOfWork.Repository<Product>().Delete(product);
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest("Problem deleting product");
            return Ok();
        }
    }
}
