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
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipppingAddress);
            var order = await _orderService.CreateOrderAsync(orderDto.BuyerEmail, orderDto.BasketId,address, orderDto.DeliveryMethodId);
            if (order == null) return BadRequest("Problem creating order");
            return Ok(_mapper.Map<Order,OrderToReturnDto>(order));
        }
        // GET : api/orders?email={email}
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>>GetOrdersForUser(string email)
        {
            var orders= await _orderService.GetOrdersForUserAsync(email);
            return Ok(_mapper.Map<IReadOnlyList<Order>,IReadOnlyList<OrderToReturnDto>>(orders));
        }
        // Get : api/orders/id?email={email}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderForUser(int id , string email)
        {
            var order = await _orderService.GetOrderByIdAsync(id, email);
            if (order == null) return BadRequest();
            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }


    }
}
