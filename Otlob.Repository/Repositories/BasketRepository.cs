using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Otlob.Repository.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<bool> DeleteBasketAsync(string CartId)
        {
            return await _database.KeyDeleteAsync(CartId);
        }

        public async Task<CustomerBasket?> GetBasketAsync(string CartId)
        {
            var cart = await _database.StringGetAsync(CartId);
            if (cart.IsNullOrEmpty)
            {
                return null;
            }
            return cart.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(cart); 
        }

        public async Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket cart)
        {
           var createOrUpdate = await _database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));
            if( createOrUpdate == false)
            {
                return null;
            }   
            return await GetBasketAsync(cart.Id);
        }
    }
}
