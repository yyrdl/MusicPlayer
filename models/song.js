var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var songSchema=new Schema({
	song_name:String,
	songid:Number,
	author:String,//�質��
	url:String,//��Դ��ַ
	content:String
});

mongoose.model("Song",songSchema);