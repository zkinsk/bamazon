require('dotenv').config()
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MY_PASS,
    database: "bamazon"
});

connection.connect(function(err) {
  if (err) {throw err};
  showMenu();
});//end on connect fn

function viewAllProducts(){
  let query = "SELECT * FROM products"
  connection.query(query,function(err,res){
    if(err){throw err};
    console.log("\n===============\n")
    res.forEach(function(prod){
      if (prod.stock_quantity < 5){
        console.log(colors.red(`ID: ${prod.id}  -  ${prod.product_name} - $${prod.price} || Stock Quantity: ${prod.stock_quantity}`));
      }
      else{
        console.log(`ID: ${prod.id}  -  ${prod.product_name} - $${prod.price} || Stock Quantity: ${prod.stock_quantity}`);
      }
    })
    console.log("\n===============\n")
    showMenu();
  })
}// end of view all products fn;

function viewLowInventory(){
  let query = "SELECT id,product_name,stock_quantity FROM products WHERE stock_quantity < 5";
  connection.query(query,function(err, res){
    if(err){throw err};
    console.log("\n===============\n")
    res.forEach(function(prod){
        console.log(colors.red(`ID: ${prod.id}  -  ${prod.product_name} || Stock Quantity: ${prod.stock_quantity}`));
    })
    console.log("\n===============\n")
    showMenu();
  })
}//end of viewLowInv fn

function addInventory(){
  let itemList = []
  let query = "SELECT * FROM products"
  connection.query(query,function(err,res){
    if(err){throw err};
    console.log("\n===============\n")
    res.forEach(function(prod){
      itemList.push(prod.id);
      if (prod.stock_quantity < 5){
        console.log(colors.red(`ID: ${prod.id}  -  ${prod.product_name} - $${prod.price} || Stock Quantity: ${prod.stock_quantity}`));
      }
      else{
        console.log(`ID: ${prod.id}  -  ${prod.product_name} - $${prod.price} || Stock Quantity: ${prod.stock_quantity}`);
      }
    })
    console.log("\n===============\n")
    inquirer.prompt([
      {
        type: "input",
        name: "prodID",
        message: "Which ID to add Inventory? ",
        validate: function (value) {
          value = parseInt(value)
          if (itemList.includes(value)) {
            return true;
          }
          return false;
        }//end of validation
      },
      {
        type: "input",
        name: "prodIncrement",
        message: "How many to add?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
      ]).then(function(add){
        let pID = add.prodID;
        let inCr = parseInt(add.prodIncrement);
        // console.log(pID, inCr);
        let update = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?"; 
        connection.query(update,[inCr, {id:pID}],function(err,res){
          if(err){throw err};
          // console.log(res);
          showMenu();
        })
      });
  })
}// end of addInventory fn

function departmentCheck(){
  let deptArr = [];
  let query = "SELECT dep_name FROM departments"
  connection.query(query, function(err,res){
    res.forEach(function(dep){
      deptArr.push(dep.dep_name)
    });
    addNewItem(deptArr);
  })
}//end of departmentCheck fn

function addNewItem(deptArr){
  inquirer.prompt([
    {
      type: "list",
      name: "dept",
      message: "Which Department?",
      choices: deptArr,
    },
    {
      type: "input",
      name: "name",
      message: "What Product would you like to add?",
    },
    {
      type: "input",
      name: "cost",
      message: "How much will it sell for?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      type: "input", 
      name: "num",
      message: "How many to sell?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
    ]).then(function(add){
      // console.log(add);
      let insert = "INSERT INTO products SET ?";
      let newProd = {
        product_name: add.name,
        department_name: add.dept,
        price: add.cost,
        stock_quantity: add.num
      };
      connection.query(insert,newProd,function(err,res){
        if(err){throw err};
        console.log("\n===============\n")
        console.log(colors.bold(`Inserted ${add.num} ${add.name}s into ${add.dept} at $${add.cost} each.`));
        console.log("\n===============\n")
        // console.log(res)
        showMenu();
      })
    });
}//end addNewItem fn

var showMenu = () => {
let choiceArr = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
inquirer.prompt([
  {
    type: "list",
    name: "menuItem",
    message: "Pick an Action: ",
    choices: choiceArr,
  }
  ]).then(function(action){
    switch(action.menuItem){
      case choiceArr[0]:
      viewAllProducts();
      break;
      case choiceArr[1]:
      viewLowInventory();
      break;
      case choiceArr[2]:
      addInventory();
      break;
      case choiceArr[3]:
      departmentCheck();
      break;
      case choiceArr[4]:
      connection.end();
      process.exit();
      break;
    }
  });
}//end showMenu fn
