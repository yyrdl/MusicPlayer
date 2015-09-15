/**
     return special html model
**/


var fs = require("fs");
var path=require("path");

//cache
var main = "";
var personalPage = "";
var squre = "";
var cassetteCreator = "";
var casssette = "";
var chatUI = "";
var register = "";

function readFile(path, callback) {
	var rs = fs.createReadStream(path);
	var str = "";
	rs.on('readable', function () {
		var d = rs.read();
		if (d) {
			if ((typeof d) == 'string')
				str += d;
			else
				if ((typeof d) == 'object' && (d instanceof Buffer))
					str += d.toString('utf8');
		}
	});
	
	rs.on("error", function () {
		callback("error");
	});
	
	rs.on("end", function () {
		callback(null, str);
	});
};


exports.index = function (req, res, next) {
	if (main) {
		res.type("html");
		res.send(main);
	} else {
		function cb1(err, data) {
			if (err) {
				res.set("Content-Type", "text/plain");
				res.send("Unknown Erorr Occured !Please try again!");
			} else {
				res.type("html");
				res.status(200).send(data);
				main = data;
			}
		};
		var sourcePath=path.join(__dirname,"../public/html/index.html");
		readFile(sourcePath, cb1);
	}
};

exports.test = function (req, res, next) {
	res.end("ok");
}

function checkExist(name) {
	switch (name) {
	case "personalPage":
		return personalPage;
		break;
	case "squre":
		return squre;
		break;
	case "cassetteCreator":
		return cassetteCreator;
		break;
	case "casssette":
		return casssette;
		break;
	case "chatUI":
		return chatUI;
		break;
	case "register":
		return register;
		break;
	}
};
function setValue(name, value) {
	switch (name) {
	case "personalPage":
		personalPage = value;
		break;
	case "squre":
		squre = value;
		break;
	case "cassetteCreator":
		cassetteCreator = value;
		break;
	case "casssette":
		casssette = value;
		break;
	case "chatUI":
		chatUI = value;
		break;
	case "register":
		register = value;
		break;
	}
};
/**
  浏览器端发送格式为{"frame":name}的json数据
  服务器以格式{"message":"...","frame":data}返回请求数据
**/
exports.common = function (req, res, next) {
	var model = "";
	model = checkExist(req.body.frame);
	if (model) {
		res.json({'frame' : model,'message' : 'success'});
	} else {
		var spath = "../public/html/" + req.body.frame + ".html";
		var sourcePath=path.join(__dirname,spath);
		//console.log("resource path:"+sourcePath);
		function cb2(err, data) {
			if (err) {
				res.json({
					"message" : 'Error! Failed to get model: '+req.body.frame
				});
			} else {
				res.json({
					"message" : "success",
					'frame' : data
				});
				setValue(req.body.frame, model);
			}
		};
		readFile(sourcePath, cb2);
	}
};
