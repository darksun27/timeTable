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

app.get("/api/data", (req, res)=>{
    res.status(200);
    res.json(data.sortedClass);
    res.end();
})

app.post("/fetchData",(req,res)=>{
    res.send({classes : data.classes[req.body.day]});
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started");
})
