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
let choicesArr = ["Sales by Department", "Add a new Department"];
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
      console.log(res);
      console.log("\n===============\n")
      console.log(colors.bold(` ${add.dept_name} Has been added.`));
      console.log("\n===============\n")
      menuBar();
    })
  });
}//end addDepartment fn


var departmentSales = () => {
  let query = "SELECT department_name as Department, sum(number_sold * price) as Sales, max(dep_overhead) as Overhead, (SUM(number_sold * price) - max(dep_overhead)) as Profit FROM departments INNER JOIN products on departments.dep_name = products.department_name GROUP BY dep_name ORDER BY Profit DESC;"
  connection.query(query, function(err,prods){
    if (err){throw err};
    console.log("\n==========================\n");
    console.log(asTable(prods));
    console.log("\n==========================\n");
    // console.log(prods)
    prods.forEach(function(sales){
      let update = "UPDATE departments SET dep_sales = ?, dep_profit = ? - dep_overhead WHERE dep_name = ? "
      connection.query(update,[sales.Sales, sales.Sales, sales.Department], function(err,depts){
        // console.log(depts);
        if(err){throw err}
        // console.log(depts);
      })
    })//end of forEach loop
  });//end of connection query
}//end of departmentSales

