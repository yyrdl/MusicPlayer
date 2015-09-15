var mongoose=require("mongoose");
var config=require("../config.js");

mongoose.connect(config.db,function(err){
	if(err)
	{
		console.log(err);
		process.exit(1);
	}
})
require("./user");
require("./collect");
require("./song");
require("./message");
require("./cassette");

exports.User=mongoose.model("User");
exports.Collect=mongoose.model("Collect");
exports.Cassette=mongoose.model("Cassette");
exports.Message=mongoose.model("Message");
exports.Song=mongoose.model("Song");