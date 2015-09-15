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
	
	//ϵͳ��,���û���½֮�󣬴�����һ�¼��������������ߵ���Ϣ,�������ѵ��������
	socket.on("online",function(message){
         nickNames[socket.id]=message.name;	 
	});
	
	socket.on("message",function(message){
		//message��ʽ{"from":,"to","content":}
		 socket.broadcast.emit("message",message);
	});
	
	socket.on("disconnect",function(socket){
		var message={"message":"offline","who":nickNames[socket.id]};
		socket.broadcast.emit("system",message);
		delete nickNames[socket.id];
	});
	
};