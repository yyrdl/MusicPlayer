
var storage={
	"navButtonsController":{"css":["navButtonsController.css"],"script":["navButtonsController.css","jquery.transform2d.js"]},
	"cassetteEdit":{"css":["cassetteEdit.css"],"script":["cassetteEdit.js"]}
};



exports.getModelInfo=function(modelName){
	return storage[modelName];
};