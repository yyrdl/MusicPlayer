
//��ǰд��705�У�BEparser()
var scopeStack = new Stack(); //���ڿ���������
var scopeNum = 0; //��������
var analyzeStack = new Stack(); //����﷨�������
var codeStack = new Stack();
scopeStack.push(scopeNum++);
// ����ģ��
//{"functionName":"","variables":[],"code":[],"returnType":""};
//����ģ��
// {"name":"","value":"scopeId":"","type":"","isArray":"","isFunction":}


//������������if,for,��������һ��Ҫ�ӻ�����
function GAworker() {
	var temp = AResult.iterator();
	var onDeclare = false;
	var isInfunction = false;
	var errorTag = false;
	var fd = {
		"variables" : [],
		"scopeId" : 0,
		"code" : []
	};
	analyzeStack.push(fd);
	var ti = 0;
	while (temp) {
		var cScope = scopeStack.top();
		if (isInfunction) {
			var va = analyzeStack.top().variables;
			for (; ; ) {
				cScope = scopeStack.top();
				if (temp.type === 1 && isTypeD(temp.name)) {
					for (; ; ) {
						var temp4 = AResult.iterator();
						if (!temp4)
							break;
						var obj = {
							"name" : temp4.name,
							"type" : 2,
							"Ttype" : 1,
							"scopeId" : cScope,
							"row" : temp4.row,
							"vtype" : temp.name,
							"value" : ""
						};
						for (var i = 0; i < va.length; i++) {
							if (va[i].scopeId === obj.scopeId) {
								va[i].variables.push(obj);
								break;
							}
						}
						codeStack.push({
							"name" : obj.name,
							"type" : obj.type,
							"scopeId" : obj.scopeId,
							"row" : obj.row
						});
						for (; ; ) {
							temp4 = AResult.iterator();
							if (!temp4)
								break;
							if (temp4.type > 4) {
								var obj5 = {
									"name" : temp4.name,
									"type" : temp4.type,
									"row" : temp4.row,
									"value" : ""
								};
								if (temp4.type === 6) {
									obj5.value = parseFloat(temp4.name);
								} else {
									obj5.value = temp4.name;
								}
								codeStack.push(obj5);
							} else {
								if (temp4.name === "," || temp4.name === ";") {
									codeStack.push(temp4);
									break;
								} else {
									codeStack.push(temp4);
								}
							}
						}
						if (temp4.name === ";")
							break;
					}

				} else {
					if (temp.type > 4) {
						var obj5 = {
							"name" : temp.name,
							"type" : temp.type,
							"row" : temp.row,
							"value" : ""
						};
						if (temp.type === 6) {
							obj5.value = parseFloat(temp.name);
						} else {
							obj5.value = temp.name;
						}
						codeStack.push(obj5);
					} else {
						if (temp.name === "for" || temp.name === "while" || temp.name === "if" || temp.name === "else") {
							var sc = {
								"scopeId" : scopeNum,
								"variables" : [],
								"psd" : cScope
							};
							va.push(sc);
							scopeStack.push(scopeNum++);
						}
						if (temp.name === "{") {
							var obj6 = {
								"name" : temp.name,
								"type" : temp.type,
								"row" : temp.row,
								"scopeId" : cScope
							};
							codeStack.push(obj6);
						} else {
							if (temp.name === "}") {
								var obj7 = {
									"name" : temp.name,
									"type" : temp.type,
									"row" : temp.row,
									"scopeId" : cScope
								};
								codeStack.push(obj7);
								scopeStack.pop();
								var top = scopeStack.top();
								if (0 === top) {
									isInfunction = false;
									break;
								}
							} else {
								codeStack.push(temp);
							}

						}
					}
				}
				temp = AResult.iterator();
				if (!temp)
					break;
			}
			temp = AResult.iterator();
			continue;
		}
		if (temp.type === 1 && isTypeD(temp.name)) //�����������ı����ͺ�������ȫ�ֵ�
		{
			//��ʾ�Ѿ����� ���������ͺ��������׶�
			var temp2 = AResult.iterator();
			if (temp2.type !== 2) {
				errorTag = true;
				say("Error: Expected a variable at row :" + temp2.row + " code:grammer.js 157");
				break;
			}
			var temp3 = AResult.iterator();
			if (temp3.name === "(") { //�����Ǻ�������
				var obj1 = {
					"name" : temp2.name,
					"type" : 2,
					"Ttype" : 0,
					"scopeId" : scopeNum,
					"row" : temp2.row,
					"args" : [],
					"returnType" : temp.name,
					"psd" : cScope
				};
				var obj2 = {
					"functionName" : temp2.name,
					"variables" : [{
							"scopeId" : scopeNum,
							"variables" : [],
							"psd" : cScope
						}
					],
					"code" : [],
					"returnType" : temp.name,
					"args" : [],
					"scopeId" : scopeNum,
					"psd" : cScope,
					"row" : temp2.row
				};
				for (; ; ) {
					temp3 = AResult.iterator();
					if (temp3.name === ")")
						break;
					temp2 = AResult.iterator();
					if (isTypeD(temp3.name) && (temp2.type === 2)) {
						var ar = {
							"name" : temp2.name,
							"type" : 2,
							"Type" : 1,
							"vtype" : temp3.name,
							"value" : "",
							"scopeId" : scopeNum,
							"row" : temp2.row
						};
						obj1["args"].push(ar);
						obj2.variables[0].variables.push(ar);
						temp2 = AResult.iterator();
						if (temp2.name === ")")
							break;
						else {
							if (temp2.name === ",")
								continue;
							else {
								say("Illegal arguments declare at row " + temp2.row);
								errorTag = true;
								break;
							}
						}
					} else {
						say("Illegal aruguments declare  at row " + temp2.row);
						errorTag = true;
						break;
					}
				}
				analyzeStack.pool[0].variables.push(obj1);
				analyzeStack.push(obj2);
				temp2 = AResult.iterator();
				if (temp2.name === "{") {
					codeStack.push(obj1);
					codeStack.push({
						"name" : "{",
						"type" : 3,
						"scopeId" : obj1.scopeId
					});
					isInfunction = true;
					scopeStack.push(scopeNum++);
				} else {
					if (temp2.name !== ";") {
						say("Error: Expected ';' at row :" + temp2.row);
						errorTag = true;
						break;
					}
				}
				temp = AResult.iterator();
				continue;
			}
			var newobj = true;
			for (; ; ) { //�����Ǳ�������
				if (newobj) {
					var obj4 = {
						"name" : temp2.name,
						"type" : 2,
						"Ttype" : 1,
						"scopeId" : cScope,
						"row" : temp2.row,
						"vtype" : temp.name,
						"value" : ""
					};
					analyzeStack.pool[0].variables.push(obj4);
					codeStack.push({
						"name" : obj4.name,
						"scopeId" : obj4.scopeId,
						"type" : obj4.type,
						"row" : obj4.row
					});
					newobj = false;
				}
				if (temp3.name === ";") {
					codeStack.push(temp3);
					break;
				} else {
					if (temp3.name === ",") {
						codeStack.push(temp3);
						temp2 = AResult.iterator();
						temp3 = AResult.iterator();
						newobj = true;
						if (temp2.type !== 2 || temp3.type === 1) {
							say("Error at row: " + temp2.row);
							errorTag = true;
							break;
						}
					} else {
						for (; ; ) {
							if (temp3.type > 4) {
								var obj5 = {
									"name" : temp3.name,
									"type" : temp3.type,
									"row" : temp3.row,
									"value" : ""
								};
								if (temp.type === 6) {
									obj5.value = parseFloat(temp3.name);
								} else {
									obj5.value = temp3.name;
								}
								codeStack.push(obj5);
							} else {
								if (temp3.name === "," || temp3.name === ";")
									break;
								else {
									codeStack.push(temp3);
								}

							}
							temp3 = AResult.iterator();
						}
					}
				}
			}
			temp = AResult.iterator();
			if (!temp)
				break;
			if (errorTag)
				break;
		} //
	}
}
//�ж��Ƿ�����������
function isTypeD(name) {
	if (name === "int" || name === "float" || name === "double" || name === "char" || name === "void" || name === "bool")
		return true;
	else
		return false;
}
function isCompare(op) {
	if (op === ">" || op === "<" || op === "==" || op === "!=" || op === "<=" || op === ">=" || op === "===" || op === "!==")
		return true;
	else
		return false;
}


