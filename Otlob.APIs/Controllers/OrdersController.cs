using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Otlob.APIs.DTOs;
using Otlob.APIs.Helper;
using Otlob.Core.Models.Order;
using Otlob.Repository.Service.Contract;
using System.Security.Claims;

namespace Otlob.APIs.Controllers
{
    [Authorize]
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
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipppingAddress);
            var order = await _orderService.CreateOrderAsync(email, orderDto.BasketId,address, orderDto.DeliveryMethodId);
            if (order == null) return BadRequest("Problem creating order");
            return Ok(_mapper.Map<Order,OrderToReturnDto>(order));
        }
        // GET : api/orders?email={email}
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>>GetOrdersForUser()
        {
            var buyerEmail = User.FindFirstValue(ClaimTypes.Email);
            var orders = await _orderService.GetOrdersForUserAsync(buyerEmail);
            return Ok(_mapper.Map<IReadOnlyList<Order>,IReadOnlyList<OrderToReturnDto>>(orders));
        }
        // Get : api/orders/id?email={email}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderForUser(int id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var order = await _orderService.GetOrderByIdAsync(id, email);
            if (order == null) return BadRequest();
            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }
 
        // Get : api/orders/deliveryMethods
        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _orderService.GetDeliveryMethodsAsync();
            if (deliveryMethods == null) return BadRequest();
            return Ok(deliveryMethods);
        }
    }
}
