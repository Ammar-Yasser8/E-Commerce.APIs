# Otlob E-Commerce API

## Overview

Otlob is a scalable and secure e-commerce API built using **ASP.NET Core**. It provides a smooth and efficient e-commerce experience, supporting features such as user authentication, product management, order processing, and payment integration via Stripe. The API is designed following **best practices** such as **JWT authentication**, **Onion Architecture**, **Specification Pattern**, **Unit of Work**, **Generic Repository** pattern, and **Redis** caching for optimal performance and maintainability.

## Features

- **Authentication & Authorization** with JWT tokens for secure user login and management.
- **Product Management**: Browse, filter, and sort products, with detailed product information.
- **Basket Management**: Manage shopping baskets by adding, updating, and deleting items.
- **Order Management**: Place, view, and track orders, including shipping and delivery details.
- **Stripe Payment Gateway**: Process secure payments and handle payment events such as success and failure.
- **Pagination, Filtering & Searching**: Efficiently retrieve products with options for filtering, sorting, and pagination.
- **Onion Architecture**: A robust, maintainable structure for organizing code.
- **Specification Pattern**: For flexible and reusable queries.
- **Unit of Work & Generic Repository**: Patterns for data handling with separation of concerns and testability.
- **Redis Caching**: Cache frequently accessed data to enhance API performance.

## Technologies Used

- **ASP.NET Core**: Framework for building the API.
- **Entity Framework Core**: ORM for data access.
- **JWT Authentication**: Secure token-based authentication.
- **Stripe Payment Gateway**: For processing payments.
- **AutoMapper**: For object-to-object mapping.
- **Swagger**: For API documentation.
- **ILogger**: For logging system events.
- **Redis**: For caching frequently accessed data.

## API Endpoints

### **Basket Controller**

- **GET** `/api/Basket?id={id}`
  - **Description**: Retrieves the shopping basket for a specified ID. If no basket exists, an empty basket is returned.

- **POST** `/api/Basket`
  - **Description**: Updates an existing shopping basket with new or updated items.

- **DELETE** `/api/Basket?id={id}`
  - **Description**: Deletes the shopping basket for the specified ID.

### **Account Controller**

- **POST** `/api/Account/Login`
  - **Description**: Logs in a user using email and password, returning a JWT token upon successful authentication.

- **POST** `/api/Account/Register`
  - **Description**: Registers a new user by providing necessary information such as display name, email, password, and phone number.

- **GET** `/api/Account`
  - **Description**: Retrieves information for the currently authenticated user.

- **GET** `/api/Account/address`
  - **Description**: Retrieves the current user's shipping address.

### **Orders Controller**

- **POST** `/api/orders`
  - **Description**: Creates a new order by providing basket ID, shipping address, and delivery method ID.

- **GET** `/api/orders`
  - **Description**: Retrieves a list of orders for the authenticated user.

- **GET** `/api/orders/{id}`
  - **Description**: Retrieves the details of a specific order by ID for the authenticated user.

- **GET** `/api/orders/deliveryMethods`
  - **Description**: Retrieves a list of available delivery methods for orders.

### **Payments Controller**

- **POST** `/api/payments/{basketId}`
  - **Description**: Creates or updates a payment intent for the specified basket ID. This is typically used to initiate a payment process.

- **POST** `/api/payments/webhook`
  - **Description**: A webhook endpoint that listens for Stripe payment events. It handles events like payment success or failure and updates the order status accordingly.

### **Products Controller**

- **GET** `/api/Products`
  - **Description**: Retrieves a list of products, supporting pagination, filtering, and sorting by parameters such as brand, category, and price range.

- **GET** `/api/Products/{id}`
  - **Description**: Retrieves detailed information about a specific product by its ID.

- **GET** `/api/Products/brands`
  - **Description**: Retrieves a list of all available product brands.

- **GET** `/api/Products/categories`
  - **Description**: Retrieves a list of all available product categories.

## Authentication & Authorization

- **JWT Tokens**: The API uses JWT tokens to authenticate users. Upon login, a JWT token is generated and used to authorize further requests to protected routes.
  
- **Authorization**: Routes that require user authentication are protected using the `[Authorize]` attribute. The token is sent in the HTTP request header to access these routes.

### Example of protected route access:
- **GET** `/api/orders` requires the user to include a valid JWT token in the `Authorization` header as `Bearer {token}`.

## Payment Integration

- The API integrates **Stripe** for payment processing. It handles various events like payment success or failure using **webhooks** to update the order status.
- **Payment Intent**: A Stripe concept used for securely managing payments. The API communicates with Stripe to create, update, and confirm payment intents for orders.

## Unit of Work & Generic Repository

- **Unit of Work**: This pattern helps manage database transactions and ensures that multiple operations are coordinated and committed together. It allows the application to treat each unit of work as a single transaction, making the codebase more testable and maintainable.

- **Generic Repository**: The generic repository pattern abstracts the data access logic into reusable components. It provides common CRUD operations for entities, improving code maintainability and reducing duplication.

## Redis Caching

- **Redis** is used to cache frequently requested data like product listings, user sessions, and other non-volatile data. This reduces the load on the database and improves response times for commonly requested resources.
- The data is stored in **Redis** with an expiration time to ensure cache freshness.

## Installation & Setup

### Prerequisites

- **.NET 6.0 or higher**
- **SQL Server** or a compatible database.
- **Redis** for caching.
- **Stripe account** for payment gateway integration.

### Setup Instructions

1. Clone the repository.
2. Configure **Stripe** API keys and **Redis** connection string in `appsettings.json`.
3. Run database migrations to set up the schema:
   - `dotnet ef database update`
4. Start the application:
   - `dotnet run`

## Contributing

Feel free to open issues, submit pull requests, or suggest features if you encounter any bugs or want to add new functionality!

