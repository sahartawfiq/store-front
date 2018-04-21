var mysql = require("mysql");
var inquirer = require("inquirer");
var itemNumber = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "8aghdad",
  database: "bamazondb"
});

connection.connect(function(err) {
  if (err) throw err; 
});

selectOption();
function selectOption() {
  inquirer.prompt({
      name: "options",
      type: "rawlist",
      message: "\n Inventory Management Options:",
      choices: ["Products for sale", "Low inventory", "Add to inventory", "Add new Product"]
    })
    .then(function(answer) {
        switch (answer.options) {
          case "Products for sale":
            productsForSale();
            break;

          case "Low inventory":
            checkLowInvetory();
            break;

          case "Add to inventory":
            addToInventory();
            break;

          case "Add new Product":
            addProduct();
            break;     
        }
    });
}

function productsForSale() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " + res[i].price + " || " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    
  });
}
function checkLowInvetory(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
          console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " + res[i].price + " || " + res[i].stock_quantity);
          console.log("-----------------------------------");
        }
      }
  });
}

function addToInventory(){
  inquirer.prompt([
  {
      name: "itemId",
      type: "input",
      message: "Please enter item number.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
      }
    },
    {
      name: "stockAddition",
      type: "input",
      message: "Please enter number of items to be added.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }    
    }
  ])
    .then(function(answer) {
      itemNumber = parseInt(answer.itemId);
      console.log(answer);
      var numberAdded = parseInt(answer.stockAddition); 
      connection.query("UPDATE products SET stock_quantity = (stock_quantity + " + numberAdded + ") WHERE item_id =" + itemNumber, function (err, res){
          if (err) {
            console.log(err);
          }else{
            console.log("update sucess");
          }
      }) 
  });
}
// add a function to add a new product
// function addProduct() {
//   console.log("Inserting a new product...\n");
//   var query = connection.query(
//     "INSERT INTO products SET ?",
//     {
//       item: "newItem",
//       price: "price",
//       quantity: "quantity"
//     },
//     function(err, res) {
//       console.log(res.affectedRows + " item inserted!\n");
//       addToInventory();
//     }
//   );
// }

    
  
