using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using Otlob.Core.Specification.OrderSpecifications;
using Otlob.Repository.Repositories;
using Otlob.Repository.Service.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Service
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IBasketRepository basketRepository,IUnitOfWork unitOfWork)
        {
            _basketRepo = basketRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Order?> CreateOrderAsync(string buyerEmail, string basketId, Address shippingAddress, int deliveryMethodId)
        {
            // 1. get basket from the basket repo
            var basket = await _basketRepo.GetBasketAsync(basketId);
            // 2. get items from the product repo
            var orderItems = new List<OrderItem>();
            if(basket?.Items?.Count> 0)
            {
                foreach (var item in basket.Items)
                {
                    // 3.get product from the product repo
                    var product = await _unitOfWork.Repository<Product>().GetAsync(item.Id);

                    // 4. create order item
                    var itemOrdered = new ProductItemOrdered(item.Id, product.Name, product.PictureUrl);
                    var orderItem = new OrderItem(itemOrdered, product.Price, item.Quantity);
                    orderItems.Add(orderItem);
                }
            }
             
            // 5. calculate subtotal
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);

            // 6. Get delivery method
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetAsync(deliveryMethodId);

            // 7. create order 
            var order = new Order(buyerEmail, shippingAddress,deliveryMethod, orderItems, subtotal);
             await _unitOfWork.Repository<Order>().AddAsync(order);
            // 8. Save to db
            var result =await _unitOfWork.CompleteAsync();
            if (result <= 0) return null;
            return order;

        }

        public async Task<Order?> GetOrderByIdAsync(int orderId, string buyerEmail)
        {
            var orderRepo = _unitOfWork.Repository<Order>();
            var spec = new OrderSpec(orderId, buyerEmail);
            var order = await orderRepo.GetAsyncWithSpec(spec);
            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var orderRepo = _unitOfWork.Repository<Order>();
            var spec = new OrderSpec(buyerEmail);
            var orders = await orderRepo.GetAllAsyncWithSpec(spec);
            return orders.ToList().AsReadOnly();
        }
    }
}
