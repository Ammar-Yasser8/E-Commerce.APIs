using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Otlob.Core.Specification
{
    public interface ISpecification<T> where T : class
    {
        // Criteria is a predicate that takes an entity and returns a boolean
        // It is used to filter entities
        public Expression<Func<T, bool>> Criteria { get; }
        // Includes is a list of expressions that are used to include related entities
        public List<Expression<Func<T, object>>> Includes { get; }
        // OrderBy is a function that takes a T and returns an Sorted T 
        // It is used to order entities
        public Expression<Func<T, object>> OrderBy { get; }
        // It is used to order entities in descending order
        public Expression<Func<T, object>> OrderByDescending { get; }
        // IsPagingEnabled is a boolean that is used to enable or disable paging
        public bool IsPagingEnabled { get; }
        // Skip is an integer that is used to skip a number of entities
        public int Skip { get; }
        // Take is an integer that is used to take a number of entities
        public int Take { get; }


    }
}
