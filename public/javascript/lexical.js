/*
该 js文件负责词法分析
 */

var keyWords = {
	"cin" : true,
	"cout" : true,
	"endl":true,
	"int" : true,
	"float" : true,
	"double" : true,
	"long" : true,
	"bool" : true,
	"true":true,
	"false":true,
	"char" : true,
	"short" : true,
	"void" : true,
	"for" : true,
	"while" : true,
	"if" : true,
	"else" : true,
	"do" : true,
	"class" : true,
	"struct" : true,
	"continue" : true,
	"break" : true,
	"typedef" : true,
	"public" : true,
	"protected" : true,
	"private" : true,
	"friend" : true,
	"virtual" : true,
	"true" : true,
	"false" : true,
	"new" : true,
	"delete" : true,
	"switch" : true,
	"case" : true,
	"default" : true,
	"using":true,
	"namespace":true,
	"return":true
};
var Punctuation = [";", ",", "{", "}", "(", ")", "[", "]"];
var Operator = [{
		"tag" : "*",
		"value" : "*"
	}, {
		"tag" : '-',
		"value" : '-'
	}, {
		"tag" : "--",
		"value" : "--"
	}, {
		"tag" : ">",
		"value" : '&gt;'
	}, {
		"tag" : ">=",
		"value" : "&gt;="
	}, {
		"tag" : "->",
		"value" : "-&gt;"
	}, {
		"tag" : ">>",
		"value" : "&gt;&gt;"
	}, {
		"tag" : "<",
		"value" : '&lt;'
	}, {
		"tag" : "<=",
		"value" : "&lt;="
	}, {
		"tag" : "<<",
		"value" : "&lt;&lt;"
	}, {
		"tag" : ".",
		"value" : '.'
	}, {
		"tag" : "/",
		"value" : "/"
	}, {
		"tag" : "|",
		"value" : "|"
	}, {
		"tag" : "||",
		"value" : "||"
	}, {
		"tag" : "&",
		"value" : '&amp;'
	}, {
		"tag" : "&&",
		"value" : "&amp;&amp;"
	}, {
		"tag" : "+",
		"value" : "+"
	}, {
		"tag" : "++",
		"value" : "++"
	}, {
		"tag" : "?",
		"value" : "?"
	}, {
		"tag" : ":",
		"value" : ":"
	}, {
		"tag" : "::",
		"value" : "::"
	}, {
		"tag" : '%',
		"value" : '%'
	}, {
		"tag" : "=",
		"value" : "="
	}, {
		"tag" : "==",
		"value" : "=="
	}, {
		"tag" : "===",
		"value" : "==="
	}, {
		"tag" : "!",
		"value" : "!"
	}, {
		"tag" : "!=",
		"value" : "!="
	}, {
		"tag" : "!==",
		"value" : "!=="
	},
	{
		"tag":"^",
		"value":"^"
	}
];
var Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
var NumChar = "0123456789.";
var Note = ["//", "/*", "*/"];
var AResult = new List();//链表中存放解析出来的单词

