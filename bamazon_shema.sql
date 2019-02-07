DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
id INTEGER AUTO_INCREMENT,
product_name VARCHAR (255) NOT NULL,
department_name VARCHAR (255) NOT NULL,
price DECIMAL(10, 2) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY id
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('Nose Hair Trimmer', 'Personal Hygene', 24, 3),
('Cat Bed', 'Pet Supplies', 35, 15),
('Pigmy Giraffe', 'Pet Store', 100, 2),
('Comb', 'Personal Hygene', 2, 55),
('Tooth Paste', 'Personal Hygene', 5, 70),
('Dog toy', 'Pet Supplies', 3, 15),
('Bully Stick', 'Pet Supplies', 10, 4),
('Mac "A" key', 'Computer Supplies', 10, 55),
('1TB Hard Drive', 'Computer Supplies', 120, 5),
('A Mouse', 'Computer Supplies', 10, 500),
('Water Bottle Holder', 'MTB Supplies', 5, 5),
('MTB Seat', 'MTB Supplies', 30, 3),
('MTB Pedals', 'MTB Supplies', 40, 15),
('6mm Stem', 'MTB Supplies', 80, 3),
('MAXXIS Minion DHR', 'MTB Supplies', 60, 10);

SELECT * FROM products;





