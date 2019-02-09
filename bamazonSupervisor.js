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


var departmentSales = () =>{
  let departmentArr = [];
  connection.query("SELECT dep_name FROM departments", function(err,res){
    if (err){throw err};
    res.forEach(function(dep){
      departmentArr.push(dep.dep_name);
    })
    departmentObj(departmentArr);
  });//end of connection query
} //end departmentSales fn

var departmentObj = (depArr) =>{
  let salesArr = []
  let query = "SELECT department_name, number_sold, price, dep_overhead FROM products, departments WHERE products.department_name = departments.dep_name"
  connection.query(query,function(err,res){
    if(err){throw err};
    depArr.forEach(function(dep){
      let x = {
        department: dep,
        overhead: 0,
        totSales: 0,
      }
      res.forEach(function(res){
        if (dep === res.department_name ){
          x.overhead = res.dep_overhead;
          x.totSales += (res.number_sold * res.price)
        }
      })
      salesArr.push(x);
    })
    // console.log(salesArr);
    deptLog(salesArr);
  })//end of connection query
}//end departmentSales fn

var deptLog = (salesArr) =>{
  salesArr.forEach(function (dep){
    let profit = (dep.totSales - dep.overhead).toFixed(2);
    console.log(`
    Department: ${dep.department} || Overhead: $${dep.overhead.toFixed(2)} || Total Sales: $${dep.totSales.toFixed(2)} || Profit: $${profit}
    `)

  });//end sales arr.forEach
  connection.end();
}