//表示正在解析
var onParse = false;
var cnote=false;//对/**/（多行注释）的特殊处理
function WordAnalyze(str,num) {
	str += " ";
	//console.log(str);
	//console.log("length:"+str.length);
	var temp = "";
	var htmlStr = "";
	//表示处于变量识别或者关键字识别阶段
	var variable = false;
	//表示处于数字常量识别阶段
	var cnum = false;
	//表示处于字符常量识别阶段
	var cchar = false;
	//表示处于字符串常量识别阶段
	var cstring = false;
	//表示处于操作符识别 阶段
	var coperator = false;
	//表示处于head阶段，即#include  define 之类的
	var chead = false;
	//空格
	var spaceK = "";
	//记录小数点的个数，用于判断数字定义时是否有多于一个小数点
	var ccoma=0;
	for (var i = 0; i < str.length; i++) {
		if (onParse) {
			if (chead) {
				if(!num)
				{
					var ttt = str.replace(/</g, "&lt;");
				   ttt = ttt.replace(/>/g, "&gt;");
				    htmlStr = spaceK+"<span class='grammer-head'>" + ttt + "</span>";
				}
				onParse=false;
				break;
			}
			if (variable) {
				if (str[i] === " " || isOperator(str[i]) || isPun(str[i])) {
					if (isKeyWord(temp)) {
						if(num)
						{
							var obj;
							if(temp==="true"||temp==="false")
							{
								obj={"name":temp,"type":5,"row":num};
							}else
                            {
								obj={"name":temp,"type":1,"row":num};
							}								
							AResult.add(obj);
						}else
						{
							htmlStr += spaceK + "<span class='grammer-keyWord'>" + temp + "</span>";
						}
					} else {
						if(num)
						{
							var obj={"name":temp,"type":2,"row":num};
							AResult.add(obj);
						}else
						{
						    htmlStr += spaceK + "<span class='grammer-variable'>" + temp + "</span>";
						}
					}
					spaceK = "";
					temp = "";
					variable = false;
					onParse = false;
					i--;
					continue;
				}
				if (isLetter(str[i]) || isNumber(str[i]))
					temp += str[i];
				else {
					say("Illegal variable definition!");
					break;
				}
				continue;
			}
			if (cnum) {
				if (temp === "0" && isNumber(str[i])&&str[i]!=='.') {
					say("Error: Illegal number definition!");
					break;
				}
				if(ccoma>1)
				{
					 say("Error: Illegal number definition!");
					 break;
				}
				if (isPun(str[i]) || str[i] === " " || (isOperator(str[i]))&&str[i]!=".") {
					if(temp[temp.length-1]===".")
					{
						 say("Error:Illegal number definition!");
					     break;
					}
					if(num)
					{
						var obj={"name":temp,"type":6,"row":num};
						AResult.add(obj);
					}else{
						htmlStr += spaceK + "<span class='grammer-number'>" + temp + "</span>";
					}
					spaceK = "";
					temp = "";
					cnum = false;
					onParse=false;
					i--;
					continue;
				}
				if (isNumber(str[i])) {
					if(str[i]===".")
						ccoma++;
					temp += str[i];
				} else {
					 say("Error: Illegal number definition!");
					break;
				}
			}
			if (coperator) {
				if (!isOperator(str[i])) {
					if (!isOperator(temp) || temp === "|") {
						say("Error: Illegal Operator !");
						break;
					}
					if(num)
					{
						var obj={"name":temp,"type":3,"row":num};
						AResult.add(obj);
					}else
					{
						htmlStr += spaceK + "<span class='grammer-operator'>" + getOperator(temp) + "</span>";
					}
					spaceK = "";
					temp = "";
					coperator = false;
					onParse=false;
					i--;
					continue;
				} else {
					temp += str[i];
					if(!isOperator(temp))//俩个独立的操作符连在一起的情况
					{
						var subTemp=temp.substr(0,temp.length-1);
						if(num)
					   {
						var obj={"name":subTemp,"type":3,"row":num};
						AResult.add(obj);
					   }else
					   {
						   htmlStr += spaceK + "<span class='grammer-operator'>" + getOperator(subTemp) + "</span>";
					   }
						spaceK="";
						temp=temp[temp.length-1];
						continue;
					}
				}
			}
			if(cchar)
			{
				if(!isChar(str[i+1]))
				{
					say("Error: Illegal char!");
					cchar=false;
					break;
				}else
				{
					temp+=str[i]+str[i+1];
					if(num)
					{
						var obj={"name":temp,"type":7,"row":num};
						AResult.add(obj);
					}else
					{
						htmlStr+=spaceK+"<span class='grammer-char'>"+temp+"</span>";
					}
					temp="";
					spaceK="";
					cchar=false;
					onParse=false;
					i++;
					continue;
				}
			}
			if(cstring)
			{
				if(isString(str[i]))
				{
					temp+=str[i];
					if(num)
					{
						var obj={"name":temp,"type":8,"row":num};
						AResult.add(obj);
					}else
					{
						htmlStr+=spaceK+"<span class='grammer-string'>"+temp+"</span>";
					}
					temp="";
					spaceK="";
					cstring=false;
					onParse=false;
					continue;
				}else
				{
					temp+=str[i];
				}
			}
			if(cnote)
			{
				if(str[i]==="*"&&str[i+1]==="/")
				{
					temp+="*/";
					i++;
					htmlStr+=spaceK+"<span class='grammer-note'>"+temp+"</span>";
					cnote=false;
					continue;
				}else
				{
					temp+=str[i];
				}
			}
		} else {
			if (str[i] === " ") {
				spaceK += "<span class='grammer-space'></span>";
				continue;
			}
			onParse = true;
			temp += str[i];
			if (isHead(temp)) {
				chead = true;
				continue;
			}
			if (isLetter(temp)) {
				variable = true;
				continue;
			}
			if (isOperator(temp)) {
				if(temp==="/"&&str[i+1]==='/')//单行注释
				{
					temp+=str.substr(i+1,str.length-i-1);
					htmlStr+=spaceK+"<span class='grammer-note'>"+temp+"</span>";
					onParse=false;
					break;
				}
				if(temp==="/"&&str[i+1]==="*")
				{
					temp+=str[i+1];
					i++;
					cnote=true;
					continue;
				}
				coperator = true;
			}
			if (isChar(temp)) {
				cchar = true;
			}
			if (isString(temp)) {
				cstring = true;
			}
			if (isNumber(temp)) {
				cnum = true;
				continue;
			}
			if (isPun(temp)) { //是标点
				if(num)
					{
						var obj={"name":temp,"type":4,"row":num};
						AResult.add(obj);
					}else
					{
						htmlStr += spaceK + "<span class='grammer-punctuation'>" + temp + "</span>";
					}
				spaceK = "";
				onParse = false;
				temp = "";
				continue;
			}

		}

	}
	 if(cnote)
	 {
		 htmlStr+=spaceK+"<span class='grammer-note'>"+temp+"</span>";
	 }else
	 {
		 onParse=false;
	 }
	 if(cchar||cstring||coperator||variable||cnum||!htmlStr)
	{
		return "";
	}
	return htmlStr;
}
function isChar(m) {
	return m === "'";
}
function isString(m) {
	return m === '"';
}
function isHead(m) {
	return m === "#";
}
function isKeyWord(word) {
	return keyWords[word];
}
function isOperator(m) {
	for (var i = 0; i < Operator.length; i++) {
		if (Operator[i].tag === m)
			return true;
	}
	return false;
}
function getOperator(m) {
	for (var i = 0; i < Operator.length; i++) {
		if (Operator[i].tag === m)
			return Operator[i].value;
	}
	return " ";
}
function isPun(p) {
	for (var i = 0; i < Punctuation.length; i++) {
		if (p === Punctuation[i])
			return true;
	}
	return false;
}
function isLetter(l) {
	return Alphabet.indexOf(l) !== -1;
}
function isNumber(n) {
	return NumChar.indexOf(n) !== -1;
}

