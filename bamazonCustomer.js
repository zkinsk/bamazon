require('dotenv').config()
var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MY_PASS,
    database: "bamazon"
});

connection.connect(function(err) {
  if (err) {throw err};
  listItems();
});

function listItems(){
  let query = "SELECT * FROM products"
  connection.query(query,function(err,res){
    res.forEach(function(prod){
      console.log(`
      Item ID: ${prod.id}  -  ${prod.product_name} - $${prod.price}`)
    })
    purchasePrompt()
  })
}// end of list items fn;

function purchasePrompt(){
  console.log("\n===================================================\n")
  inquirer.prompt([
    {
        type: "input",
        name: "itemID",
        message: "Enter ID of item you want to buy",
    },
    {
      type: "input",
      name: "itemQuanity",
      message: "How Many do you want to purchase?"
    }
  ]).then(function(item){
    console.log(item);

  });
}//end of purchase prompt fn

