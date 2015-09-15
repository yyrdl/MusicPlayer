/**
driver.js
author:Jason Zheng
description:control the whole project!
 **/

var ProjectSystem;

function System() {
	this.scripts = {
		"navButtonsController" : false,
		"jquery.transform2d" : false
	};
	this.models = {
		"navButtonsController" : {
			"exist" : false,
			"value" : ""
		}
	};
	this.init();
};
System.prototype = {
	init : function () {
		this.event = new EventPool();
		this.sessionStorage = new FTBStorage(); //主要用来存储用户的信息以避免因页面刷新造成的重新登录
		this.status = "loading";
		this.keyPool = [];
		this.loadEvents();
		this.loadModels();
	},
	setKey : function (name, value) {
		var self = this;
		for (var i = 0; i < self.keyPool.length; i++) {
			if (self.keyPool[i].name == name) {
				sefl.keyPool[i].value = value;
				return true;
			}
		};
		var obj = {
			"name" : name,
			"value" : value
		};
		self.keyPool.push(obj);
		return true;
	},
	getKey : function (name) {
		var self = this;
		for (var i = 0; i < self.keyPool.length; i++) {
			if (self.keyPool[i].name == name) {
				return self.keyPool[i].value;
			}
		}
		return;
	},
	addScript : function (scriptName) {
		var self = this;
		if (self.scripts[scriptName] == true) {}
		else {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			var address = "../public/javascript/" + scriptName + ".js";
			script.setAttribute("src", address);
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(script);
		}
	},
	post : Post,
	addModel : function (name) {
		var self = this;
		if (self.status == "Error")
			return;
		self.post({
			"frame" : name
		}, "/Frame", function (json) {
			if (json.message != "success") {
				self.event.emit("error");
				self.event.emit("alert", json);
			} else {
				self.models[name].value = json.frame;
				self.models[name].exist = true;
				var flag = true;
				for (var p in self.models) {
					if (!self.models[p].exist) {
						flag = false;
						break;
					}
				};
				if (flag) {
					self.event.emit("script");
				};
			}
		});
	},
	loadModels : function () {
		var self = this;
		if (self.status == "Error")
			return;
		for (var p in self.models) {
			self.addModel(p);
		};
	},
	getModel : function (name) {
		var self = this;
		return self.models[name].value;
	},
	loadScripts : function () {
		var self = this;
		if (self.status == "Error")
			return;
		for (var p in self.scripts) {
			self.addScript(p);
		};
	},
	loadEvents : function () {

		var self = this;

		//加载js文档
		self.event.on("process", function (dd) {
			self.scripts[dd] = true;
			var flag = true;

			for (var p in self.scripts) {
				if (!self.scripts[p]) {
					flag = false;
					break;
				}
			}
			if (flag) {
				self.event.emit("ready");
			}
		});

		self.event.on("ready", function () {
			var self = this;
			self.status = "ready";
			if(ProjectSystem.sessionStorage.getItem("message")=="login successfully")
				guodu()
			else
			showLoginForm();
		});

		self.event.on("alert", function (message) {
			console.log("system alert event:" + message.message);
		});

		self.event.on("error", function () {
			this.status = "Error";
		});

		self.event.on("script", function () {
			self.loadScripts();
		});

	}

}

function showLoginForm() {
	$(".Login_container-circle_left").animate({
		left : "150px"
	}, 200);
	$(".Login_container-circle_right").animate({
		right : "150px"
	}, 200);
	$(".Login_container-rectangle").animate({
		width : "300px",
		left : "250px",
	}, 200);
	$(".Login_container-rectangle-form").fadeIn(1000);
};

function hideLoginForm(callback) {
	$(".Login_container-rectangle-form").fadeOut(100);
	$(".Login_container-circle_left").animate({
		left : "300px"
	}, 200);
	$(".Login_container-circle_right").animate({
		right : "300px"
	}, 200);
	$(".Login_container-rectangle").animate({
		width : "0px",
		left : "400px",
	}, 200, function () {
		callback();
	});
};

function loadUserInfo() {
	var Buttons = System.getModel("navButtonsController");
	$("body").append($(Buttons));
	var left=$(".Login_cover").css("left");
	var top=$(".Login_cover").css("top");
	left=parseFloat(left);
	top=parseFloat(top);
	$(".navButtons").css({"left":left+30+"px","top":top+30+"px"});
	$(".userHeadPortrait").attr("src", ProjectSystem.sessionStorage.getItem("head_portrait"));
	$(".navButtons").hide();
	$(".navButtons").fadeIn(2000,function(){
		$(".Login_cover").remove();
	});
	var menu = new MenuController();
};

function guodu() {
	var left1 = $(".Login_container").css("left");
	var left2 = $(".Login_container-circle_left").css("left");
	var top = $(".Login_container").css("top");
	top = parseFloat(top);
	var left = parseFloat(left1) + parseFloat(left2);
	$(".Login_cover").css({
		"left" : left + "px",
		"top" : top
	}).show(10, function () {
		$(".Login_container").remove();
		$(this).animate({
			"width" : "100px",
			"height" : "100px",
			"left" : left + 50 + "px",
			"top" : top + 50 + "px"
		}, 400, function () {
			loadUserInfo();
		});
	});
};

//注册事件
$(function () {

	ProjectSystem = new System();

	$("#Login").on("click", function () {

		var name = $("#username").get(0).value;
		var password = $("#password").get(0).value;
		var obj = {
			"name" : name,
			"password" : password
		};

		ProjectSystem.post(obj, "/signIn", function (json) {

			if (json.message != "login successfully") {
				ProjectSystem.event.emit("alert", json);
			} else {
				ProjectSystem.event.emit("alert", json);
				for (var p in json) {
					ProjectSystem.sessionStorage.setItem(p, json[p]);//保存用户信息
				}
				var date = new Date();
				ProjectSystem.sessionStorage.setItem("Login_date", date.getTime());
				hideLoginForm(guodu);
			}
		});

	});

	$("#Reset").on("click", function () {
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	});

});