function parseCode()
{
	AResult.empty();
	var tempOnparse=onParse;
	var tempCnote=cnote;
	onParse=false;
	cnote=false;
	var p=liHead;
	while(p)
	{
		WordAnalyze(strPrepare(p.innerHTML),p.num);
		p=p.next;
	}
	onParse=tempOnparse;
	cnote=tempCnote;
}
function showWords()
{
	 parseCode();
	 var p=AResult.iterator();
	 var consoleW=get("consoleWindow");
	 var table=document.createElement("table");
	 var str="<tr><td>Name/Value</td><td>Type</td><td>Row</td></tr>";
	 while(p)
	 {
		 str+="<tr><td>"+p.name+"</td><td>"+returnType(p.type)+"</td><td>"+p.row+"</td></tr>";
		 p=AResult.iterator();
	 }
	 table.innerHTML=str;
	 consoleW.appendChild(table);
}
//1代表keyWord,2代表variable，3代表运算符，4代表界符，5代表bool值，6代表数字，7代表字符,8代表字符串
function returnType(num)
{
	var str="";
	switch(num)
	{
		case 1:str="keyWord";break;
		case 2:str="variable";break;
		case 3:str="operator";break;
		case 4:str="punctuation";break;
		case 5:str="bool";break;
		case 6:str="number";break;
		case 7:str="char";break;
		case 8:str="string";break;
        default:str="unknown";break;
	}
	return str;
}
