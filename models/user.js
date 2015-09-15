var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var objectId=Schema.ObjectId;

var UserSchema=new Schema({
	 name:{type:String},//登陆名
	 password:{type:String},//密码
	 email:{type:String},//邮箱地址
	 //peronal_page:{type:String},//个人主页地址
	 head_portrait:{type:String},//头像获取地址
	 sex:String,//性别
	 age:Number,//年龄
	 birthday:String,//生日
	 collect_cassette_count:{type:Number,default:0},//收藏的音乐盒数量
	 friends_count:{type:Number,default:0},//朋友的数量
	 countOfat:{type:Number,default:0},//被@的数量
	 at:[{"topicId":objectId}],//与之相关的文章，限制为100
	 unDealedMessage:{type:Number,default:0},//未处理的信息数量
	 friendsGroup:[{"groupName":String,"members":[]}]
});

UserSchema.index({age:-1});
UserSchema.index({name:1});

mongoose.model("User",UserSchema);