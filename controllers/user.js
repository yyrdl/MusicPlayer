var User=require("../proxy").User;

exports.findUser=function(req,res,next){
	var name=req.body.name;
	function cb(err,doc){
		if(err)
		{
			res.json({"message":"Not Found"});
		}else
		{
			res.json({"message":"Success","userInfo":doc});
		}
	}
	User.getUserByName(name,cb);
};

exports.findUsers=function(req,res,next){
	var names=req.body.names;
	if(names instanceof Array)
	{
		function cb(err,docs){
			if(err){
				res.json({"message":"Error"});
			}else
			{
				res.json({"message":"Success","UsersInfo":doc});
			}
		};
		User.getUsersByNames(names,cb);
	}else
	{
		res.json({"message":"wrong option"});
	}
}