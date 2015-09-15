var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var objectId=Schema.ObjectId;

var collectionSchema=new Schema({
	  owner:String,
	  owner_id:objectId,
	  collections:[{cassette_ID:objectId}]
});

collectionSchema.index({owner:1});

mongoose.model("Collect",collectionSchema);