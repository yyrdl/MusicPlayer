var model=require("../models");
var crypto=require("crypto");
var User=model.User;

exports.getUserById=function(id,callback){
	User.find({_id:id},callback);
};
exports.getUserByName=function(userName,callback){
	User.find({name:userName},callback);
};
exports.forLogin=function(userName,option,callback)
{
	User.find({name:userName},option,callback);
}
exports.newAndSave=function(userInfo,callback){
	var newUser= new User();
	var md5=crypto.createHash("md5");
	var pass=md5.update(userInfo.password).digest("hex");
	newUser.name=userInfo.name;
	newUser.password=pass;
	newUser.age=userInfo.age;
	newUser.sex=userInfo.sex;
	newUser.email=userInfo.email;
	newUser.birthday=userInfo.birthday;
	newUser.save(callback);
	console.log("newUser id:"+newUser._id);
};

exports.getUsersByIds=function(ids,callback){
	User.find({_id:{$in:ids}},callback);
};
exports.getUsersByNames=function(names,callback){
	User.find({name:{$in:names}},callback);
};
exports.getUserByEmail=function(userEmail,callback){
	User.find({email:userEmail},callback);
}