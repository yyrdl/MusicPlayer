var http=require("http");
 
 
 function returnSong(songLink, host, res) {
	var opt = {
		"method" : "GET",
		"host" : host,
		"path" : songLink
	};
	var request = http.request(opt);
	request.on("response", function (fb) {
		fb.pipe(res);
	});
	request.end();
};

function returnDetail(data,res){
	 
		var opt = {
			"method" : "GET",
			"host" : "ting.baidu.com",
			"path" : "/data/music/links?songIds=" + data.songID
		};
		var request = http.request(opt);
		request.on("response", function (fb) {
			body = "";
			fb.on("data", function (dt) {
				body += dt;
			});
			fb.on("end", function () {
				res.writeHead(200, {
					"Content-Type" : "application/json"
				});
				res.end(body);
			});
		});
		request.end();
}
function getSongList(data,res)
{
		var date = new Date();
		var opt = {
			"method" : "GET",
			"host" : "tingapi.ting.baidu.com",
			"path" : "/v1/restserver/ting?from=webapp_music&method=baidu.ting.search.catalogSug&format=json&callback=&query=" +encodeURIComponent(data.name) + "&_=" + date.getTime()
		};
		var request = http.request(opt);
		request.on("response", function (fb) {
			body = "";
			fb.on("data", function (dt) {
				body += dt;
			});
			fb.on("end", function () {
				res.writeHead(200, {
					"Content-Type" : "application/json"
				});
				res.end(body.toString("utf8"));
			});
		});
		request.end();
}
exports.getSong=function(req,res,next){
	var st = req.url.split("/");
	var method = st[1];
	if(method=="music")
	{
       var songPath = "/" + st[3] + "/" + st[4] + "/" + st[5] + "/" + st[6];
		var hst = st[2].split("&");
		var host = hst.join(".");
		returnSong(songPath, host, res); 	
	}else{
		next();
	}
}

exports.getDetail=function(req,res,next)
{
	returnDetail(req.body,res);
}
exports.searchSong=function(req,res,next){
	getSongList(req.body,res);
}