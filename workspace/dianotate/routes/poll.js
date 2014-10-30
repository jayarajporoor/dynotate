
/*
 * GET users listing.
 */
global.pendingPolls = [];

exports.poll = function(req, res){
	if(req.body.key != "XYXYABC" && req.body.secret != "XYXYABC")
	{
		console.log("Unauthorized access!");
		res.end("");
		return;
	}
	console.log(JSON.stringify(global.pendingCalls));
	if(global.pendingCalls.length > 0)
	{		
		var phoneNum = global.pendingCalls.shift();
		console.log("poll: phonenum:" + phoneNum);		
		res.set("Content-Type", "text/plain");
		res.end(phoneNum);
	}else
		global.pendingPolls.push({req: req, res: res, ts: new Date().getTime()});
};

setInterval(
	function()
	{
		var tsExpire = new Date().getTime() - 10*1000;
		for(var i =0;i<global.pendingPolls.length;i++)
		{
			if(global.pendingPolls[i].ts < tsExpire)
			{
				console.log("Expiring poll entry: " + i);
				global.pendingPolls[i].res.set("Content-Type", "text/plain");
				global.pendingPolls[i].res.end("");
				global.pendingPolls.splice(i, 1);
			}
		}
	},
3*1000
);
