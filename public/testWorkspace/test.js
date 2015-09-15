

(function(){
	console.log(document.getElementById("t").innerText);
})();

var version=System.getNewEventVersion("ready");

System.install("test.js",version);
System.install("jquery.1.8.3.min.js",version);
System.install("style1.css",version);
System.install("style2.css",version);

System.on("ready",version,function(){
	
	
	
})