const express = require("express");
const config = require("config");
const body_parser = require("body-parser");

var app = express();
//accept localhost
app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000,
  }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//body-parser

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));

//config path views
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
//config path css,js,imgs
app.use("/static", express.static(__dirname + "/public"));
//config path controllers
var controllers = require(__dirname + "/apps/controllers");
app.use(controllers);

var port = config.get("server.port");
var host = config.get("server.host");
app.listen(process.env.PORT || port, host, function(err) {
    if(err) console.log("Connect to " + port + "of Server fail");
    else  console.log("Connect to " + port + " of Server success!");
})
