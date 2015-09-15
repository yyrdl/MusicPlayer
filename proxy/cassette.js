var model=require("../models");
var Cassette=model.Cassette;
 
exports.getCassettesWithFullArguments=function(query,fields,option,callback)
{
	Cassette.find(query,fields,option,callback);
};

exports.newAndSave=function(cassetteInfo,callback){
	var newCassette=new Cassette();
	newCassette.name=cassetteInfo.name;
	newCassette.author=cassetteInfo.author;
	newCassette.author_ID=cassetteInfo.authorId;
	newCassette.content=cassetteInfo.content;
	newCassette.sideA=cassetteInfo.sideA;
	newCassette.sideB=cassetteInfo.sideB;
	newCassette.save(callback);
//	console.log("new cassette id:"+newCassette._id);
};