var mysql = require("mysql");
var inquirer = require("inquirer");
var itemNos = [];
var quantityInput = 0;
var itemNo = 0;
var itemPrice = 0;
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "8aghdad",
  database: "bamazondb"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  
});
displayList();
function displayList() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      itemNos.push(res[i].item_id);
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    
    selectProduct();
  });
}

function selectProduct() {
  inquirer.prompt({
      name: "itemId",
      type: "input",
      message: "Please enter item number.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }    
    })
    .then(function(answer) {
    // based on their answer, store the item number in itemNo 
      itemNo = parseInt(answer.itemId);
     
        if (itemNos.indexOf(itemNo) < 0) {
          console.log("Not a valid item number.");
          console.log("-----------------------------------");
          selectProduct();
        }else{
         console.log(itemNo);
         quantity();
        }    
    });
}
function quantity(){
  inquirer.prompt({
      name: "quantity",
      type: "input",
      message: "Please enter quantity.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }    
    })
    .then(function(answer) {
      quantityInput = parseInt(answer.quantity);
      
      stock();
})
}
function stock(){
  var query = "SELECT * FROM products WHERE ?";connection.query(query, {item_id: itemNo}, function(err, res) {
    if (err) throw err;

    var currentStock = res[0].stock_quantity;
    if (currentStock < quantityInput) {
      console.log("\n Sorry insufficient quantity in stock!");
      return;
    }else{
      var stock = res[0].stock_quantity - quantityInput;
      itemPrice = res[0].price;
      console.log("\n Your total cost is:  $" + (itemPrice * quantityInput));
    }
    connection.query(
      "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: stock
          },
          {
            item_id: itemNo
          }
        ],
          function(error) {
            if (error) throw err; 
            console.log("\n Stock Updated!");
        }
    );
  });
}

    
  
