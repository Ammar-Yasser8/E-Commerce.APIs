using Microsoft.EntityFrameworkCore;
using Otlob.Core.Models;
using Otlob.Core.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Repository.Repositories
{
    internal static class SpecificationEvaluator<T> where T : class
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery , ISpecification<T> spec)
        {
            var query = inputQuery.AsQueryable();
            // Apply Filtering
            if (spec.Criteria != null)
                query = query.Where(spec.Criteria);
            // Apply sorting
            if (spec.OrderBy != null)
                query = query.OrderBy(spec.OrderBy); // Assign result back to query
            else if (spec.OrderByDescending != null)
                query = query.OrderByDescending(spec.OrderByDescending);
            // Apply paging if enabled
            if (spec.IsPagingEnabled)
                query = query.Skip(spec.Skip).Take(spec.Take);
            // Apply includes
            query = spec.Includes.Aggregate(query,(currentQuery, includeExpression) => currentQuery.Include(includeExpression)); 

            return query;
        }
    }
}
