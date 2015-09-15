var config=require("../config.js");
var util=require("util");







function gen_session(user, res) {
  var auth_token = user._id + '$$$$'; 
  //res.cookie(name, value, [options])
  res.cookie(config.auth_cookie_name, auth_token,
    {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true}); //cookie 有效期30天
};

exports.gen_session=gen_session;

exports.userRequired=function(req,res,next){
	 console.log(req.cookies);
	 console.log(req.header);
	 for(var p in req.cookies)
	 {
		 console.log(p+" : "+req.cookies[p]);
	 }
	if(req.session&&req.session.user)
	{
		//console.log(util.inspect(req.session.user));
		next();
	}else
	{
		res.redirect("/");
	}
};
