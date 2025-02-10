using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Models.Order
{
    public class DeliveryMethod : Base
    {
        public DeliveryMethod()
        {
            
        }
        public DeliveryMethod(string shortName, decimal cost, string description, string deliveryTime)
        {
            ShortName = shortName;
            Cost = cost;
            Description = description;
            DeliveryTime = deliveryTime;
        }

        public string ShortName { get; set; }
        public decimal Cost { get; set; }
        public string Description { get; set; }
        public string DeliveryTime { get; set; } 
    }
}
