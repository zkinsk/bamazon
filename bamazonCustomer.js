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
  actionPrompt();
});

var actionPrompt = () => {
  console.log("\n===================================================\n")
  let choicesArr = ["View and Buy an Item", "Exit"];
  inquirer.prompt([
    {
      type: "list",
      message: "Welcome to bAmazon, what would you like to do? \n",
      choices: choicesArr,
      name: "action"
    }
  ]).then(function (action) {
    switch (action.action) {
      case choicesArr[0]:
        listAllItems();
        break;
      case choicesArr[1]:
        connection.end();
        process.exit();
        break;
    }
  })//end of then
}//end of actionPrompt


function listAllItems(){
  let query = "SELECT * FROM products"
  let itemList = [];
  connection.query(query,function(err,res){
    if(err){throw err};
    // console.log(res);
    res.forEach(function(prod){
      console.log(`
      Item ID: ${prod.id}  -  ${prod.product_name} - $${prod.price}`);
      itemList.push(prod.id);
    })
    purchasePrompt(itemList)
  })
}// end of list items fn;

function purchasePrompt(itemList) {
  console.log("\n===================================================\n")
  inquirer.prompt([
    {
      type: "confirm",
      message: "Would you like to make a purchase?",
      name: "yesno",
      default: true
    }
  ]).then(function (yesNo) {
    console.log("\n===================================================\n")
    if (yesNo.yesno) {
      inquirer.prompt([
        {
          type: "input",
          name: "itemID",
          message: "Enter ID of item you want to buy",
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
          name: "itemQuantity",
          message: "How Many do you want to purchase?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ]).then(function (item) {
        let query = "SELECT product_name,stock_quantity,price,number_sold FROM products WHERE `id`= ?"
        connection.query(query, [item.itemID], function (err, res) {
          if (err) { throw err };
          let price = res[0].price;
          let stockNum = res[0].stock_quantity;
          let purNum = parseInt(item.itemQuantity);
          let cost = (price * purNum).toFixed(2);
          if (purNum > stockNum) {
            console.log(`Sorry, we only have ${stockNum} of those in stock.`)
            actionPrompt();
          } else {
            console.log("\n===================================================\n")
            console.log(`Great! That will be $${cost}`)
            console.log("\n===================================================\n")
            updateStock(item.itemID, purNum);
          }
        })
      });//end then
    }else{actionPrompt()};
  })//end then
}//end of purchase prompt fn

function updateStock(id, purNum){
  let update = "UPDATE products SET `stock_quantity` = `stock_quantity` - ?,`number_sold` = `number_sold` + ? WHERE `id` = ?";
  connection.query(update,[purNum,purNum,id],function(err,res){
    if(err){throw err};
    // console.log(res);
    actionPrompt();
  })
};//end of updateStock fn

