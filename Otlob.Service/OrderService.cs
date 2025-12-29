using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using Otlob.Core.Specification;
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
        private readonly IPaymentService _paymentService;

        public OrderService(IBasketRepository basketRepository,IUnitOfWork unitOfWork, IPaymentService paymentService)
        {
            _basketRepo = basketRepository;
            _unitOfWork = unitOfWork;
            _paymentService = paymentService;
        }
        public async Task<Order?> CreateOrderAsync(string buyerEmail, string basketId, Address shippingAddress, int deliveryMethodId)
        {
            // 1. Get basket from the basket repo
            var basket = await _basketRepo.GetBasketAsync(basketId);
            if (basket == null || basket.Items == null || !basket.Items.Any()) return null;

            // 2. Ensure payment intent exists
            if (string.IsNullOrEmpty(basket.paymentIntentId))
            {
                await _paymentService.CreateOrUpdatePaymentIntent(basketId);
                basket = await _basketRepo.GetBasketAsync(basketId); // Refresh basket after updating payment intent
                if (string.IsNullOrEmpty(basket.paymentIntentId)) return null; // Ensure payment intent exists
            }

            // 3. Create order items
            var orderItems = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetAsync(item.Id);
                if (product == null) continue;

                var itemOrdered = new ProductItemOrdered(item.Id, product.Name, product.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, product.Price, item.Quantity);
                orderItems.Add(orderItem);
            }

            // 4. Calculate subtotal
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);

            // 5. Get delivery method
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetAsync(deliveryMethodId);
            if (deliveryMethod == null) return null;

            // 6. Handle existing order with the same payment intent
            var orderRepo = _unitOfWork.Repository<Order>();
            var ordersSpec = new OrderWIthPaymentIntentSpec(basket.paymentIntentId);
            var existingOrder = await orderRepo.GetAsyncWithSpec(ordersSpec);
            if (existingOrder != null)
            {
                orderRepo.Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            }

            // 7. Create order
            var order = new Order(buyerEmail, shippingAddress, deliveryMethod, orderItems, subtotal, basket.paymentIntentId);
            await orderRepo.AddAsync(order);

            // 8. Save to DB
            return await _unitOfWork.CompleteAsync() > 0 ? order : null;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            var deliveryMethodRepo = _unitOfWork.Repository<DeliveryMethod>();
            var deliveryMethods = await deliveryMethodRepo.GetAllAsync();
            return deliveryMethods.ToList().AsReadOnly();
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

        public async Task<IReadOnlyList<Order>> GetOrdersAsync()
        {
            var orderRepo = _unitOfWork.Repository<Order>();
            var spec = new OrderWithItemsAndDeliveryMethodSpecification();
            var orders = await orderRepo.GetAllAsyncWithSpec(spec);
            return orders.ToList().AsReadOnly();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            var orderRepo = _unitOfWork.Repository<Order>();
            var spec = new OrderWithItemsAndDeliveryMethodSpecification(id);
            return await orderRepo.GetAsyncWithSpec(spec);
        }

        public async Task<Order?> UpdateOrderAsync(Order order)
        {
            var orderRepo = _unitOfWork.Repository<Order>();
            orderRepo.Update(order);
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? order : null;
        }
    }
}
