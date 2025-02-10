using Microsoft.EntityFrameworkCore;
using Otlob.Core.IRepositories;
using Otlob.Core.Models;
using Otlob.Core.Specification;
using Otlob.Repository.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Repository.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _context;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsyncWithSpec(ISpecification<T> spec)
        {
            return await SpecificationEvaluator<T>.GetQuery(_context.Set<T>(), spec).ToListAsync();
        }

        public async Task<T?> GetAsync(int id)
        {
           return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T?> GetAsyncWithSpec(ISpecification<T> spec)
        {
            return await SpecificationEvaluator<T>.GetQuery(_context.Set<T>(), spec).FirstOrDefaultAsync();

        }
        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await SpecificationEvaluator<T>
                .GetQuery(_context.Set<T>(), spec)
                .CountAsync();
        }

        public async Task<int> GetWithCountAsync(ISpecification<T> spec)
        {
            return await SpecificationEvaluator<T>
                .GetQuery(_context.Set<T>(), spec)
                .CountAsync();
        }

        public async Task<T> AddAsync(T entity)
        {
            await _context.AddAsync(entity);
            return entity;
        }
                

        public void Update(T entity)
        {
            _context.Update(entity);

        }

        public void Delete(T entity)
        {
            _context.Remove(entity);
        }
    }
}
