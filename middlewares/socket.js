var socketIo=require("socket.io");
var io;
var currentRoom={};
var nickNames={};

exports.listen=function(server)
{
	io=socketIo.listen(server);
	io.set("log level",1);
	io.sockets.on("connection",function(socket){
		loadEvents(socket);
	})
};

function loadEvents(socket){
	
	//系统级,当用户登陆之后，触发这一事件，发送聊天上线的信息,并检查好友的上线情况
	socket.on("online",function(message){
         nickNames[socket.id]=message.name;	 
	});
	
	socket.on("message",function(message){
		//message格式{"from":,"to","content":}
		 socket.broadcast.emit("message",message);
	});
	
	socket.on("disconnect",function(socket){
		var message={"message":"offline","who":nickNames[socket.id]};
		socket.broadcast.emit("system",message);
		delete nickNames[socket.id];
	});
	
};