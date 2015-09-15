var model=require("../models");
var Message=model.Message;

exports.newAndSave=function(messageInfo,callback){
	var newMessage=new Message();
	newMessage.from=messageInfo.from;
	newMessage.to=messageInfo.to;
	newMessage.content=messageInfo.content;
	newMessage.save(callback);
	console.log("new message id:"+newMessage._id);
};
exports.getMessageByFrom=function(name,callback){
	Message.find({from:name},callback);
};
exports.getMessageByTo=function(name,callback){
	Message.find({to:name},callback);
};
exports.getMessagesWithFullArguments=function(query,fields,option,callback){
	Message.find(query,fields,option,callback);
};