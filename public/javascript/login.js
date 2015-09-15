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
	var Buttons = System.getKey("navButtonsController");
	$("body").append($(Buttons));
	var left = $(".Login_cover").css("left");
	var top = $(".Login_cover").css("top");
	left = parseFloat(left);
	top = parseFloat(top);
	$(".navButtons").css({
		"left" : left + 30 + "px",
		"top" : top + 30 + "px"
	});
	$(".userHeadPortrait").attr("src", System.sessionStorage.getItem("head_portrait"));
	$(".navButtons").hide();
	$(".navButtons").fadeIn(2000, function () {
		$(".Login_cover").remove();
	});
	System.menu = new MenuController(function(){
		setTimeout(function(){
			System.emit("loginOk");
		},800);
	});
	 
		
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
function LoginInto(obj,tag){
	System.post(obj, "/signIn", function (json) {

			if (json.message != "login successfully") {
				System.emit("message", json);
			} else {
				System.emit("message", json);
				for (var p in json) {
					System.sessionStorage.setItem(p, json[p]); //保存用户信息
				}
				var date = new Date();
				System.sessionStorage.setItem("Login_date", date.getTime());
				if(tag==1)
				{
					hideLoginForm(guodu);
				}else
				{
					loadUserInfo();
				}
			}
		});
};
function registLoginEvent() {
	showLoginForm();
	
	$("#Login").on("click", function () {
		var name = $("#username").get(0).value;
		var password = $("#password").get(0).value;
		var obj = {
			"name" : name,
			"password" : password
		};
         LoginInto(obj,1);
	});

	$("#Reset").on("click", function () {
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	});
	
	$("#Login_Regist").on("click",function(){
		System.emit("newUser");
	})
}
