USE restaurant_management_system;
-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_desc VARCHAR(500)
);

-- Create menuItems table
CREATE TABLE menuItems (
    menuItem_id INT AUTO_INCREMENT PRIMARY KEY,
    menuItem_name VARCHAR(255) NOT NULL,
    menuItem_desc VARCHAR(500),
    menuItem_price DOUBLE NOT NULL,
    menuItem_imageUrl VARCHAR(500),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Create customers_orders table
CREATE TABLE customers_orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT,
    status VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE order_items (
    itemId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    productname VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY (orderId) REFERENCES customers_orders(orderId),
    FOREIGN KEY (productId) REFERENCES menuItems(menuItem_id)
);
