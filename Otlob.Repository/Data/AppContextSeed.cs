using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Otlob.Repository.Data
{
    public static class AppContextSeed
    {
        public static async Task SeedAsync(AppDbContext _context)
        {
            // seed brands data
            if (_context.ProductBrands.Count()==0)
            {
                var brandsData = File.ReadAllText("../Otlob.Repository/Data/DataSeed/brands.json");
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                if(brands?.Count() > 0)
                {
                    foreach (var item in brands)
                    {
                        _context.Set<ProductBrand>().Add(item); 
                    }
                    await _context.SaveChangesAsync();
                }   
            }

            // seed categories data
            if (_context.ProductCategories.Count() == 0)
            {
                var categoriesData = File.ReadAllText("../Otlob.Repository/Data/DataSeed/categories.json");
                var categories = JsonSerializer.Deserialize<List<ProductCategory>>(categoriesData);
                if (categories?.Count() > 0)
                {
                    foreach (var item in categories)
                    {
                        _context.Set<ProductCategory>().Add(item);
                    }
                    await _context.SaveChangesAsync();
                }
            }

            // seed products data
            if (_context.Products.Count() == 0)
            {
                var productsData = File.ReadAllText("../Otlob.Repository/Data/DataSeed/products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                if (products?.Count() > 0)
                {
                    foreach (var item in products)
                    {
                        _context.Set<Product>().Add(item);
                    }
                    await _context.SaveChangesAsync();
                }
            }

            // Seed Delivery Method
            if (_context.DeliveryMethods.Count() == 0)
            {
                var deliveryData = File.ReadAllText("../Otlob.Repository/Data/DataSeed/delivery.json");
                var delivery = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);
                if (delivery?.Count() > 0)
                {
                    foreach (var item in delivery)
                    {
                        _context.Set<DeliveryMethod>().Add(item);
                    }
                    await _context.SaveChangesAsync();
                }
            }





        }


    }
}
