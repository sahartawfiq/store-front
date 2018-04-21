DROP DATABASE IF EXISTS bamazondb;
CREATE database bamazondb;

USE bamazondb;

CREATE TABLE products (
  item_id INT(10) NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(10) NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;