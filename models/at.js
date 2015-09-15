var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var objectId=mongoose.Types.ObjectId;

var atSchema=new Schema({
	 whose:String,
	 whose_ID:objectId,
	 ats:[{}]
})