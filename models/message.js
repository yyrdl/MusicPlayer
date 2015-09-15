var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var messageSchema=new Schema({
	from:String,
	to:String,
	content:String,
	create_date:{type:Date,default:Date.now},
	isMessageNew:{type:Boolean,default:true}
});
messageSchema.index({create_date:-1});
mongoose.model("Message",messageSchema);