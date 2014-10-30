
/*
 * GET users listing.
 */

global.pendingCalls = [];

exports.call = function(req, res){
  var phoneNum = req.body.phoneNum;
  console.log("call: phonenum:" + phoneNum);
  msg = {phoneNum: phoneNum};
  res.set("Content-Type", "application/json");
  
  if(phoneNum == undefined)
  {
	  msg.error = "no phone number specified";
	  res.end(JSON.stringify(msg));
	  return;
  }
  
  if(!req.user)
  {
	  msg.error = "not signed in to scall service";
	  res.end(JSON.stringify(msg));
	  return;
  }

  res.end(JSON.stringify(msg));
  
  console.log("processing request for user id: " + req.user.id);
  
  if(global.pendingPolls.length > 0)
  {
	  var poll = global.pendingPolls.shift();
	  poll.res.set("Content-Type", "text/plain");
	  poll.res.end(phoneNum);
  }else
	  global.pendingCalls.push(phoneNum);
};