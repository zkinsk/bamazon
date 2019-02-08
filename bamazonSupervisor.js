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
    console.log(add);
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


var departmentSales = () =>{

}//end departmentSales fn