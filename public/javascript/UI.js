/*
该js文件主要做UI控制
 */
/*
  整个编辑界面组织成一个链表，对每一行都有编号，liHead是链表头，currentLi表示当前的编辑行
*/
var liHead;
var currentLi;

//返回指定ID的元素
function get(id) {
	return document.getElementById(id);
}

//向控制台输出
function say(m) {
	var span = document.createElement("div");
	span.innerHTML = m;
	get("consoleWindow").appendChild(span);
}

// 将参杂html标签的字符序列处理成源代码子符序列
function strPrepare(text) {
	var shtml = text.replace(/<span class="grammer-space"><\/span>/g, " ");
	shtml = shtml.replace(/<\/\w*>/g, "");
	shtml = shtml.replace(/<span class="[\w-]*">/g, "");
	shtml = shtml.replace(/<br>/g, "");
	shtml = shtml.replace(/&gt;/g, ">");
	shtml = shtml.replace(/&lt;/g, "<");
	shtml = shtml.replace(/&amp;/g, "&");
	shtml = shtml.replace(/&nbsp;/g, " ");
	return shtml;
}

//处理键盘事件
function KeyDownHandler(e) {
	// 兼容FF和IE和Opera
	var theEvent = e || window.event;
	var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
	
	if (code === 40) {
		nextLi();
		return false;
	}
	if (code === 38) {
		upLi();
		return false;
	}
	if (code === 8) {
		var text = currentLi.innerText || currentLi.textContent;
		if (text.length === 0 || (currentLi.innerHTML == "<br>")) {
			//删除该li
			deleteLi();
			return false;
		}
	} else {
		if (code == 13) {
			var text = currentLi.innerHTML; //innerText不能很好的处理空格
			var htmlstr = WordAnalyze(strPrepare(text));
			if (htmlstr) {
				currentLi.innerHTML = htmlstr;
			} else {
				currentLi.innerHTML = text;
			}
			append(); //回车默认增加一行
			return false;
		}
	}
	return true;
}

//使上一行获得焦点
function upLi() {
	var p = currentLi;
	if (p.num == 1)
		return;
	var h = liHead;
	while (h.num < p.num - 1) {
		h = h.next;
	}
	h.focus();
}

//使下一行获得焦点
function nextLi() {
	if (currentLi.next) {
		currentLi.next.focus();
	}
}

//删除当前行
function deleteLi() {
	var p = currentLi;
	if (p.num === 1) {
		p = p.next;
		if (liHead.remove) {
			liHead.remove();
		} else {
			liHead.removeNode();
		}
		var t = get("ws");
		var li = document.createElement("li");
		li.contentEditable = true;
		li.focus();
		li.onfocus = function () {
			currentLi = this;
		};
		liHead = li;
		li.num = 1;
		if (p) {
			t.insertBefore(li, p);
		} else {
			t.appendChild(li);
		}
		currentLi = li;
		li.next = p;
		li.focus();
		return;
	}
	var h = liHead;
	for (; ; ) {
		p = p.next;
		if (p) {
			p.num--;
		} else {
			break;
		}
	}
	p = currentLi;
	while (h.num < p.num - 1) {
		h = h.next;
	};
	h.next = p.next;
	if (p.remove) {
		p.remove();
	} else {
		p.removeNode();
	}
	h.focus();
}

//添加新的行
function append() {
	var t = get("ws");
	var li = document.createElement("li");
	li.contentEditable = true;
	li.onfocus = function () {
		currentLi = this;
	};
	var last = currentLi;
	for (; ; ) {
		if (last.next) {
			last = last.next;
			last.num++;
		} else
			break;
	}
	if (currentLi.next) {
		t.insertBefore(li, currentLi.next);
	} else {
		t.appendChild(li);
	}
	li.next = currentLi.next;
	currentLi.next = li;
	li.num = currentLi.num + 1;
	li.focus();
}
function fitConsole() {
	var width = document.body.offsetWidth;
	get("console").style["width"] = width + "px";
}

(function () {
	var t = get("ws");
	var li = document.createElement("li");
	li.contentEditable = true;
	t.appendChild(li);
	li.focus();
	li.onfocus = function () {
		currentLi = this;
	};
	liHead = li;
	li.num = 1;
	currentLi = li;
	
	document.onkeydown = KeyDownHandler;//处理键盘事件
	
	fitConsole();
	
	window.onresize = fitConsole;//使控制台适应窗口变化
	
	get("clearC").onclick = function () {//清空控制台
		get("consoleWindow").innerHTML = "";
	};
	
	get("parseCode").onclick = showWords;//显示词法分析结果
	
	get("chead").onmousedown = function (e) {//控制台UI
		var ev = e || window.event;
		ev.preventDefault();
		if (ev.stopPropagation) {
			ev.stopPropagation();
		} else {

			ev.cancelBubble = true;
		}
		var y = ev.clientY;
		window.onmousemove = function (ee) {
			var evv = ee || window.event;
			evv.preventDefault();
			if (evv.stopPropagation) {
				evv.stopPropagation();
			} else {
				evv.cancelBubble = true;
			}
			var cc1 = get("console");
			var cc2 = get("consoleWindow");
			var height1 = parseInt(cc1.style["height"]);
			var height2 = parseInt(cc2.style["height"]);
			var cy = evv.clientY;
			height1 += y - cy;
			height2 += y - cy;
			if (height2 > 100) {
				cc1.style["height"] = height1 + 'px';
				cc2.style["height"] = height2 + "px";
			}
			y = cy;
			return false;
		}
		
		window.onmouseup = function (ee) {
			var evv = ee || window.event;
			evv.preventDefault();
			if (evv.stopPropagation) {
				evv.stopPropagation();
			} else {
				evv.cancelBubble = true;
			}
			window.onmousemove = "";
		};
		return false;
	}
	
    get("dataS").onclick=showV;//显示数据区创建结果，在grammer.js里
	
	get("runcode").onclick=createDataSection;//创建数据区，在grammer.js里
})();
