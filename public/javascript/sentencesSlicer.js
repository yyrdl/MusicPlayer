/**
   作者 :郑杰
   日期：2015/1/24
   备注：大三上学期寒假成都百词斩前端JS测试题
 
**/


//注册redo replay next的三个按钮的显示样式逻辑，最终应该在SentenceManager的init方法内，在开发环境下就这样吧
$(function () {
	$(".redo").on("mouseover", function () {
		$(".redo img").attr({
			"src" : "../images/redo_hover.png"
		});
	})
	$(".redo").on("mouseout", function () {
		$(".redo img").attr({
			"src" : "../images/redo.png"
		});
	})
	$(".replay").on("mouseover", function () {
		$(".replay img").attr({
			"src" : "../images/replay_hover.png"
		});
	})
	$(".replay").on("mouseout", function () {
		$(".replay img").attr({
			"src" : "../images/replay.png"
		});
	})
	$(".next").on("mouseover", function () {
		$(".next img").attr({
			"src" : "../images/next_hover.png"
		});
	})
	$(".next").on("mouseout", function () {
		$(".next img").attr({
			"src" : "../images/next.png"
		});
	})

});

//存放原始短句信息的容器，最终版是没有这个的
var con = [];

//事件池类
function EventPool() {
	this.name = "MY DIY EVENT POOL";
	this.Events = [];
}

EventPool.prototype.on = function (ename, callback) {
	var obj = {
		"name" : ename,
		"callback" : callback
	};
	this.Events.push(obj);
}

EventPool.prototype.emit = function (ename, arg) {
	var self = this;
	var i;
	for (i = 0; i < self.Events.length; i++) {
		if (self.Events[i].name == ename)
			break;
	}
	if (i < self.Events.length) {
		self.Events[i].callback(arg);
	}
}

//短句管理者类

function SentenceManager() {}

