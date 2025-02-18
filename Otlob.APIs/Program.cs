using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Otlob.APIs.Helper;
using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models.Identity;
using Otlob.Repository;
using Otlob.Repository.Data;
using Otlob.Repository.Identity;
using Otlob.Repository.Identity.DataSeed;
using Otlob.Repository.Repositories;
using Otlob.Repository.Service.Contract;
using Otlob.Service;
using StackExchange.Redis;
using System.Text;

namespace Otlob.APIs
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration
                    .GetConnectionString("DefaultConnection"));
            });
            builder.Services.AddDbContext<AppIdentityDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration
                    .GetConnectionString("IdentityServer"));

            });

            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AppIdentityDbContext>();
               
            builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var connection = builder.Configuration.GetConnectionString("Redis");
                return ConnectionMultiplexer.Connect(connection);
            });
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped(typeof(IOrderService), typeof(OrderService));
            builder.Services.AddScoped<IBasketRepository, BasketRepository>();  
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped(typeof(IAuthService), typeof(AuthService));
            builder.Services.AddAuthentication(
                op =>
                {
                    op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    op.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }

                ).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])),
                    ClockSkew = TimeSpan.FromDays(1)
                };
            });

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();  // Enables logging to console
            builder.Logging.AddDebug();
            var app = builder.Build();

            // Create a scope to get an instance of the DbContext Explicitly
            using var scope = app.Services.CreateScope();
           
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var identityDbContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
            var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
            try
            {
                await dbContext.Database.MigrateAsync();
                await identityDbContext.Database.MigrateAsync();    
                await AppContextSeed.SeedAsync(dbContext);
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                await AppIdentityDbContextSeed.SeedAsync(userManager);
            }
            catch (Exception ex)
            {
                loggerFactory.CreateLogger<Program>().LogError(ex, "An error occurred while migrating the database.");
            }
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
