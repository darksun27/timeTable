var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var data = require('./workbook.js');

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res)=>{
    res.render("index");
})

app.post("/fetchData",(req,res)=>{
    console.log("Ajax call");
    console.log(req.body.day);
    res.send({classes : data.classes[req.body.day]});
})

app.listen(process.env.PORT,"localhost",function(){
    console.log("Server Started");
})