SentenceManager.prototype = {
	//初始化
	init : function (children) {
		this.subSentences = children;
		this.$children = [];//存放短句的容器
		this.Lines_Container = [];//存放连线的容器
		this.pMap = [];//短句的位置库
		this.origin_sentence = $(".origin_sentence");
		this.Origin_Sentences = [];
		this.Container = $(".workSpace");
		this.Buttons = $(".buttons");
		this.Redo = $(".redo");
		this.RePlay = $(".replay");
		this.Next = $(".next");
		this.Note = $(".note");
		this.WR_Tag = $(".wr_tag");
		this.score = 0;
		this.error_times = 0;
		this.origin_sentence_cw = 10;
		this.origin_sentence_ch = 535;
		this.currentS = "";
		this.eventPool = new EventPool();//自有事件池
		this.createSubSentence();
		this.dragEvent();
		this.eventsManager();
	},
	//返回被拖动元素覆盖的短句
	getSubSentenceByPosition : function (json) {
		var self = this;
		var result = [];
		for (var i = 0; i < self.pMap.length; i++) {
			if (json.left > self.pMap[i].left + self.pMap[i].width)
				continue;
			if (json.left + json.width < self.pMap[i].left)
				continue;
			if (json.top > self.pMap[i].top + self.pMap[i].height)
				continue;
			if (json.top + json.height < self.pMap[i].top)
				continue;
			result.push(self.pMap[i].id);
		}
		return result;
	},
	//返回指定id的短句
	getSubSentenceById : function (id) {
		var self = this;
		var i;
		for (i = 0; i < self.$children.length; i++) {
			if (id == self.$children[i].id)
				break;
		}
		if (i < self.$children.length)
			return self.$children[i];
		else
			return;
	},
	//检查选择是否正确
	checkSucces : function (arr) {
		var self = this;
		var result = false;
		for (var i = 0; i < arr.length; i++) {
			var j = 0;
			for (; j < self.currentS.parent.length; j++) {
				if (arr[i] == self.currentS.parent[j])
					break;
			}
			if (j < self.currentS.parent.length) {
				result = true;
				break;
			}
		}
		return result;
	},
	//根据所给的句子信息创建短句
	createSubSentence : function () {
		var self = this;
		for (var i = 0; i < self.subSentences.length; i++) {
			if (700 - self.origin_sentence_cw < 40) {
				self.origin_sentence_cw = 10;
				self.origin_sentence_ch += 25;
			}
			var sub = $("<div class='subSentence' style='left:" + self.origin_sentence_cw + "px;top:" + self.origin_sentence_ch + "px;'>" + self.subSentences[i].content + "</div>");
			if (self.subSentences[i].note)
				sub.data({
					"note" : self.subSentences[i].note
				});
			self.Container.append(sub);
			self.origin_sentence_cw += parseInt(sub.css("width")) + 8;
			var ar = self.subSentences[i].parent.split(",");
			var arr = new Array();
			for (var j = 0; j < ar.length; j++) {
				arr.push(parseInt(ar[j]));
			}
			arr.sort();
			var ar2 = self.subSentences[i].binglie.split(",");
			var arr2 = new Array();
			for (var j = 0; j < ar2.length; j++) {
				var nu = parseInt(ar2[j]);
				if (nu == 0)
					continue;
				else
					arr2.push(nu);
			}
			arr2.push(parseInt(self.subSentences[i].bianhao));
			arr2.sort();
			var obj = {
				"ele" : sub,
				"id" : parseInt(self.subSentences[i].bianhao),
				"parent" : arr,
				"c_t" : [],
				"c_t_exist" : [],
				"binglie" : arr2
			};
			//c_t存放子节点的类型值，c_t_exist存放已经显示的子节点，binglie存放与该节点并列的同级节点
			self.$children.push(obj);
		}
		for (var i = 1; i < self.$children.length; i++) //统计每个节点的子节点有几种类型
		{
			if (self.$children[i].id == self.$children[i].binglie[0]) {
				for (var j = 0; j < self.$children[i].parent.length; j++) {
					var pp = self.getSubSentenceById(self.$children[i].parent[j]);
					console.log(i + j);
					pp.c_t.push(pp.c_t.length);
				}
			}
		}
		var s0_left = self.$children[0].ele.css("left");
		var s0_top = self.$children[0].ele.css("top");
		self.$children[0].ele.css({
			"left" : "40px",
			"top" : "250px",
			"border" : "2px solid blue"
		});
		var ob = {
			"id" : 1,
			"width" : parseInt(self.$children[0].ele.css("width")),
			"height" : parseInt(self.$children[0].ele.css("height")),
			"left" : 40,
			"top" : 250
		}
		//更新地图
		self.pMap.push(ob);
		self.$children[0].ele.on("mouseover", [self.$children[0].id], function (e) {
			var target = self.getSubSentenceById(e.data);
			var note = target.ele.data("note");
			self.Note.html(note);
			var n_top = parseInt(target.ele.css("top"));
			var n_width = parseInt(target.ele.css("width"));
			var n_left = parseInt(target.ele.css("left"));
			var n_style = {
				"top" : n_top - 20 + "px",
				"left" : n_left + 10 + "px",
			}
			self.Note.css(n_style);
			self.Note.slideDown();
		});
		self.$children[0].ele.on("mouseout", function () {
			self.Note.slideUp();
		});
		var an = $("<div class='subSentence2' style='left:" + s0_left + ";top:" + s0_top + "'>" + self.subSentences[0].content + "</div>");
		self.Container.append(an);
		self.Origin_Sentences.push(an);
		if (self.$children[1]) {
			self.currentS = self.$children[1];
			self.currentS.ele.css({
				"background-color" : "skyblue",
				"color" : "white",
				"cursor" : "pointer"
			});
		} else
			console.log(self.$children.length);
	},
	// 拖动逻辑
	dragEvent : function () {
		var self = this;
		self.currentS.ele.on("mousedown", function (e) {
			var o_x = self.currentS.ele.css("left");
			var o_y = self.currentS.ele.css("top");
			var width = parseInt(self.currentS.ele.css("width"));
			var height = parseInt(self.currentS.ele.css("height"));
			var coverS = [];
			var e_ox = e.clientX;
			var e_oy = e.clientY;
			var cstyle = {
				"background-color" : "skyblue",
				"color" : "white",
			};
			var style2 = {
				"background" : "transparent",
				"color" : "black",
			};
			self.currentS.ele.css(style2);
			self.currentS.ele.css({"border":"2px solid blue"});
			//鼠标移动处理逻辑
			function moveHandler(e) {
				e.preventDefault();
				var x = e.clientX;
				var y = e.clientY;
				var x_iterator = x - e_ox;
				var y_iterator = y - e_oy;
				var o_left = parseInt(self.currentS.ele.css("left"));
				var o_top = parseInt(self.currentS.ele.css("top"));
				var left = o_left + x_iterator;
				var top = o_top + y_iterator;
				if (left < 0)
					left = 0;
				if (left + width > 850)
					left = 850 - width - 5;
				if (top < 40)
					top = 40;
				if (top + height > 600)
					top = 600-height-10;
				self.currentS.ele.css({
					"left" : left + "px",
					"top" : top + "px"
				});
				e_ox = x;
				e_oy = y;
				var json = {
					"left" : left,
					"top" : top,
					"width" : width,
					"height" : height
				};
				var covered = self.getSubSentenceByPosition(json);
				for (var i = 0; i < coverS.length; i++) {
					var target=self.getSubSentenceById(coverS[i]).ele;
					 target.css(style2);
					 target.css({"background-color":target.data("o_bc")});
				}
				if (covered.length > 0) {
					for (var i = 0; i < covered.length; i++) {
						 var tar=self.getSubSentenceById(covered[i]).ele;
						 tar.data({"o_bc":tar.css("background-color")});
						tar.css(cstyle);
					}
					coverS = covered;
				} else {}
			}
			//鼠标抬起处理逻辑
			function upHandler(e) {
				if (e)
					e.preventDefault();
				var top = parseInt(self.currentS.ele.css("top"));
				var left = parseInt(self.currentS.ele.css("left"));
				var json = {
					"left" : left,
					"top" : top,
					"width" : width,
					"height" : height
				};
				if (coverS) {
					for (var i = 0; i < coverS.length; i++) {
						var tar=self.getSubSentenceById(coverS[i]).ele;
						tar.css(style2);
						if(tar.data("o_bc"))
						tar.css({"background-color":tar.data("o_bc")});
					}
				}
				var covered = self.getSubSentenceByPosition(json);
				var res = self.checkSucces(covered);
				var style = {
					"left" : o_x,
					"top" : o_y,
					"border":"",
					"background-color":"skyblue",
					"color":"white"
				};
				if (res) {
					var nr = "";
					for (var i = 0; i < self.subSentences.length; i++) {
						if (parseInt(self.subSentences[i].bianhao) == self.currentS.id) {
							nr = self.subSentences[i].content;
							break;
						}
					}
					var an = $("<div class='subSentence2' style='left:" + o_x + ";top:" + o_y + "'>" + nr + "</div>");
					self.Container.append(an);
					self.Origin_Sentences.push(an);
					self.eventPool.emit("succes");
				} else {
					self.currentS.ele.css(style);
					if (covered.length > 0)
						self.eventPool.emit("error");
				}
				$(window).off("mousemove", moveHandler);
				$(window).off("mouseup", upHandler);
			}
			$(window).on("mousemove", moveHandler);
			$(window).on("mouseup", upHandler);
		});
	},
	//注册自有事件处理逻辑
	eventsManager : function () {
		var self = this;
		//选择正确事件处理
		self.eventPool.on("succes", function () {
			var pi = self.currentS.parent[0];
			var parent = self.getSubSentenceById(pi);
			var left = parseInt(parent.ele.css("left"));
			var top = parseInt(parent.ele.css("top"));
			var width = parseInt(parent.ele.css("width"));
			var style = {};
			 
			 //得到该新节点在workSpace的位置
			if (parent.c_t.length > 1) {
				if (parent.c_t_exist.length > 0) {
					if (self.currentS.id == self.currentS.binglie[0]) {
						style = {
							"left" : left + width + 20 + "px",
							"top" : top + "px",
							"background-color" : "white",
							"color" : "black",
							"border" : "2px solid blue"
						}
						if (0 == self.currentS.binglie.length - 1) {
							parent.c_t_exist.push(parent.c_t[parent.c_t_exist.length]);
						}
					} else {
						var i;
						for (i = 0; i < self.currentS.binglie.length; i++) {
							if (self.currentS.binglie[i] == self.currentS.id) {
								break;
							}
						}
						if (i == self.currentS.binglie.length - 1) {
							parent.c_t_exist.push(parent.c_t[parent.c_t_exist.length]);
						}
						var fsibling = self.getSubSentenceById(self.currentS.binglie[i - 1]);
						left = parseInt(fsibling.ele.css("left"));
						top = parseInt(fsibling.ele.css("top"));
						width = parseInt(fsibling.ele.css("width"));
						height = parseInt(fsibling.ele.css("height"));
						style = {
							"left" : left + (width + 10) / 4 + "px",
							"top" : top + height + 30 + "px",
							"background-color" : "white",
							"color" : "black",
							"border" : "2px solid blue"
						}
					}
				} else {
					if (self.currentS.id == self.currentS.binglie[0]) {
						style = {
							"left" : left + (width + 10) / 4 * 3 + "px",
							"top" : top - parseInt(self.currentS.ele.css("height")) - 30 + "px",
							"background-color" : "white",
							"color" : "black",
							"border" : "2px solid blue"
						}
						if (0 == self.currentS.binglie.length - 1) {
							parent.c_t_exist.push(parent.c_t[parent.c_t_exist.length]);
						}
					} else {
						var i;
						for (i = 0; i < self.currentS.binglie.length; i++) {
							if (self.currentS.binglie[i] == self.currentS.id) {
								break;
							}
						}
						if (i == self.currentS.binglie.length - 1) {
							parent.c_t_exist.push(parent.c_t[0]);
						}
						var fsibling = self.getSubSentenceById(self.currentS.binglie[i - 1]);
						left = parseInt(fsibling.ele.css("left"));
						top = parseInt(fsibling.ele.css("top"));
						width = parseInt(fsibling.ele.css("width"));
						height = parseInt(fsibling.ele.css("height"));
						style = {
							"left" : left + (width + 10) / 4 + "px",
							"top" : top - parseInt(self.currentS.ele.css("height")) - 30 + "px",
							"background-color" : "white",
							"color" : "black",
							"border" : "2px solid blue"
						}
					}
				}
			} else {
				if (self.currentS.id == self.currentS.binglie[0]) {
					style = {
						"left" : left + width + 20 + "px",
						"top" : top + "px",
						"background-color" : "white",
						"color" : "black",
						"border" : "2px solid blue"
					}
					if (0 == self.currentS.binglie.length - 1) {
						parent.c_t_exist.push(parent.c_t[parent.c_t_exist.length]);
					}
				} else {
					var i;
					for (i = 0; i < self.currentS.binglie.length; i++) {
						if (self.currentS.binglie[i] == self.currentS.id) {
							break;
						}
					}
					var fsibling = self.getSubSentenceById(self.currentS.binglie[i - 1]);
					left = parseInt(fsibling.ele.css("left"));
					top = parseInt(fsibling.ele.css("top"));
					width = parseInt(fsibling.ele.css("width"));
					height = parseInt(fsibling.ele.css("height"));
					style = {
						"left" : left + (width + 10) / 4 + "px",
						"top" : top + height + 30 + "px",
						"background-color" : "white",
						"color" : "black",
						"border" : "2px solid blue"
					}
				}
			}

			self.currentS.ele.css(style);

			var obj = {
				"id" : self.currentS.id,
				"width" : parseInt(self.currentS.ele.css("width")),
				"height" : parseInt(self.currentS.ele.css("height")),
				"left" : parseInt(self.currentS.ele.css("left")),
				"top" : parseInt(self.currentS.ele.css("top"))
			}
			
			//更新地图
			self.pMap.push(obj);
			
			//注册显示注释的相关处理
			self.currentS.ele.off("mousedown");
			self.currentS.ele.on("mouseover", [self.currentS.id], function (e) {
				var target = self.getSubSentenceById(e.data);
				var note = target.ele.data("note");
				self.Note.html(note);
				var n_top = parseInt(target.ele.css("top"));
				var n_width = parseInt(target.ele.css("width"));
				var n_left = parseInt(target.ele.css("left"));
				var n_style = {
					"top" : n_top - 20 + "px",
					"left" : n_left + 10 + "px",
				}
				self.Note.css(n_style);
				self.Note.slideDown();
			});
			
			self.currentS.ele.on("mouseout", function () {
				self.Note.slideUp();
			});
		
            //得到将添加连线的目标节点
			
			var lines_target = [];
			if (self.currentS.id == self.currentS.binglie[0]) {
				lines_target.push(self.currentS.parent[0]);
			} else {
				for (var i = 0; i < self.currentS.binglie.length; i++) {
					if (self.currentS.binglie[i] == self.currentS.id) {
						lines_target.push(self.currentS.binglie[i - 1]);
						break;
					}
				}
			}
			for (var i = 1; i < self.currentS.parent.length; i++)
				lines_target.push(self.currentS.parent[i]);
			//添加连线
			
			self.addLines(obj, lines_target);
			
				//显示正确
			self.WR_Tag.attr({
				"src" : "../images/right.png"
			});
			self.WR_Tag.show(500);
			//1000毫秒之后结束显示
			setTimeout(function () {
				self.WR_Tag.hide(200);
			}, 1000);
			//更新分数和错误次数
			self.score++;
			self.eventPool.emit("showGrade");
			self.error_times=0;
			if (self.currentS.id < self.$children.length) {
				self.currentS = self.$children[self.currentS.id];
				self.currentS.ele.css({
					"background-color" : "skyblue",
					"color" : "white",
					"cursor" : "pointer"
				});
				self.dragEvent();
			} else {
				setTimeout(function () {
					self.eventPool.emit("complete");
				}, 2000);
			}
		});
		
		//选择错误处理逻辑
		
		self.eventPool.on("error", function () {
			if(self.error_times<3)
			{
				self.score--;
			    self.error_times++;
				self.eventPool.emit("showGrade");
			}
			if (self.error_times > 1) {
				//提示正确答案
				self.show_right_answer();
			}
			self.WR_Tag.attr({
				"src" : "../images/wrong.png"
			});
			self.WR_Tag.show(500);
			setTimeout(function () {
				self.WR_Tag.hide(200);
			}, 1000);
		});
		
		//注册正确完成处理逻辑
		
		
		self.eventPool.on("complete", function () {
			self.Buttons.show();
			self.play(true);
		});
		
		//注册显示分数处理事件
		self.eventPool.on("showGrade",function(){
			
		});
		//.注册Redo ,RePlay ,Next的处理逻辑
		self.Redo.on("click", function () {
			self.redo();
		});
		
		self.RePlay.on("click", function () {
			self.rePlay();
		});
		
		self.Next.on("click", function () {
			self.next();
		});
        
	},
	
	//添加连线，通过分析俩节点的位置信息确定连线的位置及宽带和高度
	addLines : function (obj, lines_target) {
		var self = this;
		var line1_width = 0;
		var line1_height = 0;
		var line1_left = 0;
		var line1_top = 0;
		var line2_width = 0;
		var line2_height = 0;
		var line2_left = 0;
		var line2_top = 0;
		for (var i = 0; i < lines_target.length; i++) {
			line1_width = 0;
			line1_height = 0;
			line1_left = 0;
			line1_top = 0;
			line2_width = 0;
			line2_height = 0;
			line2_left = 0;
			line2_top = 0;
			var parent = self.getSubSentenceById(lines_target[i]);
			var top = parseInt(parent.ele.css("top"));
			var left = parseInt(parent.ele.css("left"));
			var width = parseInt(parent.ele.css("width"));
			var height = parseInt(parent.ele.css("height"));
			if (Math.abs(obj.top - top) < 5) {
				console.log("ssss1");
				line1_left = left + width + 10; //10是border 和padding
				line1_top = top + height / 2;
				line1_height = 3;
				line1_width = obj.left - line1_left;
				var str1 = "<div class='lines' style='left:" + line1_left + "px;top:" + line1_top + "px;width:" + line1_width + "px;height:" + line1_height + "px;'>&nbsp;</div>";
				var line = $(str1);
				self.Container.append(line);
				self.Lines_Container.push(line);
				continue;
			}
			if (obj.left < left + width / 2) {
				if (obj.top > top) {
					console.log("sss2");
					line1_top = top + height + 10;
					line1_left = left + 10;
					line1_width = 3;
					line1_height = obj.top + obj.height / 2 - line1_top;
					line2_top = obj.top + obj.height / 2;
					line2_left = line1_left;
					line2_height = 3;
					line2_width = obj.left - line2_left;
				} else {
					console.log("ss3");
					line1_top = obj.top + obj.height / 2;
					line1_left = left + 10;
					line1_height = top - line1_top;
					line1_width = 3;
					line2_top = line1_top;
					line2_left = line1_left;
					line2_width = obj.left - line2_left;
					line2_height = 3;
				}
			} else {
				if (obj.top > top) {
					console.log("sss4");
					if (obj.left > left + width)
						line1_left = left + width - 20;
					else
						line1_left = left + width - (left + width - obj.left) / 2;
					line1_top = top + height + 8;
					if (line1_left < obj.left) {

						line2_left = line1_left;
						line2_top = obj.top + obj.height / 2;
						line2_height = 3;
						line2_width = obj.left - line2_left;
						line1_height = obj.top + obj.height / 2 - line1_top;
					} else {
						line1_height = obj.top - line1_top;
					}
					line1_width = 3;
				} else {
					console.log("sss5");
					if (obj.left > left + width)
						line1_left = left + width - 20;
					else
						line1_left = left + width - (left + width - obj.left) / 2;
					line1_width = 3;
					if (line1_left < obj.left) {
						line1_top = obj.top + obj.height / 2;
						line2_left = line1_left;
						line2_top = obj.top + obj.height / 2;
						line2_height = 3;
						line2_width = obj.left - line2_left;
					} else {
						line1_top = obj.top + obj.height + 8;
					}
					line1_height = top - line1_top;
				}

			}
			var str = "<div class='lines' style='left:" + line1_left + "px;top:" + line1_top + "px;width:" + line1_width + "px;height:" + line1_height + "px;'>&nbsp;</div>";
			var line1 = $(str);
			self.Container.append(line1);
			self.Lines_Container.push(line1);
			if (line2_height != 0) {
				var line2 = $("<div class='lines' style='width:" + line2_width + "px;height:" + line2_height + "px;left:" + line2_left + "px;top:" + line2_top + "px;'></div>");
				self.Container.append(line2);
				self.Lines_Container.push(line2);
			}
		}
	},
	//重新做
	redo : function () {
		var self = this;
		for (var i = 0; i < self.$children.length; i++)
			self.$children[i].ele.remove();
		self.$children.length = 0;
		for (var i = 0; i < self.Origin_Sentences.length; i++)
			self.Origin_Sentences[i].remove();
		self.Origin_Sentences.length = 0;
		for (var i = 0; i < self.Lines_Container.length; i++)
			self.Lines_Container[i].remove();
		self.Lines_Container.length = 0;
		self.score = 0;
		self.error_times = 0;
		self.pMap.length = 0;
		self.origin_sentence_cw = 10;
		self.origin_sentence_ch = 535;
		self.currentS = "";
		self.createSubSentence();
		self.dragEvent();
		self.Buttons.hide();
	},
	
	//重播
	
	rePlay : function () {
		this.play(true);
	},
	
	//下一个题
	next : function () {},
	//选择正确之后播放相应的音频，和相应的显示信息，由于没有音频，所以没写
	play : function (whole, soundId) {//当whole为false时，则要求第二个参数（要播放的音频的id）,主要点是：audio元素的onended事件，递归
	    var self=this;
		var style1={
			"background-color":"#FC0"
		};
		var  origin_bc="";
		//由于没有音频文件，使用setTimeout模拟
	    function  playAudio(id){
			 if(id>self.$children.length)
				 return ;
			 origin_bc=self.getSubSentenceById(id).ele.css("background-color");
			 self.getSubSentenceById(id).ele.css(style1);
			 setTimeout(function(){
				 self.getSubSentenceById(id).ele.css({"background-color":origin_bc});
				 playAudio(id+1);
			 },2000);
		}
		if (whole) //播放全部
		{
			playAudio(1);
		}
		else {
			
		}
	},
	//提示正确答案
	show_right_answer:function(){
		var self=this;
		for(var i=0;i<self.currentS.parent.length;i++)
		{
			var parent=self.getSubSentenceById(self.currentS.parent[i]);
			parent.ele.css({"background-color":"#3C6"});
		}
	}

}

