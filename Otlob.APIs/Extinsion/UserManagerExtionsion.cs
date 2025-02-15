using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Otlob.Core.Models.Identity;
using System.Security.Claims;

namespace Otlob.APIs.Extension
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindUserWithAddressAsync(this UserManager<AppUser> userManager,ClaimsPrincipal User)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = userManager.Users.Include(u => u.Address).SingleOrDefaultAsync(u => u.Email == email);
            return await user;




        }
    }
}
