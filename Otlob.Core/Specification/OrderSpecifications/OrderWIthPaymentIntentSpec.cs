using Otlob.Core.Models.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Specification.OrderSpecifications
{
    public class OrderWIthPaymentIntentSpec : BaseSpecification<Order>
    {
        public OrderWIthPaymentIntentSpec(string paymentIntentId) : base(O => O.PaymentIntentId == paymentIntentId )
        {


        }
    }
}
