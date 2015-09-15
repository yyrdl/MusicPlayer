
var config = {
	"defaultSourceDir" : "../public/",
	"scriptSubDirname" : "javascript",
	"cssSubDirname" : "css",
	"globalScript" : [{
			"name" : "jquery-1.8.3.min.js"
		}, {
			"name" : "login.js"
		}
	],
	"globalCss" : [{
			"name" : "global.css"
		}
	]
};

System.config(config);

var v1 = System.getReadyVersion();

System.install("login.css", v1);
System.install("login.js", v1);
System.install("navButtonsController.css", v1);
System.install("navButtonsController.js", v1);
System.install("jquery.transform2d.js", v1);
System.install("player.css",v1);
System.install("cassete-0.1.js",v1);
System.on("ready", v1, function () {

	System.on("message", function (message) {
		console.log("system:" + message.message);
	});

	System.on("prepareModuleOk", function () {
		$("body").html(System.getKey("login"));
		var $player=$(System.getKey("player"));
		$("body").append($player);
		if (System.sessionStorage.getItem("name")) {
			showLoginForm();
			guodu();
		} else {

			setTimeout(function () {
				registLoginEvent();
			}, 200);
		}

	});

	//begin prepare the login module
	var waterFall1 = System.waterFall();
    var args=["login","navButtonsController","player"];
	function cb(Args) {
		
		System.post({
			"frame" : Args.args[Args.n]
		}, "/Frame", function (json) {
			if (json.message == "success") {
				System.setKey(Args.args[Args.n], json.frame);
				Args.n++;
				waterFall1.next(Args);
			} else {
				System.emit("message", {
					"message" : json
				});
				return false;
			}
		});
	};
    var func=[];
	for(var i=0;i<args.length;i++)
	{
		func.push(cb);
	}
	 
	waterFall1.regist(func, function () {
		System.emit("prepareModuleOk");
	});
    var obj={
		"args":args,
		"n":0
	};
	waterFall1.fire(obj);

});

// after login successfully!
System.on("loginOk", function () {
	System.uninstall("login.js");
	System.uninstall("login.css");
	System.deleteKey("login");
	var width;
	var height;
	if (window.innerWidth) {
		width = window.innerWidth;
		height = window.innerHeight;
	} else {
		width = document.body.clientWidth;
		height = document.body.clientHeight;
	}

	var waterFall2 = System.waterFall();

	function step1() {
		System.menu.run(function () {
			waterFall2.next();
		}); ;
	}

	function step2() {
		System.menu.moveTo({
			"left" : width - 100 + "px",
			"top" : height - 90 + "px"
		}, function () {
			waterFall2.next();
		});
	}

	waterFall2.regist([step1, step2], function () {
		System.menu.run(function () {
			System.emit("buttonsRightBottom");
		});
	})
	waterFall2.fire();
});

//当导航栏到位
System.on("buttonsRightBottom", function () {
		$(".playercontainer").fadeIn(1000);	 
		
		$("#createCassette").on("click",function(){
			System.emit("createCassette");
		});
		$("#switchCassette").on("click",function(){
			System.emit("switchCassette");
		});
		System.player=new MusicPlayer();
});
System.on("newUser",function(){
	$(".Login_container").hide();
	
	var v=System.getReadyVersion();
	var obj=[{"name":"regist.js"},{"name":"zhuce.css"}];
	System.install(obj,v).on("ready",v,function(){
		System.post({"frame":"zhuce"},"/Frame",function(json){
			if(json.message=="success")
			{
				System.setKey("zhuce",json.frame);
				System.emit("LoadZhuceOk");
			}else
			{
				System.emit("message",json);
			}
		});
	});
	
	System.on("LoadZhuceOk",function(){
		var zhuce=$(System.getKey("zhuce"));
		$("body").append(zhuce);
		 LoadRegistEvent();
	});
});

System.on("createCassette",function(){
	System.on("prepareCassetteFrameOk",function(){
		var $edit=$(System.getKey("cassetteEdit"));
		$("body").append($edit);
		$edit.show(400,function(){
			 loadEditCasseteEvent();
		});
	});
	if(System.getKey("cassetteEdit"))
	{
		System.emit("prepareCassetteFrameOk");
	}else
	{
		var v3=System.getReadyVersion();
		
		System.install("cassetteEdit.js",v3);
		System.install("cassetteEdit.css",v3);
		System.on("ready",v3,function(){
			System.post({"frame":"cassetteEdit"},"/Frame",function(json){
				if(json.message!="success")
				{
					System.emit("message",json);
				}else
				{
					System.setKey("cassetteEdit",json.frame);
					System.emit("prepareCassetteFrameOk");
				}
			});
		});
	}
});