using Microsoft.Extensions.Configuration;
using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using Otlob.Core.Specification.OrderSpecifications;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Service
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService(IConfiguration configuration,
            IBasketRepository basketRepository,
            IUnitOfWork unitOfWork
            )
        {
            _configuration = configuration;
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
            var basket = await _basketRepository.GetBasketAsync(basketId);
            if (basket == null) return null;
            var shippingPrice = 0m;
            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetAsync(basket.DeliveryMethodId.Value);
                shippingPrice = deliveryMethod.Cost;
            }
            if (basket?.Items.Count > 0)
            {
                foreach(var item  in basket.Items)
                {
                    var productItem = await _unitOfWork.Repository<Core.Models.Product>().GetAsync(item.Id);
                    if (productItem.Price != item.Price)
                    {
                        item.Price = productItem.Price;
                    }

                }

            }

            PaymentIntent paymentIntent;
            PaymentIntentService paymentIntentService = new PaymentIntentService();
            if (string.IsNullOrEmpty(basket.paymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                paymentIntent = await paymentIntentService.CreateAsync(options);
                basket.paymentIntentId = paymentIntent.Id;
                basket.ClientSecret = paymentIntent.ClientSecret;

            }

            else
            {
               var updateOptions = new PaymentIntentUpdateOptions
               {
                   Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
               };
                await paymentIntentService.UpdateAsync(basket.paymentIntentId, updateOptions);

            }

             await _basketRepository.UpdateBasketAsync(basket);

             return basket;

        }

        public async Task<Core.Models.Order.Order?> UpdateOrderPaymentSucceeded(string paymentIntentId, bool succeeded)
        {
            var spec = new OrderWIthPaymentIntentSpec(paymentIntentId);
            var orderTask = _unitOfWork.Repository<Core.Models.Order.Order>().GetAsyncWithSpec(spec);
            var order = await orderTask;
            if (order == null) return null;

            if (succeeded)
                order.OrderStatus = OrderStatus.PaymentReceived;
            else
                order.OrderStatus = OrderStatus.PaymentFailed;
            _unitOfWork.Repository<Core.Models.Order.Order>().Update(order);
            await _unitOfWork.CompleteAsync();
            return order;
        }


    }
}