function initSentence() {
	$(".sentenceManager").show();
}
function addSubsentence() {
	var parent = $("#subContainer");
	var neirong = $("#juzi").get(0).value;
	var bianhao = $("#bianhao").get(0).value;
	var parentnode = $("#parent").get(0).value;
	var binglie = $("#binglie").get(0).value;
	var note = $("#note_c").get(0).value;
	var obj = {
		"content" : neirong,
		"bianhao" : bianhao,
		"parent" : parentnode,
		"binglie" : binglie,
		"note" : note
	};
	con.push(obj);
	var nn = "<div>&nbsp;&nbsp;&nbsp;编号：" + bianhao + "&nbsp;&nbsp&nbsp;父节点:" + parentnode + "&nbsp;&nbsp&nbsp;并列节点:" + binglie + "&nbsp;&nbsp&nbsp;注释:" + note + "&nbsp&nbsp;内容：<div class='subSentence'>" + neirong + "</div></div>";
	var tt = $(nn);
	parent.append(tt);
	$("#juzi").get(0).value = "";
	$("#bianhao").get(0).value = parseInt(bianhao) + 1;
	$("#parent").get(0).value = "";
	$("#binglie").get(0).value = "";
	$("#note_c").get(0).value = "";
}
function initS() {
	var obj1 = {
		"content" : "Leaves,",
		"bianhao" : "1",
		"parent" : "0",
		"binglie" : "0",
		"note" : "树叶"
	};
	var obj2 = {
		"content" : "usually board and flat,",
		"bianhao" : "2",
		"parent" : "1",
		"binglie" : "0",
		"note" : "形容词后置，扁而宽的树叶"
	};
	var obj3 = {
		"content" : "take in energy from sunlight ",
		"bianhao" : "3",
		"parent" : "1",
		"binglie" : "4",
		"note" : "谓语，吸收能量"
	};
	var obj4 = {
		"content" : "and carbon dioxide from air ",
		"bianhao" : "4",
		"parent" : "1",
		"binglie" : "3",
		"note" : "并列结构，吸收二氧化碳"
	};
	var obj5 = {
		"content" : "to survive.",
		"bianhao" : "5",
		"parent" : "3,4",
		"binglie" : "0",
		"note" : "表目的，以生存"
	};
	con.push(obj1);
	con.push(obj2);
	con.push(obj3);
	con.push(obj4);
	con.push(obj5);
	endAdd();
}
function endAdd() {
	$(".sentenceManager").hide();
	var obj = new SentenceManager();
	obj.init(con);
}


