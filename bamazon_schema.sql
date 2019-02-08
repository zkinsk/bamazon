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


CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT,
  dep_name VARCHAR(255) NOT NULL,
  dep_overhead DECIMAL(10 , 2 ) NOT NULL,
  dep_sales DECIMAL(10 , 2 ),
  dep_profit INTEGER(10),
  PRIMARY KEY (id)
);