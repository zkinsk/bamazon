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
  listAllItems();
});

function listAllItems(){
  let query = "SELECT * FROM products"
  connection.query(query,function(err,res){
    if(err){throw err};
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
      name: "itemQuantity",
      message: "How Many do you want to purchase?"
    }
  ]).then(function(item){
    let query = "SELECT product_name,stock_quantity,price FROM products WHERE ?"
    connection.query(query,[{id: item.itemID}],function(err,res){
      if(err){throw err};
      let price = res[0].price;
      let stockNum = res[0].stock_quantity;
      let purNum = parseInt(item.itemQuantity);
      let cost = (price * purNum).toFixed(2);
      if (purNum > stockNum){
        console.log(`Sorry, we only have ${stockNum} of those in stock.`)
      }else{
        console.log(`Great! That will be $${cost}`)
        updateStock(item.itemID, (stockNum - purNum), cost);
      }

    })
  });
}//end of purchase prompt fn

function updateStock(id, num, cost){
  let update = "UPDATE products SET?,? WHERE ?";
  connection.query(update,[{stock_quantity: num}, {sales: cost},{id: id}],function(err,res){
    if(err){throw err};
    // console.log(res);
    connection.end();
    process.exit();
  })
};

