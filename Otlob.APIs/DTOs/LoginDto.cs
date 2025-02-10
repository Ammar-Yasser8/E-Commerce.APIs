using System.ComponentModel.DataAnnotations;

namespace Otlob.APIs.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } 
        public string Password { get; set; }
    }
}
