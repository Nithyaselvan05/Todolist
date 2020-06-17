//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _=require("lodash");
const mongoose= require("mongoose")
const app = express();
let day = date.getDate();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-nithi:Test123@cluster0-1cy2v.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true})
const itemSchema=new mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",itemSchema)
const first=new Item({
  name:"Play pubg"
});
const second=new Item({
  name:"Play COD"
});
const third=new Item({
  name:"Play Fornite"
});
const fourth=new Item({
  name:"Play ApexLegends"
});
const listSchema={
  name:String,
  items:[itemSchema]
};
const List=mongoose.model("List",listSchema)
app.get("/:par",function(req,res){
  const parameter=_.capitalize(req.params.par);
  List.findOne({name:parameter},function(err,foundLists){
    if (!err) {
      if(!foundLists){
        //Create a list
        const list1=new List({
          name:parameter,
          items:[first,second,third,fourth]
        })
        list1.save();
        res.redirect("/"+parameter);
      }
      else{
        res.render("list", {listTitle: parameter, newListItems: foundLists.items});
      }
    }
  });
});
app.post("/", function(req, res){
  const item = req.body.newItem;
  const listName=req.body.list;
  const item1=new Item({
    name:item
  });
  if (listName==="Today") {
    item1.save();
    res.redirect("/");
  }
  else {
    List.findOne({name:listName},function(err,foundItem){
      if(!err){
        foundItem.items.push(item1);
        foundItem.save();
        res.redirect("/"+listName);
      }
      else{
        console.log("Error found");
      }
    });
  }
});
app.post("/delete",function(req,res){
  const request=req.body.checkbox;
  const listName=req.body.listName;
  if (listName==="Today") {
    Item.findByIdAndRemove(request,function(err){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
    }
   else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:request}}},function(err){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
});
app.get("/", function(req, res) {
  Item.find(function(err,items){
    if(items.length===0){
      Item.insertMany([first,second,third,fourth],function(err){
        if (err) {
          console.log(err);

        } else {
          console.log("Working perfectly");
        }
      })
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: items});
    }
});
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });
// if (req.body.list === "Work") {
//   workItems.push(item);
//   res.redirect("/work");
// } else {
//   items.push(item);
//   res.redirect("/");
// }
