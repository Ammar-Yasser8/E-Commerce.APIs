using Microsoft.AspNetCore.Identity;
using Otlob.Core.Models.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Repository.Identity.DataSeed
{
    public static class AppIdentityDbContextSeed
    {
        public static async Task SeedAsync(UserManager<AppUser> _userManager)
        {
            if (_userManager.Users.Count() == 0)
            {
                var user = new AppUser
                {
                    DisplayName = "Ammar Yasser",
                    Email = "Ammar.Yasser@gmail.com",
                    UserName = "Ammaryasser",
                    PhoneNumber = "01000000000",
                };
                await _userManager.CreateAsync(user, "Pa$$w0rd");

            }

        }
    }
}
