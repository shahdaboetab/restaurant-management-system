# Restaurant Management System (RMS)

![Restaurant Management System](https://via.placeholder.com/1200x400?text=Smart+Restaurant+Management+System)  
*A complete Spring Boot + React + Docker solution for restaurant operations*

## Overview

This **Smart Restaurant Management & Online Ordering System** is a full-stack application built according to the official Software Requirements Specification (SRS). It supports:

- Online takeaway ordering
- Real-time order tracking
- Role-based access (Customer, Staff, Admin)
- Menu & category management
- Staff notifications and order status updates

## Features

### Customer Tools
- Browse categorized menu
- Add items to cart
- Place takeaway orders
- Real-time order tracking (Pending → Preparing → Ready → Completed)
- View order history

### Staff Tools (Chef / Waiter)
- View all active orders
- Real-time notification when new orders arrive
- Update order status

### Admin / Manager Tools
- Add/Edit/Remove menu items
- Manage categories
- Manage users and assign roles (Admin, Chef, Waiter, Customer)
- View all orders and daily statistics

### Technology Stack
- **Backend**: Spring Boot 3, Spring Security (JWT), JPA/Hibernate, WebSocket
- **Database**: PostgreSQL
- **Frontend**: Plain HTML/CSS/JavaScript (modular structure)
- **Deployment**: Docker

## Project Structure

```
restaurant-management-system/
├── pom.xml
├── Dockerfile
├── README.md
├── src/
│   └── main/
│       ├── java/com/example/rms/
│       │   ├── RmsApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java
│       │   │   └── WebSocketConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── CategoryController.java
│       │   │   ├── MenuController.java
│       │   │   ├── OrderController.java
│       │   │   └── PaymentController.java
│       │   ├── entity/
│       │   │   ├── Category.java
│       │   │   ├── MenuItem.java
│       │   │   ├── Order.java
│       │   │   ├── OrderItem.java
│       │   │   ├── Payment.java
│       │   │   └── User.java
│       │   ├── dto/
│       │   │   ├── LoginRequest.java
│       │   │   ├── OrderRequest.java
│       │   │   └── RegisterRequest.java
│       │   ├── repository/
│       │   │   ├── CategoryRepository.java
│       │   │   ├── MenuItemRepository.java
│       │   │   ├── OrderItemRepository.java
│       │   │   ├── OrderRepository.java
│       │   │   ├── PaymentRepository.java
│       │   │   └── UserRepository.java
│       │   ├── service/
│       │   │   ├── CategoryService.java
│       │   │   ├── MenuService.java
│       │   │   ├── NotificationService.java
│       │   │   ├── OrderService.java
│       │   │   ├── PaymentService.java
│       │   │   └── UserService.java
│       │   └── security/
│       │       ├── JwtUtil.java
│       │       └── UserDetailsServiceImpl.java
│       └── resources/
│           └── application.properties
└── frontend/
    ├── css/
    │   ├── style.css
    │   └── bootstrap.min.css
    ├── js/
    │   ├── main.js
    │   ├── customer.js
    │   ├── staff.js
    │   └── admin.js
    ├── images/
    │   ├── logo.png
    │   ├── menu-item1.jpg
    │   └── ...
    ├── customer/
    │   ├── customer-menu.html
    │   ├── customer-cart.html
    │   ├── customer-order.html
    │   └── customer-orders.html
    ├── staff/
    │   ├── staff-orders.html
    │   └── staff-update.html
    └── admin/
        ├── admin-dashboard.html
        ├── admin-menu.html
        ├── admin-categories.html
        ├── admin-users.html
        └── admin-orders.html
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js 16+ (for frontend development)
- Docker (optional, for containerized deployment)

## Installation & Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd restaurant-management-system
   ```

2. **Configure Database:**
   - Create a PostgreSQL database named `rms_db`
   - Update `src/main/resources/application.properties` with your database credentials:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/rms_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build and Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Serve the frontend:**
   - Since this is a plain HTML/CSS/JS frontend, you can serve it using any static server
   - For development, you can use Python's built-in server:
     ```bash
     python -m http.server 3000
     ```
   - Or use Node.js live-server:
     ```bash
     npx live-server --port=3000
     ```

3. **Access the application:**
   - Open `http://localhost:3000` in your browser
   - Start with the customer interface or login as admin

### Docker Deployment (Optional)

1. **Build the Docker image:**
   ```bash
   docker build -t rms-app .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item (Admin only)
- `PUT /api/menu/{id}` - Update menu item (Admin only)
- `DELETE /api/menu/{id}` - Delete menu item (Admin only)

### Order Endpoints
- `POST /api/orders` - Place new order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/user/{userId}` - Get user's orders
- `PUT /api/orders/{id}/status` - Update order status (Staff/Admin)

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### User Management (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/{id}/role` - Update user role

## Usage

### For Customers
1. Register/Login to access the system
2. Browse menu items by category
3. Add items to cart
4. Place order with payment details
5. Track order status in real-time

### For Staff
1. Login with staff credentials
2. View active orders dashboard
3. Receive real-time notifications for new orders
4. Update order status as items are prepared

### For Admins
1. Login with admin credentials
2. Manage menu items and categories
3. View system statistics and reports
4. Manage user roles and permissions

## WebSocket Integration

The system uses WebSocket for real-time communication:
- **Endpoint:** `/ws`
- **Topic:** `/topic/orders` - New order notifications
- **Topic:** `/user/{userId}/queue/orders` - Order status updates for customers

## Security Features

- JWT-based authentication
- Role-based access control (Customer, Staff, Admin)
- Password encryption
- CORS configuration for frontend integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@rms.com or join our Slack channel.

---

**Built with ❤️ for efficient restaurant management**
