using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Otlob.APIs.DTOs;
using Otlob.APIs.Helper;
using Otlob.Core.Models.Order;
using Otlob.Repository.Service.Contract;

namespace Otlob.APIs.Controllers
{
    
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController( IOrderService orderService , IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }
        // POST api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipppingAddress);
            var order = await _orderService.CreateOrderAsync(orderDto.BuyerEmail, orderDto.BasketId,address, orderDto.DeliveryMethodId);
            if (order == null) return BadRequest("Problem creating order");
            return Ok(order);
        }
        // GET : api/orders?email={email}
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>>GetOrdersForUser(string email)
        {
            var orders= await _orderService.GetOrdersForUserAsync(email);
            return Ok(orders);
        }



    }
}
