//jshint esversion:6
require("dotenv").config();
const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");

const app= express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});
const userSchema= new mongoose.Schema({email: String, password: String});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
const User= mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const email= req.body.username;
  const password= req.body.password;
  User.findOne({email: email}, function(err, findUser){
    if(err){
      console.log(err);
    }else{
      if(findUser && findUser.password === password){
        res.render("secrets")
      }else{
        res.render("login");
      }
    }
  });
});

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser= new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});






app.listen(3000, function(){
  console.log("server runing at port 3000");
});
