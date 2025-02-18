using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using Stripe;
using Stripe.V2;

namespace Otlob.APIs.Controllers
{
    [Authorize]
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger _logger;
        private const string _whSecret = "whsec_7cfa89747796288162e08254a006b112ca0c64f41cfc97daa8319d864a72c5f6";

        public PaymentsController(IPaymentService paymentService , ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }
        // POST : api/payments/basketId
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            _logger.LogInformation("Processing payment intent for basket: {basketId}", basketId);

            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            if (basket == null) return BadRequest("Problem with your basket");

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
           
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], _whSecret);
                var paymentIntent = (PaymentIntent)stripeEvent.Data.Object;

                Core.Models.Order.Order order;
                // Handle the event
                switch (stripeEvent.Type)
                {

                    case "payment_intent.succeeded":
                       order = await _paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id,true);
                        _logger.LogInformation("Payment Succeeded", paymentIntent.Id);
                        break;
                    case "payment_intent.payment_failed":
                       order = await _paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id, false);
                        _logger.LogInformation("Payment Failed", paymentIntent.Id);
                        break;

                }
                return Ok();
        }

    }
}
