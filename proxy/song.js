var model=require("../models");
var Song=model.Song;
var util=require("util");
exports.getSongsByName=function(songName,callback){
	Song.find({song_name:songName},callback);
};
exports.getSongsByAthor=function(ath,callback){
	Song.find({author:ath},callback);
};
exports.getSongsById=function(ids,callback){
	Song.find({_id:{$in:ids}},callback);
}
exports.newAndSave=function(songInfo,callback){
	var newSong=new Song();
	newSong.song_name=songInfo.name;
	newSong.author=songInfo.author;
	newSong.url=songInfo.url;
	newSong.content=songInfo.content;
	newSong.save(callback);
	console.log(util.inspect(newSong));
};