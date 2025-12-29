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

        public static async Task SeedAsync(UserManager<AppUser> _userManager, RoleManager<IdentityRole> _roleManager)
        {
            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
                await _roleManager.CreateAsync(new IdentityRole("Member"));
            }

            if (!_userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Ammar Yasser",
                    Email = "Ammar.Yasser@gmail.com",
                    UserName = "Ammaryasser",
                    PhoneNumber = "01000000000",
                };
                await _userManager.CreateAsync(user, "Pa$$w0rd");
                await _userManager.AddToRoleAsync(user, "Member");
            }

            var adminUser = await _userManager.FindByEmailAsync("admin@otlob.com");
            if (adminUser == null)
            {
                var admin = new AppUser
                {
                    DisplayName = "Admin",
                    Email = "admin@otlob.com",
                    UserName = "admin",
                    PhoneNumber = "0109999999",
                };
                await _userManager.CreateAsync(admin, "Pa$$w0rd");
                await _userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
