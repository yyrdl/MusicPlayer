
var crypto = require("crypto");
var config = require("../config");
var User = require("../proxy").User;
var auth = require("../middlewares/auth");

exports.newUser = function (req, res, next) {
	var userInfo = req.body.userInfo;
	function cb2(err, doc) {
		if (err) {
			res.json({
				"message" : "注册失败!"
			});
		} else {
			res.json({
				"message" : "注册成功"
			});
		}
	}
	User.forLogin(userInfo.name, {
		name : 1,
		_id : 1
	}, function (err, doc) {
		if (err) {
			res.json({
				"message" : "Failed to regist! Unknown Error!"
			});
		} else {
			if (doc.length != 0) {
				res.json({
					"message" : "用户名已经存在"
				})
			} else {
				User.newAndSave(userInfo, cb2);
			}
		}
	});

};

exports.signIn = function (req, res, next) {
	var md5 = crypto.createHash("md5");
	var cpass = md5.update(req.body.password).digest("hex");
	var obj = {};
	function cb1(err, doc) {
		if (err) {
			obj = {
				"message" : "Unknown Error!"
			};
			res.type("application/json");
			res.send(JSON.stringify(obj));
		} else {
			if (doc.length == 0) {
				obj = {
					"message" : "用户名不存在"
				};
				res.json(obj);

			} else {
				if (doc[0].password == cpass) {
					obj = {
						"message" : "login successfully",
						"_id" : doc[0]._id,
						"name" : doc[0].name,
						//	"head_portrait":doc[0].head_portrait,
						"head_portrait" : "../public/images/userphoto.png",
						"countOfat" : doc[0].countOfat,
						"at" : doc[0].at,
						"friendsGroup" : doc[0].friendsGroup,
						"unDealedMessage" : doc[0].unDealedMessage
					};
					auth.gen_session(doc[0]._id, res);
					req.session.user = {
						"name" : doc[0].name,
						"password" : doc[0].password,
						_id : doc[0]._id
					};
					res.json(obj);
				} else {
					obj = {
						"message" : "密码错误"
					}
					res.json(obj);
				}
			}
		}
	};

	User.forLogin(req.body.name, {
		name : 1,
		_id : 1,
		password : 1,
		head_portrait : 1,
		countOfat : 1,
		at : 1,
		friendsGroup : 1,
		unDealedMessage : 1
	}, cb1);
};

exports.signOut = function (req, res, next) {
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, {
		path : "/"
	});
	res.redirect("/");
};
