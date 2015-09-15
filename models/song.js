var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var songSchema=new Schema({
	song_name:String,
	songid:Number,
	author:String,//歌唱者
	url:String,//资源地址
	content:String
});

mongoose.model("Song",songSchema);