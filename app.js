//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const Item1 = new Item ({
  name: "Welcome to your todo list"
});

const Item2 = new Item ({
  name: "Hit the + button to add a new item"
});

const Item3 = new Item ({
  name: "<-- hit this to delete an item."
});


const defaultItems = [Item1, Item2, Item3];




app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        }else{
          console.log("successfully added the default items to the database");
        }
      });
      res.redirect("/");
    }else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log("successfully Removed the checked Item.");
      res.redirect("/");
    }
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
