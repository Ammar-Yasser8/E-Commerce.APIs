namespace Otlob.APIs.Helper
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; }
        public string Message { get; }
        public T Data { get; }

        public ApiResponse(int statusCode, T data, string message = null)
        {
            StatusCode = statusCode;
            Data = data;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }

        private static string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                200 => "Request successful",
                201 => "Resource created successfully",
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Resource not found",
                500 => "An unhandled error occurred on the server",
                _ => "An unexpected error occurred"
            };
        }

    }
}
