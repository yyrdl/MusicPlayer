// JavaScript Document


//.........兼容IE的临时存储.........
function FTBStorage() //定义一个通用的临时性存储方式ForTimeBeingStorge()，集成IE userData和sessionStorge以获得较好的兼容性
{
	this.tag = 0;
	if (window.sessionStorage) {}
	else { //code For IE
		window.onunload = function () {
			var str = document.cookie.split(";");
			for (var i = 0; i < str.length; i++) {
				document.cookie = str[i] + ";expires=" + (new Date(0)).toGMTString();
			}
		}
	}
}
FTBStorage.prototype.setItem = function (name, value) {
	if (window.sessionStorage) {
		window.sessionStorage.setItem(name, value);
	} else {
		document.cookie = name + "=" + value;
	}
}
FTBStorage.prototype.getItem = function (name) {
	if (window.sessionStorage) {
		return window.sessionStorage[name];
	} else {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

		if (arr != null)
			return unescape(arr[2]);
		return null;
	}
}
FTBStorage.prototype.removeItem = function (name) {
	if (window.sessionStorage) {
		window.sessionStorage.removeItem(name);
	} else {
		document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
	}
}
function getStyle(d, p) //对于不同浏览器对一个未定义的css样式的返回结果不一样，chrome和firefox当成0加单位处理，ie当成auto
{
	if (window.getComputedStyle) {
		return getComputedStyle(d, false)[p];
	} else {
		if (isNaN(parseFloat(d.currentStyle[p])))
			return 0;
		else {
			return d.currentStyle[p];
		}
	}
}
