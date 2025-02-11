using Otlob.Core.Models.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Specification.OrderSpecifications
{
    public class OrderSpec : BaseSpecification<Order>
    {
        public OrderSpec(string buyerEmail) : base(O => O.BuyerEmail == buyerEmail)
        {
            Includes.Add(O => O.Items);
            Includes.Add(O => O.DeliveryMethod);
            AddOrderByDescending(O => O.OrderDate);
        }
        public OrderSpec(int id, string buyerEmail) : base(O => O.Id == id && O.BuyerEmail == buyerEmail)
        {
            Includes.Add(O => O.Items);
            Includes.Add(O => O.DeliveryMethod);
        }



    }
}
