var model = require("../proxy");
var eventProxy=require("eventProxy");
var Cassette = model.Cassette;
var User=model.User;
//var mongoose=require("mongoose");
//var date=mongoose.Schema.Date;
//console.log(new date);

exports.addStar = function (req, res, next) {
	var query = req.body;
	function cb(err, doc) {
		if (err) {
			res.json({
				"message" : "Error"
			});
		} else {
			doc[0].star++;
			doc[0].save(function (err) {
				if (err) {
					res.json({
						"message" : "Save Failed"
					});
				} else {
					res.json({
						"message" : "Success"
					});
				}
			});

		}
	};
	Cassette.getCassettesWithFullArguments(query, null, null, cb);
};

exports.addComment = function (req, res, next) {
	var query = req.body.query;
	var commet = {
		"commenter" : req.session.user.name,
		"content" : req.body.content,
		"id" : 0
	};
	function cb(err, docs) {
		if (err) {
			res.json({
				"message" : "Error"
			});
		} else {
			if (docs[0].comment) {
				comment.id = docs[0].comment.length + 1;
			} else {
				comment.id = 1;
			}
			docs[0].comment.push(comment);
			docs[0].save(function (err) {
				res.json({
					"message" : "Success"
				});
			});
		}
	};

	Cassette.getCassettesWithFullArguments(query, null, null, cb);

};

exports.addReply = function (req, res, next) {
	var query=req.body.query;
	var fId=req.body.fatherCommentId;
	var subComment={
		"from":req.body.from,
		"to":req.body.to,
		"content":req.body.content,
		"id":0
	};
	function cb(err,docs){
		if(err)
		{
			res.json({"message":"Error"});
		}else
		{
			for(var i=0;i<docs[0].comment.length;i++){
				if(fId==docs[0].comment[i].id)
				{
				    if(docs[0].comment[i].subComment)
					{
						subComment.id=docs[0].comment[i].subComment.length+1;
					}else
					{
						subComment.id=1;
					}
					docs[0].comment[i].subComment.push(subComment);
					docs[0].save(function(err){
						if(err)
						{
							res.json({"message":"Error"});
						}else
						{
							res.json({"message":"Success"});
						}
					})
				}
			}
		}
	};
	Cassette.getCassettesWithFullArguments(query,null,null,cb);
};

exports.addCollect=function(req,res,next){
	var query1={"_id":req.body.cassette_id};
	var query2={"name":req.session.user.name,"_id":req.session.user._id};
	var message="";
	var proxy=new eventProxy();
	var events=["cassetteOk"];
	var tag=true;
	proxy.assign(events,function(status1){
		if(status1){
			if(tag){
				User.getUserById(query2._id,function(err,doc){
					if(err)
					{
						message="Error:failed to search the user!";
						res.json({"message":message});
					}else
					{
						doc[0].collect_cassette_count++;
						doc[0].save(function(err){
							if(err)
							{
								message="Error:failed to save the data!";
								res.json({"message":message});
							}else
							{
								message="Success:collect successfully";
								res.json({"message":message});
							}
						});
					}
				});
			}
		}else
		{
			res.json({"message":message});
		}
	});
	Cassette.getCassettesWithFullArguments(query1,{beCollected:1,num_beCollected:1},{limit:1},function(err,doc){
		if(err)
		{
			message="Error:cannot find the Casstte!";
			proxy.emit("cassetteOk",false);
		}else
		{
			for(var i=0;i<doc[0].beCollected.length;i++)
			{
				if(doc[0].beCollected[i].Collector_ID==query2._id)
				{
					tag=false;
					message="You have collected the Cassette:"+req.body.name;
					break;
				}
			}
			if(tag)
			{
			  var obj={"Collector_ID":query2._id};
			  doc[0].beCollected.push(obj);
			  doc[0].num_beCollected++;
			  doc[0].save(function(err){
				  if(err)
				  {
					  message="Error:failed to save data!";
					  proxy.emit("cassetteOk",false);
				  }else
				  {
					  message="Success";
					  proxy.emit("cassetteOk",true);
				  }
			  });
			}else{
				proxy.emit("cassetteOk",false);
			}
		}
	});
};
/**
有一个发送申请和同意的过程,使用socket.io通知对方结果
**/
exports.addFriend=function(req,res,next){
	
};

exports.editCassette=function(req,res,next){
	
};

exports.editComment=function(req,res,next){
	
};