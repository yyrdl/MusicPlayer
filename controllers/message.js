var model=require("../proxy");
var util=require("util");
var Message=model.Message;

exports.newMessage=function(req,res,next){
	//console.log("new Message:"+util.inspect(req.body));
	Message.newAndSave(req.body,function(err,doc){
		if(err)
		{
			next(err);
		}else
		{
			var json={"id":doc._id};
			res.end(JSON.stringify(json));
		}
	})
};
exports.findMessage=function(req,res,next){
	console.log("findMessage:"+util.inspect(req.body));
	var query=req.body.query;
	var fields=req.body.fields;
	var option=req.body.option;
	Message.getMessagesWithFullArguments(query,fields,option,function(err,doc){
		if(err)
		{
			next(err);
		}else
		{
			if(typeof(doc)=="String")
			{
				res.end(doc);
			}else
			{
				if(typeof(doc)=="Object")
					res.end(JSON.stringify(doc));
			}
		}
	})
}