using Otlob.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.IRepositories
{
    public interface IBasketRepository
    {
        Task<CustomerBasket?>GetBasketAsync(string CartId);
        Task<CustomerBasket?>UpdateBasketAsync(CustomerBasket cart);
        Task<bool> DeleteBasketAsync(string CartId);
         

    }
}
