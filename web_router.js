var express=require("express");
var Message=require("./controllers/message");
var Cassette=require("./controllers/cassette");
var Song=require("./controllers/song");
var User=require("./controllers/user");
var Auth=require("./middlewares/auth");
var Frame=require("./controllers/frame");
var Page=require("./controllers/page");
var Sign=require("./controllers/sign");
var Music=require("./middlewares/music");
//var Tool=require("./controllers/tool");

var router=express.Router();

 router.get("/",Frame.index);
 router.get("/test",Auth.userRequired,Frame.test);//测试用
 router.get(/\/music{1}.*/,Auth.userRequired,Music.getSong);
 router.post("/Frame",Frame.common);//回复指定前端框架模块;option:{"frame":frameName};type of frameName is string
 router.post("/songDetail",Auth.userRequired,Music.getDetail);
 router.post("/searchSong",Auth.userRequired,Music.searchSong);
 router.post("/signUp",Sign.newUser);//注册option:{"name":string,"password":string,"sex":string,"age":number,"email":string,"birthday":string};
 router.post("/signOut",Auth.userRequired,Sign.signOut);//登出
 router.post("/signIn",Sign.signIn);//登陆option:{"name":string,"password":string}
 router.post("/getCommonPage",Page.commonPage);//获取在广场显示的Cassette;option:{"pageNum":number}
 router.post("/getUserPage",Auth.userRequired,Page.userPage);//获取用户个人的Cassette;option:{"author":string,"pageNum":number};
 router.post("/newCassette",Auth.userRequired,Cassette.newCassette);//option:{"name":string,"author":string,"content":string};
 router.post("/newMessage",Auth.userRequired,Message.newMessage);//option:{"from":string,"to":string,"content":string}
 router.post("/newSong",Auth.userRequired,Song.newSong);//option:{"name":string,"author":string,"url":string,"content":string};
 router.post("/getUserInfo",Auth.userRequired,User.findUser);//option:{"name":username};type of username is String
 router.post("/getUsersInfo",Auth.userRequired,User.findUsers);//option:{"names":usersname};type of usersname is Array
 router.post("/getMessage",Auth.userRequired,Message.findMessage);//option:{"query":{},"fields":{},"option":{}};
 router.post("/getCassette",Auth.userRequired,Cassette.findCassette);//option:{"query":{},"fields":{},"option":{}};
//router.post("/addStar",Auth.userRequired,Tool.addStar);//option:{"name":string,"_id":objectId};
//router.post("/addComment",Auth.userRequired,Tool.addComment);//option:{"query":{"name":string,"_id":objectId},"content":string}
 //router.post("/addReply",Auth.userRequired,Tool.addReply);//option:{"query":{"name":string,"_id":objectId},"fatherCommentId":Number,"from":string,"to":string,"content":string}
 //router.post("/addCollect",Auth.userRequired,Tool.addCollect);//option:{"cassette_id":string,"name":string}
 //router.post("/addFriend",Auth.userRequired,Tool.addFriend);//option"{"selfName":string,"withWho":string,"message":content}
 //router.post("/deleteFriend",Auth.userRequired,Tool.deleteFriend);//option:{"deleteWho":name}
 //router.post("/editCassette",Auth.userRequired,Tool.editCassette);
 //router.post("/editComment",Auth.userRequired,Tool.editComment);
 //router.post("/upload",Auth.userRequired)
  



module.exports=router;
//模块对外开放的是exports这个对象，
//这里直接将exports弄成router
//如果是exports.User=user,这种形式，则是将将要开放的模块附着在exports