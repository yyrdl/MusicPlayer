
var audioPFS = ""; //试听使用的audio元素
var currentEditSide = 1; //当前正在编辑的面


function editSide(num)
{
	currentEditSide=num;
}

function deleteSong(num){
	var con="";
	if(num==1)
	{
		con=$(".cassetteEdit_sideA input");
	}else
	{
		con=$(".cassetteEdit_sideB input");
	}
	 
	for(var i=0;i<con.length;i++){
			 if(con[i].checked)
			 {
				 con[i].parentNode.remove();
			 }
	} 
}
function CommonAudioPlayer() {
	this.audio = document.createElement("audio");
	this.isMoving = false;
	var self = this;
	this.audio.oncanplay = function () {
		this.play();
		self.isMoving = true;
	};
	this.audio.onended = function () {
		self.isMoving = false;
	};
}
CommonAudioPlayer.prototype = {
	play : function () {
		if (this.isMoving) {}
		else
			this.audio.play();
	},
	pause : function () {
		if (this.isMoving) {
			this.audio.pause();
			this.isMoving = false;
		}
	},
	setCurrentTime : function (time) {
		if (this.isMoving)
			this.pause();
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
		var self=this;
		if (this.isMoving)
			this.clear();
		this.audio.setAttribute("preload", "auto");
		this.audio.onloadedmetadata = function () {
			console.log("duration:"+self.audio.duration);
		}
		this.audio.setAttribute("src", source);

	}
}
function searchSongs() {
	console.log("ok");
	if (audioPFS) {
		
	}
	else {
		audioPFS = new CommonAudioPlayer();
	}
	var name = document.getElementById("cassetteEdit_searchArea").value;
	System.post({
		"name" : name
	}, "/searchSong", function (json) {
		if (json.song.length == 0) {
			alert("no result!");
		} else {
			var str = "";
			for (var i = 0; i < json.song.length; i++) {
				str += '<li><div class="cassetteEdit_songName">' + json.song[i].songname + '</div><div class="cassetteEdit_artistName">' + json.song[i].artistname + '</div><div class="cassetteEdit_shiting" songID="' + json.song[i].songid + '" name="c_shiting">试&nbsp;听</div><div class="cassetteEdit_add" songID="' + json.song[i].songid + '" name="c_add" songName="'+json.song[i].songname+'">添&nbsp;加</div></li>';
			}
			$(".cassetteEdit_searchResult").html(str);
			setTimeout(initAction(), 1000);
		}
	});
}
function initAction() {
	var con = document.getElementById("cESR");
	var divsShiting = con.getElementsByClassName("cassetteEdit_shiting");
	for (var i = 0; i < divsShiting.length; i++) {
		divsShiting[i].onclick = function () {
			var id = this.getAttribute("songID");
			var obj = {
				"songID" : id
			};
			System.post(obj, "/songDetail", function (data) {
				var d = data.data.songList[0].songLink.split("/");
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
				audioPFS.setSource(surl);
			});
		}
	}
	var divsAdd=con.getElementsByClassName("cassetteEdit_add");
	for(var i=0;i<divsAdd.length;i++)
	{
		divsAdd[i].onclick=function(){
			var songId=this.getAttribute("songID");
			var songName=this.getAttribute("songName");
			var $co="";
			if(currentEditSide==1)
			{
				$co=$(".cassetteEdit_sideA");
			}else
			{
				$co=$(".cassetteEdit_sideB");
			}
			var s1=$('<div songID="'+songId+'" class="cassetteEdit_side" name="'+songName+'"></div>"');
			var s2=$('<span>'+songName+'</span>');
			var s3=$('<input type="radio" status="0" />').on("click",function(){
				 if(this.getAttribute("status")==0)
			   {
				 this.checked=true;
				 this.setAttribute("status",1);
			   }else
			  {
				 this.checked=false;
				 this.setAttribute("status",0);
			  }
			});
			s1.append(s3);
			s1.append(s2);
			$co.append(s1);
		}
	}
} 

var cassetteEdit={
	"name":"",
	"content":"",
	"sideA":[],
	"sideB":[]
};
 function endCassetteEdit(){
	 var sideA=[];
	 var sideAs=$(".cassetteEdit_sideA .cassetteEdit_side");
	 var sideB=[];
	 var sideBs=$(".cassetteEdit_sideB .cassetteEdit_side");
	 for(var i=0;i<sideAs.length;i++)
	 { 
		  var obj={
			  "songid":sideAs[i].getAttribute("songID"),
			  "songname":sideAs[i].getAttribute("name")
		  };
		  sideA.push(obj);
	 }
	 for(var i=0;i<sideBs.length;i++)
	 {
		 var obj={
			 "songid":sideBs[i].getAttribute("songID"),
			 "songname":sideBs[i].getAttribute("name")
		 };
		 sideB.push(obj);
	 }
	 cassetteEdit.sideA=sideA;
	 cassetteEdit.sideB=sideB;
	 cassetteEdit.content=document.getElementById("cassetteEdit_intro").value;
	 System.post(cassetteEdit,"/newCassette",function(json){
		  if(json.message=="Failed")
		  {
			  System.emit("message",{"message":"保存失败"});
		  }else
		  {
			  System.emit("message",{"message":"成功保存!"})
		  }
	  });	 
 }
 function loadEditCasseteEvent()
 {
	 var cancel=document.getElementById("cassetteEdit_headCancel");
	 cancel.onclick=function(){
		  $(".cassetteEdit").remove();
	 };
	 
	 var save=document.getElementById("cassetteEdit_headSave");
	 save.onclick=function(){
		 var al=document.getElementById("cassetteEditAlert");
		 al.style["display"]="block";
		 $("#cassetteEditAlert").animate({"left":"240px"});
		 $("#cassetteEditNameOK").on("click",function(){
			 cassetteEdit.name=document.getElementById("cassetteEditName").value;
			 al.style["display"]="none";
			 endCassetteEdit();
		 });
		 $("#cassetteEditNameGiveUp").on("click",function(){
			 al.style["display"]="none";
			 endCassetteEdit();
		 })
	 }
 }
