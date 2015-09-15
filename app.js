/**
**/

var  config=require("./config.js");
var express=require("express");
var session=require("express-session");
var cookiesParser=require("cookie-parser");
var errorHandler=require("errorhandler");
var memeryStore=require("connect-mongo")(session);
var route=require("./web_router.js");
var bodyParser=require("body-parser");
var favicon=require("serve-favicon");
var methodOverrid=require("method-override");
var compress=require("compression");
var path=require("path");
var util=require("util");


var app=express();
 
 app.set("port",config.env=="development"?config.debug_port:config.port);
 app.use(favicon(path.join(__dirname,"public/favicon.ico")));
 app.use(methodOverrid());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(cookiesParser(config.cookieSecret));
 app.use(compress());
 app.use(session({
	 resave:true,
	 saveUninitialized:true,
	 secret:config.cookieSecret,
	 store:new memeryStore({url:config.db})
 }));
 //console.log("ok2");
 app.use("/public",express.static(path.join(__dirname,"public")));
 //console.log("ok3");
 app.use('/',route);
 //console.log("ok4");
 
 app.listen(app.get("port"),function(err){
	 if(err)
	 {
		 console.log(err);
	 }else
	 console.log("server running at port:"+app.get("port"));
 });