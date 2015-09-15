var Cassette=require("../proxy").Cassette;
var pageCache=[];


function resetPageCache(){
	function cb(err,docs)
	{
		if(err)
		{
			
		}else
		{
			pageCache=docs;
		}
	}
	Cassette.getCassettesWithFullArguments(null,null,{limit:10},cb);
	};
setInterval(resetPageCache,10000);
resetPageCache();


exports.commonPage=function(req,res,next){
	var pageNum=parseInt(req.body.pageNum)+1;
	if(pageNum==1&&pageCache)
	{
		res.json({message:"success",pages:pageCache});
	}else
	{
		function cb1(err,docs)
		{
			if(err)
			{
				res.json({message:"Error!",pages:""});
			}else
			{
				res.json({message:"success",pages:docs});
			}
		};
		pageNum--;
	    Cassette.getCassettesWithFullArguments(null,null,{limit:10,skip:10*pageNum,sort:"create_Date"},cb1);
	}
};
exports.userPage=function(req,res,next){
	var name=req.body.author;
	var pageNum=parseInt(req.body.pageNum)-1;
	console.log("name"+name+"  pageNum:"+pageNum);
	function cb2(err,docs)
		{
			if(err)
			{
				res.json({message:"Error!",pages:""});
			}else
			{
				console.log("DOC.length:"+docs.length);
				res.json({message:"success",pages:docs});
			}
		};
		Cassette.getCassettesWithFullArguments({author:name},null,{limit:10,skip:10*pageNum,sort:'-create_Date'},cb2);//sort:"-create_Date"倒序
};