

function Stack() {
	this.pool = [];
}
Stack.prototype = {
	push : function (item) {
		this.pool.push(item);
	},
	top : function () {
		return this.pool[this.pool.length - 1];//返回的是引用
	},
	pop : function () {
		return this.pool.pop();
	},
	size : function () {
		return this.pool.length;
	},
	isEmpty : function () {
		return this.pool.length === 0;
	},
	empty : function () {
		this.pool.length = 0;
	}
}

//链表类
function List() {
	this.head = {
		"next" : "",
		"item" : ""
	};
	this.last;
	this.length = 0;
	this.current;
}
List.prototype = {
	add : function (item) {
		if (!this.head.next) {
			this.head.item = item;
			this.head.next = {
				"next" : "",
				"item" : ""
			};
			this.last = this.head.next;
			this.current = this.head;
		} else {
			this.last.item = item;
			this.last.next = {
				"next" : "",
				"item" : ""
			};
			this.current = this.head;
			this.last = this.last.next;
		}
		this.length++;
	},
	size : function () {
		return this.length;
	},
	iterator : function () {
		if (this.current) {
			var item = this.current.item;
			this.current = this.current.next;
			return item;
		} else
			return;
	},
	resetIterator:function()
	{
		this.current=this.head;
	},
	empty:function(){
		this.head = {
		"next" : "",
		"item" : ""
	};
	this.last;
	this.length = 0;
	this.current;
	}
}

 function Register()//寄存器类，用于后期中间代码生成和中间代码的执行阶段
 {
	 this.pool=[];
	 this.Max_Length=20;
	 this._init();
 }
 Register.prototype={
	 _init:function(){
		 for(var i=0;i<this.Max_Length;i++)
			 this.pool.push({"e":false,"v":""});
	 },
	 getRegister:function()//请求一个未使用的寄存器，返回寄存器编号
	 {
		 var i;
		 for(i=0;i<this.Max_Length;i++)
		 {
			 if(this.pool[i].e===false)
			 {
				  this.pool[i].e=true;
				  break;
			 }
		 }
		 return i===this.Max_Length?-1:i;
	 },
	 free:function(i)//释放某个寄存器
	 {
		 this.pool[i].e=false;
	 },
	 set:function(item)//设置某个寄存器的值
	 {
		 this.pool[item.i].v=item.v;
	 },
	 get:function(i)//得到指定寄存器的值
	 {
		 return this.pool[i].v;
	 },
	 loadData:function()//当发生函数调用时，需保存当前的寄存器状态
	 {
		 var vector=[];
		 var self=this;
		 for(var i=0;i<self.Max_Length;i++)
		 {
			 if(self.pool[i].e)
			 {
				 vector.push({"i":i,"item":self.pool[i]});
			 }
		 }
		 return vector;
	 },
	 reload:function(vector)//当函数调用结束时，回复当初的寄存器状态
	 {
		 var self=this;
		for(var i=0;i<self.Max_Length;i++)
		{
			self.pool[i].e=false;
		}
		for(var i=0;i<vector.length;i++)
		{
			self.pool[vector[i].i]=vector[i].item;
		}
	 }
 };
 

