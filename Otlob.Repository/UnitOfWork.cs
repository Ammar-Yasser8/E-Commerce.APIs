using Otlob.Core;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Models.Order;
using Otlob.Repository.Data;
using Otlob.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private readonly Dictionary<Type, object> _repositories;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            _repositories = new Dictionary<Type, object>();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            var type = typeof(TEntity);
            if (!_repositories.ContainsKey(type))
            {
                _repositories[type] = new GenericRepository<TEntity>(_context);
            } 
            return (IGenericRepository<TEntity>)_repositories[type];
        }


        public Task<int> CompleteAsync()
        {
            return _context.SaveChangesAsync();
        }

        public ValueTask DisposeAsync()
        {
           return _context.DisposeAsync();
        }

     
    }
}
