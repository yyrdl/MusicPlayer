var model=require("../proxy");
var util=require("util");
var Cassette=model.Cassette;

exports.newCassette=function(req,res,next){
	//需要对req.body做处理
	req.body.author=req.session.user.name;
	req.body.authorId=req.session.user._id;
	Cassette.newAndSave(req.body,function(err,doc){
		if(err)
		{
			res.json({"message":"Failed"});
		}else
		{
		    res.json({"message":"Success","data":doc});
		}
	})
};

/**
 向前端开发完整的数据库访问API
**/
exports.findCassette=function(req,res,next){
	var query=req.body.query;
	var fileds=req.body.fields;
	Cassette.getCassettesWithFullArguments(query,fileds,function(err,doc){
		if(err)
		{
			 res.json({"message":"Error"});
		}else
		{
			 res.json({"message":"Success","data":doc});
		}
	})
}