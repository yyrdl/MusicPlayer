
function newUser()
{
	var name=$("#zhuceUsername").get(0).value;
	var pass=$("#zhucePassword").get(0).value;
	var repass=$("#zhucePassRepeat").get(0).value;
	var email=$("#zhuceEmail").get(0).value;
	if(name&&pass&&repass&&email)
	{
		if(pass!=repass)
		{
			alert("俩次输入的密码不匹配");
		}else
		{
			var user={
				"name":name,
				"password":pass,
				"email":email
			};
			var ob={"userInfo":user};
			System.post(ob,"/signUp",function(json){
				if(json.message=="注册成功")
				{
					var obj={
						"name":name,
						"password":pass
					};
					$("#zhuceContainer").remove();
					LoginInto(obj,2);
				}
			});
		}
		
	}else{
		alert("信息不完善！");
	}
}

function LoadRegistEvent(){
	$(".zhuceSubmit").on("click",function(){
		newUser();
	});
	$(".zhuceGiveup").on("click",function(){
		window.location="/";
	});
}