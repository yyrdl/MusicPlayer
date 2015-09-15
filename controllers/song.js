var Song=require("../proxy").Song;

exports.newSong=function(req,res,next){
	var songInfo={};
	songInfo.name=req.body.name;
	songInfo.author=req.body.author;
	songInfo.url=req.body.url;
	songInfo.content=req.body.content||"";
	function cb(err,doc){
		if(err)
		{
			res.json({"message":"Error"});
		}else
		{
			res.json({"message":"Success","song":doc});
		}
	};
	Song.newAndSave(songInfo,cb);	
};
