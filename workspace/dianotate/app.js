
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , call = require('./routes/call')
  , poll = require('./routes/poll')  
  , http = require('http')
  , path = require('path');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var MemoryStore = express.session.MemoryStore;
var app = express();
var url = require('url');
const https = require('https'),
fs = require("fs");

var credentials = {
		  key: fs.readFileSync('keys/key.pem'),
		  cert: fs.readFileSync('keys/cert.pem')
		};

passport.use(new LocalStrategy(
		  function(username, password, done) {
			  user = {id : 1, name : "testuser"};
			  if(username == "scall" && password == "scall")
				  return done(null, user);
			  else
				  return done(null, false, { message: 'Incorrect password.' });
		  }
		)
);

passport.serializeUser(function(user, done) {
	  console.log("serialized user: " + JSON.stringify(user));
	  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserialize user");
	var user = {id: id, name: "testuser"};
	done(null, user);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
const nDays = 365;
app.use(express.session({ secret: 'scall', store: new MemoryStore(), cookie: {maxAge: 60*60*24*1000*nDays}}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(function(req, res, next) {
	var refer = req.headers['referer'];
	var domain = false;
	if(refer != undefined)
	{
		var r = url.parse(refer);
		domain = r.protocol + "//" + r.host;
	}
        if(req.query.site)
         {
                var r = url.parse(req.query.site);
                domain = r.protocol + "//" + r.host;
         }
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie, Cookie");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if(domain)
    	res.setHeader("Access-Control-Allow-Origin", domain);
    res.setHeader("Access-Control-Max-Age", "1728000");
    console.log("Referer domain: " + domain);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return next();
  });
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/call', call.call);
app.post('/call', call.call);
app.get('/poll', poll.poll);
app.post('/poll', poll.poll);
app.post('/login', passport.authenticate('local', { successRedirect: '/success.html',
    failureRedirect: '/failure.html' }));

http.createServer(app).listen(3001, function(){
  console.log('Express server listening on port ' + 3001);
});

https.createServer(credentials, app).listen(3000, function(){
console.log('Express https server listening on port ' + 3000);
});
