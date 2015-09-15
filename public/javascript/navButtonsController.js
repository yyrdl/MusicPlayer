
function MenuController(cb) {
	this.init(cb);
	this.config = {
		"FrameName" : "NavButtons",
		"js" : ["navButtonsController.js", "jquery-1.8.3.min.js", "jquery.transform2d.js"],
		"css" : "navButtonsController.css"
	};
};
MenuController.prototype = {
	init : function (cb) {
		this.Status = 0;
		this.angle = Math.PI / 8.5;
		this.Radius = 110; //小图出来的半径
		this.Offset = 80; //小图出来后的偏移量
		this.Model = 4; //出现方式，1：左上，2:左下，3：右上，4：右下
		this.OutSpeed = 80; //小图出现的速度
		this.OutIncr = 50; //小图出来的旋转
		this.OffsetSpeed = 200; //小图出来的旋转速度
		this.InSpeed = 480; //小图进去的速度
		this.InIncr = -80; //小图进去的旋转
		this.Menu = $("#Menu");
		this.subButtons = this.Menu.children(".subButton").slice(0, 6);

		this.loadEvents();
		var self = this;
		setTimeout(function () {
			self.run(cb);
		}, 300);

	},
	run : function (callback) {
		var self = this;
		if (self.Status == 0) {
			var Count = self.subButtons.size();
			self.subButtons.each(function (SP) {
				var ID = $(this).index();

				var X,
				Y,
				X1,
				Y1;

				X = Math.cos(self.angle * (ID - 1)) * self.Radius;
				Y = Math.sin(self.angle * (ID - 1)) * self.Radius;
				X1 = Math.cos(self.angle * (ID - 1)) * (self.Radius + self.Offset);
				Y1 = Math.sin(self.angle * (ID - 1)) * (self.Radius + self.Offset);

				if (self.Model == 2) {
					Y = -Y;
					Y1 = -Y1;
				} else if (self.Model == 3) {
					X = -X;
					Y = -Y;
					X1 = -X1;
					Y1 = -Y1;
				} else if (self.Model == 4) {
					X = -X;
					X1 = -X1;
				}

				$(this).children(".buttonIcon").children(".item").animate({
					"transform" : "rotate(720deg)"
				}, 600);

				$(this).animate({
					left : X1,
					bottom : Y1
				}, self.OutSpeed + SP * self.OutIncr, function () {
					$(this).animate({
						left : X,
						bottom : Y
					}, self.OffsetSpeed,function(){
						if(ID==Count)
						{
							if(callback)
								callback();
						}
					});
				});
			});

			self.Status = 1;
		} else if (self.Status == 1) {

			self.subButtons.each(function (SP) {
				var X1,
				Y1;
				var ID = $(this).index();

				if (self.Model == 4) {
					X1 = -Math.cos(self.angle * (ID - 1)) * (self.Radius + self.Offset);
					Y1 = Math.sin(self.angle * (ID - 1)) * (self.Radius + self.Offset);
				} else {
					if (self.Model == 1) {
						X1 = Math.cos(self.angle * (ID - 1)) * (self.Radius + self.Offset);
						Y1 = Math.sin(self.angle * (ID - 1)) * (self.Radius + self.Offset);
					} else {
						if (self.Model == 2) {
							X1 = Math.cos(self.angle * (ID - 1)) * (self.Radius + self.Offset);
							Y1 = -Math.sin(self.angle * (ID - 1)) * (self.Radius + self.Offset);
						} else {
							X1 = -Math.cos(self.angle * (ID - 1)) * (self.Radius + self.Offset);
							Y1 = -Math.sin(self.angle * (ID - 1)) * (self.Radius + self.Offset);
						}
					}
				}

				$(this).children(".buttonIcon").children(".item").animate({
					"transform" : "rotate(0deg)"
				}, 600);

				$(this).animate({
					left : X1,
					bottom : Y1
				}, self.OffsetSpeed, function () {
					$(this).animate({
						left : 0,
						bottom : 0
					}, self.InSpeed + SP * self.InIncr,function(){
						if(ID==1)
						{
							if(callback)
								callback();
						}
					});

				});

			});

			self.Status = 0;
		}
	},
	moveTo:function(json,cb){
		$(".navButtons").animate(json,300,cb);
	},
	loadEvents : function () {
		var self = this;

		$(".subButton").hover(function () {

			$(this).find(".metaicondetail").show();
		}, function () {

			$(this).find(".metaicondetail").hide();
		});

		$(".mainButton").on("click", function () {

			self.run();
		});

	}
}