function createDataSection() {
	parseCode();
	analyzeStack.empty();
	codeStack.empty();
	GAworker();
	sayCode2();
}

function showV() {

	for (var i = 0; i < analyzeStack.pool[0].variables.length; i++) {
		var o = analyzeStack.pool[0].variables[i];
		var str = "";
		for (var p in o)
			str += p + " : " + o[p] + "  ";
		say(str);
	}
	for (var i = 1; i < analyzeStack.size(); i++) {
		var v = analyzeStack.pool[i].variables;
		say("function name:  " + analyzeStack.pool[i].functionName + "   function scopeId " + analyzeStack.pool[i].scopeId);
		for (var j = 0; j < v.length; j++) {
			say(" scopeId:  " + v[j].scopeId + " psd: " + v[j].psd);
			for (var k = 0; k < v[j].variables.length; k++) {
				var str = "";
				for (var p in v[j].variables[k])
					str += p + "  :  " + v[j].variables[k][p] + "  ";
				say(str);
			}
		}
	}
}

function sayCode2() {
	var code = codeStack.pool;
	for (var i = 0; i < code.length; i++) {
		var str = "";
		for (var p in code[i])
			str += p + " :  " + code[i][p] + "  ";
		say(str);
	}
}
//֧�� while ,if ��else ,�������ʽ���������ʽ��//ѭ��ֻ֧��while,֧��if else
//�������⣬��δ�����ʽ�еĺ������ã���δ���Ƕ��
var BEGoto = [{
		"B" : 1,
		"A" : 2,
		"R" : 4,
		"E" : 5,
		"T" : 6,
		"F" : 7
	}, {}, {
		"D" : 9
	}, {
		"B" : 12,
		"A" : 2,
		"R" : 4,
		"E" : 13,
		"T" : 6,
		"F" : 7
	}, {}, {}, {}, {}, {}, {}, {
		"A" : 18,
		"R" : 4,
		"E" : 5,
		"T" : 6,
		"F" : 7,
		"N" : 17
	}, {
		"A" : 20,
		"R" : 4,
		"E" : 5,
		"T" : 6,
		"F" : 7,
		"P" : 19
	}, {}, {}, {
		"E" : 23,
		"T" : 6,
		"F" : 7
	}, {
		"T" : 25,
		"F" : 7
	}, {
		"F" : 26
	}, {}, {}, {}, {}, {}, {}, {}, {
		"E" : 29,
		"T" : 6,
		"F" : 7
	}, {}, {}, {
		"A" : 18,
		"R" : 4,
		"E" : 5,
		"T" : 6,
		"F" : 7,
		"N" : 30
	}, {
		"A" : 20,
		"R" : 4,
		"E" : 5,
		"T" : 6,
		"F" : 7,
		"P" : 31
	}, {}, {}, {}
];
var CEGoto = [{
		"E" : 1,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 8,
		"R" : 9
	}, {}, {}, {}, {
		"E" : 13,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 14,
		"A" : 8,
		"R" : 9
	}, {}, {}, {}, {
		"D" : 16
	}, {}, {
		"T" : 19,
		"F" : 3
	}, {
		"E" : 21,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 8,
		"R" : 9
	}, {
		"F" : 22
	}, {}, {}, {
		"E" : 25,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 8,
		"R" : 9
	}, {}, {
		"E" : 28,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 27,
		"R" : 9,
		"N" : 26
	}, {
		"E" : 28,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 30,
		"R" : 9,
		"P" : 29
	}, {}, {
		"E" : 13,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 8,
		"R" : 9
	}, {}, {}, {}, {}, {}, {}, {
		"D" : 16
	}, {}, {}, {
		"D" : 16
	}, {
		"E" : 34,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 8,
		"R" : 9
	}, {
		"E" : 28,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 27,
		"R" : 9,
		"N" : 35
	}, {
		"E" : 28,
		"T" : 2,
		"F" : 3,
		"B" : 6,
		"H" : 7,
		"A" : 30,
		"R" : 9,
		"P" : 36
	}, {}, {}, {}
];
function checkFuncE(name) {
	var result = {
		"status" : false,
		"rt" : ""
	};
	var pool = analyzeStack.pool[0].variables;
	for (var i = 0; i < pool.length; i++) {
		if (pool[i].name === name && pool[i].Ttype && pool[i].Type === 0) {
			result.status = true;
			result.rt = pool[i].returnType;
			break;
		}
	}
	return result;
}

