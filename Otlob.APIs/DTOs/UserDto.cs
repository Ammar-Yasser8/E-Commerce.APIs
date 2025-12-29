namespace Otlob.APIs.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string Role { get; set; } // Simplified for main role, or use List<string> Roles
    }
}
