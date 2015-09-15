var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var objectId=Schema.ObjectId;

var cassetteSchema=new Schema({
	author_ID:objectId,
	author:String,
	name:String,
	content:String,//×÷ÕßµÄÃèÊö
	sideA:[{songid:Number,songname:String}],
	sideB:[{songid:Number,songname:String}],
	star:{type:Number,default:0},
	create_Date:{type:Date,default:Date.now},
	beCollected:[{Collector_ID:objectId}],
	num_beCollected:{type:Number,default:0},
	comment_count:{type:Number,default:0},
	cAndRcount:{type:Number,default:0},
	comment:[{commentor:String,content:String,id:Number,date:{type:Date,default:Date.now},subComment:[{from:String,to:String,content:String,date:{type:Date,default:Date.now},id:Number}]}]
});

cassetteSchema.index({create_Date:-1});
cassetteSchema.index({author:1,name:-1});

mongoose.model("Cassette",cassetteSchema);