//�м�������ɺ�����δ���
function middleCodeParser() {
	var statusStack = new Stack(); //״̬ջ
	var charStack = new Stack(); //����ջ
	var tempDataStack = new Stack(); //��ʱ���ݴ��ջ
	var ifWhileStack = new Stack();
	var register = new Register(); //�Ĵ���
	var k = 0;
	var codePool = codeStack.pool;
	var temp;
	var onCE = false; //��ʾ�ڱ����������ʽ
	var onBE = false; //��ʾ�ڱ��벼�����ʽ
	var onIf = false; //��ʾ�ڱ����������ʽ
	var funcCall = false;
	var onWhile = false; //��ʾ�ڱ���whileѭ��
	var cFunCodeP = analyzeStack.pool[0].code;
	
	//�������ʽ�����Ӻ���
	function BEparser(k) {
		var BEStatus = 0;
		var BSStack = new Stack();
		var BCStack = new Stack();
		var DStack = new Stack();
		var temp;
		k--;
		BSStack.push(0);
		function s8()//��ĳһ״̬�����һ������µ���
		{
			if (temp.type === 2 && codePool[k + 1] === "(") {
					var r = checkFuncE(temp.name); //Ӧ�÷��غ����ķ��ؽ�����ڵļĴ���
					if (r.status) {
						if (r.rt === "void") {
							say("Error! function :" + temp.name + " return nothing. row:" + temp.row);
							return {
								"status" : false
							};
						}
						var res = funcCallParser(k, temp); //���ص��Ǻ���������ڵļĴ����ı��
						BCStack.push("i");
						//����ĸ�ʽ��Ҫ���飬�Ĵ�����type��Ϊ9
						DStack.push({
							"type" : 9,
							"rt" : r.rt,
							"rn" : res
						});
						BSStack.push(8);
						BEStatus = 8;
					} else {
						say("Error ! Undefined function : " + temp.name + ".  row: " + temp.row);
						return {
							"status" : false
						};
					}
					return {"status":true};
				} 
				if(temp.type===2||temp.type>4)
				{
					BSStack.push(8);
					BCStack.push("i");
					DStack.push(temp);
					BEStatus=8;
					 return {"status":true};
				}
				say("Error! Illegal bool expression!");
				return {"status":false};
		}
		for (; ; ) {
			k++;
			temp=codePool[k];
			if (BEStatus === 0) {//״̬0
				if (temp.name === "(") {
					BCStack.push("(");
					BSStack.push(3);
					BEStatus = 3;
					continue;
				}
				var st=s8();
				if(st.status===false)
				{
					 return st;
				}else
				{
					continue;
				}
			}
			if(BEStatus===1)//״̬1
			{
				if(temp.type===4)
				{
					//��ʾ�Ѿ�������ϣ�����Ӧ����ʲô���Լ���ô����Ƿ���������ٴ���
				}
			}
			if(BEStatus===2)//״̬2
			{
				if(temp.name==="||"||temp.name==="&&")
				{
					BEStatus=temp.name==="||"?10:11;
					BEStatus.push(BEStatus);
					BCStack.push(temp.name);
					DStack.push({"name":temp.name,"type":3});
					continue;
				}
				if(temp.name===")"||temp.type===4)
				{
					BCStack.push("D");
					var s=BEGoto[BEStatus.top()]["D"];
					if(s)
					{
						BEStatus.push(s);
						BEStatus=s;
					}else
					{
						say("Error! Illegal Bool expression! row:"+temp.row);
						return {"status":false};
					}
					continue;
				}
				say("Error! Illegal Bool Expression! row:"+temp.row);
				return {"status":false};
			}
			if(BEStatus===3)
			{
				if(temp.name==="(")
				{
					BEStatus=3;
					BCStack.push("(");
					BSStack.push(3);
					continue;
				}
				 var st=s8();
				 if(!st.status)
				 {
					 return st;
				 }else
				 {
					 continue;
				 }
			}
			if(BEStatus===4)
			{
				if(temp.name==="||"||temp.name==="&&"||temp.name===")"||temp.type===4)
				{
					BSStack.pop();
					BCStack.pop();
					BEStatus=BEGoto[BSStack.top()]["A"];
					if(BEStatus)
					{
						BSStack.push(BEStatus);
						BCStack.push("A");
						continue;
					}else
					{
						say("Error! Illegal bool expression! row:"+temp.row);
						return {"status":false};
					}
				}else
				{
					    say("Error! Unexpected  "+temp.name+" . row:"+temp.row);
						return {"status":false};
				}
			}
			if(BEStatus===5)
			{
				
			}
		}

	};
	//������ʽ�����Ӻ���
	function CEparser(k, temp) {};
	//�������÷����ӳ���
	function FunCallParser(k, temp) {};
	//whileѭ�������ӳ���
	function whileParser(k, temp) {};
	//if else �����ӳ���
	function IfParser(k, temp) {};

	for (k = 0; k < codePool.length; k++) //��"{""}"�ŵ��м������ȥ���������е�ʱ�������������
	{
		temp = codePool[k];
		if (temp.type === 2 && temp.Ttype === 0) //�����Ǻ�������λ��������洢�ռ�
		{
			for (var i = 0; i < analyzeStack.size(); i++) {
				if (analyzeStack.pool[i].functionName && analyzeStack.pool[i].functionName === temp.name) {
					cFunCodeP = analyzeStack.pool[i].code;
				}
			}
			continue;
		}
		if (temp.name === "while") { //������while���

		}
		if (temp.name === "if") { //������if���

		}
		if (temp.type === 2 && temp.Ttype === 1) { //��������ͨ��������ô���п������������ʽ�����ǲ������ʽ

		}
		if (onBE) { //���벼�����ʽ

		}
		if (onCE) { //�����������ʽ �����������
			var CEstatus = 0;
		}
		if (onIf) {}
		if (onWhile) {}

	}

}
function codeRunner() {}
