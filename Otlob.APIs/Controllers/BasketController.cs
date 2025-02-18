using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Otlob.APIs.DTOs;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;

namespace Otlob.APIs.Controllers
{

    public class BasketController : BaseApiController 
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository ,IMapper mapper)
        {
            _basketRepository = basketRepository;
            _mapper = mapper;
        }
        // GET: api/Basket?id=123
        [HttpGet]   
        public async Task<ActionResult<CustomerBasket>> GetBasket(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id));    
        }
        // POST: api/Basket
        [HttpPost]
        [ValidateAntiForgeryToken]

        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
            var mappedBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);  
            var updatedBasket = await _basketRepository.UpdateBasketAsync(mappedBasket);
            if (updatedBasket == null) return BadRequest("Problem updating the basket");
            return Ok(updatedBasket);
        }
        // DELETE: api/Basket?id=123
        [HttpDelete]
        public async Task DeleteBasket(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);  
        }

    }
}
