var CommonAudio;
function CommonAudioPlayer() {
	this.audio = document.createElement("audio");
	this.isMoving = false;
	this.audio.onended = function () {
		this.isMoving = false;
	};
}
CommonAudioPlayer.prototype = {
	play : function () {
		this.isMoving = true;
		this.audio.oncanplay = function () {
			this.play();
		};
	},
	pause : function () {
		this.audio.pause();
		this.isMoving = false;
	},
	setCurrentTime : function (time) {
		this.audio.currentTime = time;
	},
	getCurrentTime : function () {
		return this.audio.currentTime;
	},
	clear : function () {
		var self = this;
		if (self.isMoving) {
			self.pause();
			self.isMoving = false;
		}
		if (self.audio.hasAttribute("src"))
			self.audio.removeAttribute("src");
	},
	setSource : function (source) {
		this.audio.setAttribute("src", source);
	}
}
function getSupportedType() {
	var audio = document.createElement("audio");
	if (audio.canPlayType("audio/mpeg"))
		return ".mp3";
	else
		if (audio.canPlayType("audio/ogg"))
			return ".ogg";
		else
			return ".wav";
}
function getScrollOffsets() {
	return {
		x : $(window).scrollLeft(),
		y : $(window).scrollTop()
	};
}
function Song(data) {
	this.name = data.name;
	this.src = data.src;
	this.duration = data.duration;
	this.id = -1;
}
Song.prototype = {
	loadedMetaData : function (callback) {
		var self = this;
		var audio = document.createElement("audio");
		this.audio = audio;
		this.audio.setAttribute("preload", "auto");
		this.audio.setAttribute("src", self.src);
		this.audio.oncanplay = function () {
			this.pause();
			console.log(self.name);
		};
		this.audio.onloadedmetadata = function () {
			if (self.duration) {}
			else {
				self.duration = this.duration;
			}
			if (callback) {
				callback(self);
			}
		};

	},
	getDuration : function () {
		return this.duration;
	},
	getCurrentTime : function () {
		return this.audio.currentTime;
	},
	setCurrentTime : function (time) {
		this.audio.currentTime = time;
	},
	play : function () {
		this.audio.play();
	},
	pause : function () {
		this.audio.pause();
	},
	volume : function (value) {
		this.audio.volume = value;
	}
}
function Sound() {
	if (CommonAudio) {}
	else {
		CommonAudio = new CommonAudioPlayer();
	}
}
Sound.prototype = {
	getSource : function (actionName) {
		return "../public/sounds/" + actionName + getSupportedType();
	},
	play : function (action, loop) {
		var self = this;
		var actionMusic = "";
		switch (action) {
		case "play":
			actionMusic = "click";
			break;
		case "stop":
			actionMusic = "click";
			break;
		case "rewind":
			actionMusic = "rewind";
			break;
		case "forward":
			actionMusic = "fforward";
			break;
		case "switch":
			actionMusic = "switch";
			break;
		default:
			actionMusic = "click";
		}
		CommonAudio.clear();
		CommonAudio.setSource(this.getSource(actionMusic));
		if (loop) {
			CommonAudio.audio.setAttribute("loop", "loop");
		} else {
			if (CommonAudio.audio.hasAttribute("loop"))
				CommonAudio.audio.removeAttribute("loop");
		}
		var dfd = new $.Deferred();
		CommonAudio.play();
		setTimeout(function () {
			dfd.resolve();
		}, 500);
		return dfd.promise();
	},
	pause : function () {
		CommonAudio.pause();
	}
}
function Side(id) {
	this.playlist = [];
	this.id = id;
	this.duration = 0;
	this.timePlayed = 0;
}
Side.prototype = {
	addSong : function (song) {
		song.id = this.playlist.length + 1;
		this.playlist.push(song);
		this.duration += song.getDuration();
	},
	getSongById : function (id) {
		return this.playlist[id];
	},
	getDuration : function () {
		return this.duration;
	},
	setPosition : function (position) {
		this.position = position;
	},
	getPosition : function () {
		return this.position;
	},
	getSongByTime : function (time) {
		var origin = 0;
		var self = this;
		var i;
		for (i = 0; i < self.playlist.length; ++i) {
			origin += self.playlist[i].getDuration();
			if (origin > time || origin == time) {
				break;
			}
		}
		var jd = (origin - time) > 0 ? origin - time : time - origin;
		if (jd < 20) {
			if (self.playlist[i + 1]) {
				self.playlist[i + 1].setCurrentTime(0);
				return self.playlist[i + 1];
			} else {
				return;
			}
		}
		var newtime = self.playlist[i].getDuration() - origin + time;
		self.playlist[i].setCurrentTime(newtime);
		return self.playlist[i];
	}
}
function Cassete(data) {
	this.name = data.name;
	this.content = data.content;
	this.sideADoc = data.sideA;
	this.sideBDoc = data.sideB;
	this.parent = data.parent;
	this.id = data.id;
}
Cassete.prototype = {
	_init : function () {
		var self = this;
		this.isMoving = false;
		this.action = "";
		this.timeIterator = 0;
		this.sideA = new Side(1);
		this.sideB = new Side(2);
		this.timePlayed = 0;
		this.currentSideID = 1;
		this.$loader = $(".vc-loader");
		this.$loader.show();
		this.eventPool = new EventPool();
		this.eventPool.on("createSideOk", function () {
			//console.log("createSideOk");
			self.currentSong = self.sideA.getSongById(0);
			self.$loader.hide();
			self.createPlayer();
			self.parent.eventListener.emit("cassetteOk", self);
		});
		this.createSide();
	},
	createSide : function () {
		var selft = this;
		var waterFall = System.waterFall();
		function loadSideA() {
			var args = [];
			var waterFall6 = System.waterFall();
			for (var i = 0; i < selft.sideADoc.length; i++) {
				var dt = {
					"name" : selft.sideADoc[i].name,
					"src" : selft.sideADoc[i].src,
					"duration" : selft.sideADoc[i].duration
				};
				args.push(dt);
			};
			function cc(Args) {
				function cb(s) {
					Args.n++;
					console.log(s.name + " " + s.duration);
					selft.sideA.addSong(s);
					waterFall6.next(Args);
				}
				var song = new Song(Args.args[Args.n]);
				song.loadedMetaData(cb);
			};

			var funcs = [];
			for (var i = 0; i < args.length; i++) {
				funcs.push(cc);
			}
			waterFall6.regist(funcs, function () {
				waterFall.next();
			});
			var obh = {
				"args" : args,
				"n" : 0
			};
			waterFall6.fire(obh);
		};

		function loadSideB() {
			var args = [];
			var waterFall7 = System.waterFall();
			for (var i = 0; i < selft.sideBDoc.length; i++) {
				var dt = {
					"name" : selft.sideBDoc[i].name,
					"src" : selft.sideBDoc[i].src,
					"duration" : selft.sideBDoc[i].duration
				};
				args.push(dt);
			};
			function cc(Args) {
				var song = new Song(Args.args[Args.n]);
				function cb(s) {
					console.log(s.name + " " + s.duration);
					selft.sideB.addSong(s);
					Args.n++;
					waterFall7.next(Args);
				}
				song.loadedMetaData(cb);
			};

			var funcs = [];
			for (var i = 0; i < args.length; i++) {
				funcs.push(cc);
			}
			waterFall7.regist(funcs, function () {
				waterFall.next();
			});
			var obh = {
				"args" : args,
				"n" : 0
			};
			waterFall7.fire(obh);
		};
		waterFall.regist([loadSideA, loadSideB], function () {
			selft.eventPool.emit("createSideOk");
		});
		waterFall.fire();
	},
	createPlayer : function () {
		this.$Cassete = $(".vc-cassete");
		this.$leftWheel = $("#leftWheel");
		this.$rightWheel = $("#rightWheel");
		this.$sideA = $(".vc-sideA");
		this.$sideB = $(".vc-sideB");
	},
	switchSide : function () {
		var self = this;
		self.action = "switch";
		if (self.isMoving) {
			self.currentSong.pause();
			self.stopWheel();
		}
		if (self.currentSideID == 1) {
			if (self.currentSong)
				self.currentSong.setCurrentTime(0);
			self.sideB.timePlayed = self.sideB.duration - self.sideA.timePlayed * self.sideB.duration / self.sideA.duration;
			self.currentSong = self.sideB.getSongByTime(self.sideB.timePlayed);
			self.$Cassete.css({
				"-webkit-transform" : "rotate3d(0,1,0,180deg)",
				"-ms-transform" : "rotate3d(0,1,0,180deg)",
				"-o-transform" : "rotate3d(0,1,0,180deg)",
				"-mz-transform" : "rotate3d(0,1,0,180deg)",
				"transform" : "rotate3d(0,1,0,180deg)"
			})
			self.currentSideID = 2;
			setTimeout(function () {
				self.$sideA.hide();
				self.$sideB.show();
			}, 200);
		} else {
			if (self.currentSong)
				self.currentSong.setCurrentTime(0);
			self.sideA.timePlayed = self.sideA.duration - self.sideB.timePlayed * self.sideA.duration / self.sideB.duration;
			console.log("sideA.timePlayed:" + self.sideA.timePlayed);
			self.currentSong = self.sideA.getSongByTime(self.sideA.timePlayed);
			self.$Cassete.css({
				"-webkit-transform" : "rotate3d(0,1,0,0deg)",
				"-ms-transform" : "rotate3d(0,1,0,0deg)",
				"-o-transform" : "rotate3d(0,1,0,0deg)",
				"-mz-transform" : "rotate3d(0,1,0,0deg)",
				"transform" : "rotate3d(0,1,0,0deg)"
			})
			self.currentSideID = 1;
			setTimeout(function () {
				self.$sideB.hide();
				self.$sideA.show();
			}, 200);
		}
	},
	play : function () {
		var self = this;
		this.action = "play";
		this.isMoving = true;
		var side;
		side = self.currentSideID == 1 ? self.sideA : self.sideB;
		var song = self.currentSong;
		function play1(s1) {
			if (!s1) {
				side.timePlayed = side.getDuration();
				self.stopWheel();
				self.isMoving = false;
				return;
			}
			self.currentSong = s1;
			if (self.parent)
				s1.volume(self.parent.Volume_deg / 360);
			s1.play();
			s1.audio.onended = function () {
				side.timePlayed += s1.getDuration();
				s1.setCurrentTime(0);
				s1.pause();
				play1(side.getSongById(s1.id));
			};
		};
		if (song) {
			side.timePlayed -= song.getCurrentTime();
			play1(song);
			self.rotateWheel(2, "play");
		} else {
			self.isMoving = false;
		}
	},
	pause : function () {
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.stopWheel();
		var side = this.currentSideID == 1 ? this.sideA : this.sideB;
		if (this.action == "rewind" || this.action == "forward") {
			this.currentSong = side.getSongByTime(side.timePlayed);
		} else {
			if (this.currentSong) {
				this.currentSong.pause();
				side.timePlayed += this.currentSong.getCurrentTime();
			}
		}
		this.isMoving = false;
		this.action = "pause";
	},
	rotateWheel : function (speed, mode) {
		var self = this;
		var animate = "";
		switch (self.currentSideID) {
		case 1:
			if (mode == 'play' || mode == "forward") {
				animate = "rotateRight";
			} else {
				animate = "rotateLeft";
			};
			break;
		case 2:
			if (mode == "play" || mode == "forward") {
				animate = "rotateLeft";
			} else {
				animate = "rotateRight";
			};
			break;
		}
		var animateStyle = {
			"-webkit-animation" : animate + " " + speed + "s linear infinite forwards",
			"-mz-animation" : animate + " " + speed + "s linear infinite forwards",
			"-mo-animation" : animate + " " + speed + "s linear infinite forwards",
			"-ms-animation" : animate + " " + speed + "s linear infinite forwards",
			"animation" : animate + " " + speed + "s linear infinite forwards"
		}
		setTimeout(function () {
			self.$leftWheel.css(animateStyle);
			self.$rightWheel.css(animateStyle);
		}, 0);
		self.timer = setInterval(function () {
				self.updateWheel();
			}, speed * 1000);
	},
	stopWheel : function () {
		var self = this;
		var animateStyle = {
			"-webkit-animation" : "none",
			"-mz-animation" : "none",
			"-mo-animation" : "none",
			"-ms-animation" : "none",
			"animation" : "none"
		};
		self.$leftWheel.css(animateStyle);
		self.$rightWheel.css(animateStyle);
		self.parent.eventListener.emit("end");
	},
	updateWheel : function () {
		var n1 = 0;
		var n2 = 0;
		var self = this;
		if (self.action == "play") {
			if (self.currentSideID == 1) {
				n1 = (self.sideA.timePlayed + self.currentSong.getCurrentTime()) / self.sideA.getDuration() * 70;
				n2 = 70 - n1;
				self.$rightWheel.get(0).style["box-shadow"] = "0  0  0  " + n1 + "px black";
				self.$leftWheel.get(0).style["box-shadow"] = "0  0  0  " + n2 + "px black";
			} else {
				n1 = (self.sideB.timePlayed + self.currentSong.getCurrentTime()) / self.sideB.getDuration() * 70;
				n2 = 70 - n1;
				self.$rightWheel.css({
					"box-shadow" : "0px  0px  0px  " + n2 + "px black"
				});
				self.$leftWheel.get(0).style["box-shadow"] = "0px  0px  0px  " + n1 + "px black";
			}
		} else {
			var side = self.currentSideID == 1 ? self.sideA : self.sideB;
			if (self.action === "forward") {
				side.timePlayed += 5;
				if (side.timePlayed > side.getDuration()) {
					side.timePlayed = side.getDuration();
					self.pause();
				}
			} else {
				side.timePlayed -= 5;
				if (side.timePlayed < 0) {
					side.timePlayed = 0;
					self.pause();
				}
			}
			console.log("timePlayed:"+side.timePlayed);
			n1 = side.timePlayed / side.getDuration() * 70;
			n2 = 70 - n1;
			//console.log("timePlayed:" + side.timePlayed + " duration:" + side.getDuration());
			//console.log("n1:" + n1 + " n2:" + n2);
			if (self.currentSideID == 1) {
				self.$leftWheel.css({
					"box-shadow" : "0px 0px  0px  " + n2 + "px black"
				});
				self.$rightWheel.css({
					"box-shadow" : "0px 0px 0px  " + n1 + "px  black"
				});
			} else {
				self.$rightWheel.css({
					"box-shadow" : "0px  0px 0px  " + n2 + "px  black"
				});
				self.$leftWheel.css({
					"box-shadow" : "0px  0px 0px  " + n1 + "px   black"
				});
			}
		}
	},
	rewind : function () {
		var self = this;
		if (self.isMoving)
			self.pause();
		if (self.currentSong)
			self.currentSong.setCurrentTime(0);
		self.isMoving = true;
		self.action = "rewind";
		self.rotateWheel(0.5, "rewind");
	},
	forward : function () {
		var self = this;
		if (self.isMoving)
			self.pause();
		if (self.currentSong)
			self.currentSong.setCurrentTime(0);
		self.isMoving = true;
		self.action = "forward";
		self.rotateWheel(0.5, "forward");
	}
}
function MusicPlayer() {
	this.name = "MY Old SHCOOL CASSETTE MUSIC  PLAYER";
	this.init();
}
MusicPlayer.prototype = {
	init : function () {
		var self = this;
		this.Cassettes = [];
		this.casseteDocO = [];
		this.casseteDocD = [];
		this.CurrentCassette = "";
		this.CurrentCassetteNum = 0;
		this.sourceLoadedCassette = [];
		this.Volume_deg = 130;
		this.Volume = $(".vc-knob");
		this.Play = $(".vc-play");
		this.Rewind = $(".vc-rewind");
		this.Forward = $(".vc-forward");
		this.Stop = $(".vc-stop");
		this.Switch = $(".vc-switch");
		this.Volume_x = this.Volume.offset().left + 55;
		this.Volume_y = this.Volume.offset().top + 55;
		this.Sound = new Sound();
		this.lastButton = "";
		this.eventListener = new EventPool();
		this.loadEvents();
		this.loadCassetes();
		this.eventListener.on("end", function () {
			self.Sound.pause();
			self.Sound.play("click");
			if (self.lastButton)
				self.unpressed(self.lastButton.get(0));
		});

	},
	loadEvents : function () {
		var self = this;
		self.eventListener.on("loadSrcOk", function (n) {
			console.log("loadSrcOk");
			var cas = new Cassete(self.casseteDocD[n]);
			cas._init();
		});
		self.eventListener.on("cassetteOk", function (cassette) {
			console.log("cassetteOk");
			self.addCassette(cassette);
			if (cassette.id == 0) {
				self.CurrentCassette = cassette;
			}
			self.sourceLoadedCassette.push(cassette.id);
		});
		self.Play.on("click", function () {
			self.C_play();
			self.Sound.play("play");
		});
		self.Rewind.on("click", function () {
			self.C_rewind();
		});
		self.Forward.on("click", function () {
			self.C_forward();
		});
		self.Stop.on("click", function () {
			self.C_stop();
		});
		self.Switch.on("click", function () {
			self.C_switch();
		});
		self.Volume.on("mousedown", function (e) {
			e.preventDefault();
			var e_start_deg = 0;
			var scr = getScrollOffsets();
			var origin_x = e.clientX;
			var origin_y = e.clientY;
			e_start_deg = Math.atan(Math.abs(origin_y - self.Volume_y + scr.y) / Math.abs(origin_x - self.Volume_x + scr.x)) / 3.14 * 180;
			if (origin_x < self.Volume_x - scr.x) {
				if (origin_y > self.Volume_y - scr.y) {
					e_start_deg = 360 - e_start_deg;
				} else {}

			} else {
				if (origin_y < self.Volume_y - scr.y) {
					e_start_deg = 180 - e_start_deg;
				} else {
					e_start_deg += 180;
				}
			}
			self.Volume.on("mousemove", moveHandler);
			self.Volume.on("mouseup", upHandler);
			function moveHandler(e) {
				e.preventDefault();
				var deg_iterator = 0;
				var c_x = e.clientX;
				var c_y = e.clientY;
				var c_deg = Math.atan(Math.abs(c_y - self.Volume_y + scr.y) / Math.abs(c_x - self.Volume_x + scr.x)) / 3.14 * 180;
				if (c_x < self.Volume_x - scr.x) {
					if (c_y > self.Volume_y - scr.y) {
						c_deg = 360 - c_deg;
					} else {}

				} else {
					if (c_y < self.Volume_y - scr.y) {
						c_deg = 180 - c_deg;
					} else {
						c_deg += 180;
					}
				}
				deg_iterator = c_deg - e_start_deg;
				if (Math.abs(deg_iterator) > 90) {
					deg_iterator = 0;
				}
				self.Volume_deg = self.Volume_deg + deg_iterator;
				if (self.Volume_deg > 360)
					self.Volume_deg = 360;
				if (self.Volume_deg < 0)
					self.Volume_deg = 0;
				var rotateStyle = {
					"-webkit-transform" : "rotate(" + self.Volume_deg + "deg)  translateZ(-1px)",
					"-ms-transform" : "rotate(" + self.Volume_deg + "deg)  translateZ(-1px)",
					"-o-transform" : "rotate(" + self.Volume_deg + "deg)  translateZ(-1px)",
					"-mz-transform" : "rotate(" + self.Volume_deg + "deg)  translateZ(-1px)",
					"transform" : "rotate(" + self.Volume_deg + "deg)  translateZ(-1px)"
				}
				self.Volume.css(rotateStyle);
				self.C_volume(self.Volume_deg / 360);
				e_start_deg = c_deg;
			};
			function upHandler(e) {
				e.preventDefault();
				self.Volume.off("mousemove", moveHandler);
				self.Volume.off("mouseup", upHandler);
			}
		});
	},
	C_volume : function (value) {
		var self = this;
		self.CurrentCassette.currentSong.volume(value);
	},
	C_play : function () {
		this.CurrentCassette.play();
		if (this.lastButton)
			this.unpressed(this.lastButton.get(0));
		this.lastButton = this.Play;
		this.pressed(this.lastButton.get(0));
	},
	C_stop : function () {
		this.CurrentCassette.pause();
		this.Sound.play("click");
		if (this.lastButton)
			this.unpressed(this.lastButton.get(0));
		this.lastButton = this.Stop;
		this.pressed(this.lastButton.get(0));
		var self = this;
		setTimeout(function () {
			self.unpressed(self.lastButton.get(0));
		}, 100);
	},
	C_rewind : function () {
		this.CurrentCassette.rewind();
		this.Sound.play("rewind", true);
		if (this.lastButton)
			this.unpressed(this.lastButton.get(0));
		this.lastButton = this.Rewind;
		this.pressed(this.lastButton.get(0));
	},
	C_forward : function () {
		this.CurrentCassette.forward();
		this.Sound.play("forward", true);
		if (this.lastButton)
			this.unpressed(this.lastButton.get(0));
		this.lastButton = this.Forward;
		this.pressed(this.lastButton.get(0));
	},
	C_switch : function () {
		this.CurrentCassette.switchSide();
		this.Sound.play("switch");
		if (this.lastButton)
			this.unpressed(this.lastButton.get(0));
		this.lastButton = this.Switch;
		this.pressed(this.lastButton.get(0));
		var self = this;
		setTimeout(function () {
			self.unpressed(self.lastButton.get(0));
		}, 100);
	},
	SwitchCassette : function (n) {
		var self = this;
		self.C_stop();
		self.CurrentCassetteNum = (self.CurrentCassetteNum + n);
		if (self.CurrentCassetteNum < 0) {
			self.CurrentCassetteNum = self.casseteDocD.length + self.CurrentCassetteNum;
		}
		self.CurrentCassetteNum = self.CurrentCassetteNum % self.casseteDocD.length;
		if (self.Cassetes[self.CurrentCassetteNum]) {
			self.CurrentCassette = self.Cassettes[self.CurrentCassetteNum];
		} else {
			self.eventListener.emit("loadSrcOk", self.CurrentCassetteNum);
		}
	},
	addCassette : function (cassette) {
		this.Cassettes.push(cassette);
	},
	pressed : function (obj) {
		obj.style["background"] = "";
		obj.style["background"] = "url('../public/images/metal_dark.jpg')";
		obj.style["margin-top"] = "2px";
	},
	unpressed : function (obj) {
		obj.style["background"] = "";
		obj.style["background"] = "url('../public/images/metal.jpg')";
		obj.style["margin-top"] = "0px";
	},
	loadCassetes : function () {
		var self = this;
		var query = {
			"author" : System.sessionStorage.getItem("name")
		};
		var fields = {
			"name" : 1,
			"sideA" : 1,
			"sideB" : 1,
			"content" : 1
		};
		var obj = {
			"query" : query,
			"fields" : fields
		};
		//异步获取资源真是麻烦啊！！！！
		var waterFall2 = System.waterFall();
		function cb1() {
			System.post(obj, "/getCassette", function (json) {
				if (json.message == "Success") {
					self.casseteDocO = json.data;
					waterFall2.next();
				} else {
					System.emit("message", {
						"message" : "Failed to load Cassetes!"
					});
				}
			});
		};
		function cb2() {
			var waterFall3 = System.waterFall();
			var cfc = self.casseteDocO.length;

			function pc(Args) {
				var waterFall4 = System.waterFall();
				var cas = Args.args[Args.n];
				var len = cas.sideA.length + cas.sideB.length;
				var count = 0;
				var sideA = [];
				var sideB = [];
				//获取该盒磁带的所有歌曲的src
				function loadSrc(num) {
					var side = num < cas.sideA.length ? cas.sideA : cas.sideB;
					System.post({
						"songID" : side[num % cas.sideA.length].songid
					}, "/songDetail", function (json) {
						var d = json.data.songList[0].songLink.split("/");
						var url = "";
						var stack = [];
						for (var i = 3; i < d.length; i++) {
							stack.push(d[i]);
						}
						url = stack.join("/");
						var host = d[2].split(".");
						host = host.join("&");
						var surl = "music" + "/" + host + "/" + url;
						var st = surl.split("/");
						var finals = [];
						for (var i = 0; i < st.length; i++) {
							if (st[i] !== "") {
								finals.push(st[i]);
							}
						}
						surl = finals.join("/");
						var objj = {
							"name" : side[num % cas.sideA.length].songname,
							"src" : surl,
							"duration" : json.data.songList[0].time
						};
						if (num < cas.sideA.length) {
							sideA.push(objj);
						} else {
							sideB.push(objj);
						}
						waterFall4.next(num + 1);
					});
				};
				var funcs = [];

				for (var i = 0; i < len; i++) {
					funcs.push(loadSrc);
				};

				waterFall4.regist(funcs, function () {
					var obj = {
						"name" : cas.name,
						"content" : cas.content,
						"sideA" : sideA,
						"sideB" : sideB,
						"parent" : self,
						"id" : self.casseteDocD.length
					};
					console.log("cassetteId:" + obj.id);
					self.casseteDocD.push(obj);
					waterFall3.next();
				});
				waterFall4.fire(0);
			};
			var funcss = [];
			for (var i = 0; i < cfc; i++) {
				funcss.push(pc);
			};
			waterFall3.regist(funcss, function () {
				waterFall2.next();
			});

			var au = {
				"args" : self.casseteDocO,
				"n" : 0
			}
			waterFall3.fire(au);
		};
		waterFall2.regist([cb1, cb2], function () {
			self.eventListener.emit("loadSrcOk", 0);
		});
		waterFall2.fire();

	}
}
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
 
