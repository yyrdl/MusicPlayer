var model=require("../models");
var Collect=model.Collect;

exports.getCollectByOwner=function(name,callback){
	Collec.find({owner:name},callback);
};