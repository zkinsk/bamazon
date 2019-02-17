require('dotenv').config() 
var asTable = require ('as-table').configure ({ maxTotalWidth: 200, delimiter: '  |  ' })
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
  menuBar();
});

var menuBar = () => {
let choicesArr = ["Sales by Department", "Add a new Department", "Exit"];
inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do: ",
    choices: choicesArr,
    name: "action"
  }
  ]).then(function(action){
    switch(action.action){
      case choicesArr[0]:
      departmentSales();
      break;
      case choicesArr[1]:
      addDepartment();
      break;
      case choicesArr[2]:
      connection.end();
      process.exit();
      break;
    }
  })
}//end menuBar fn

var addDepartment = () =>{
  inquirer.prompt([
    {
      type: "input",
      name: "dept_name",
      message: "Name of New Department?",
    },
    {
      type: "input",
      name: "overhead",
      message: "What is its overhead?",
    }
  ]).then(function(add){
    // console.log(add);
    let insert = "INSERT INTO departments SET ?";
    let newDep = {
      dep_name: add.dept_name,
      dep_overhead: add.overhead,
    };
    connection.query(insert,newDep,function(err,res){
      if(err){throw err};
      // console.log(res);
      console.log("\n===============\n")
      console.log(colors.bold(` ${add.dept_name} Has been added.`));
      console.log("\n===============\n")
      menuBar();
    })
  });
}//end addDepartment fn


var departmentSales = () => {
  let query = `
    SELECT 
      dep_name as Department, 
      CONCAT('$', format(sum(number_sold * price),2)) as Sales, 
      CONCAT('$',FORMAT(max(dep_overhead),2)) as Overhead, 
      CONCAT('$', FORMAT((SUM(number_sold * price) - max(dep_overhead)),2)) as Profit 
    FROM departments 
    LEFT JOIN products on departments.dep_name = products.department_name 
    GROUP BY dep_name ORDER BY SUM(number_sold * price) - max(dep_overhead) DESC;
  `//end of query
  connection.query(query, function(err,prods){
    if (err){throw err};
    console.log("\n==========================\n");
    console.log(asTable(prods));
    console.log("\n==========================\n");
    // console.log(prods)
    prods.forEach(function(sales){
      let salesNum = sales.Sales;
      // console.log(salesNum);
      if (salesNum){
        salesNum = Number(salesNum.replace(/[^0-9.-]+/g,""));
        // console.log(salesNum);
        let update = "UPDATE departments SET dep_sales = ?, dep_profit = ? - dep_overhead WHERE dep_name = ? "
        connection.query(update,[salesNum, salesNum, sales.Department], function(err,depts){
          if(err){throw err}
        })
      }
    })//end of forEach loop
    menuBar();
  });//end of connection query
}//end of departmentSales
