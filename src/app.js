var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');  
var favicon = require('serve-favicon');
var fs = require("fs");
var path = require("path");

var app_env = process.env["NODE_ENV"] || "development";

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var conString = "pg://other_user:u_pick_it@52.2.3.184:5432/ellucian";
var conString2 = "pg://other_user:u_pick_it@52.2.3.184:5432/users";
//var conString = "pg://postgres:111111@149.24.49.145:5432/todo";
//var conString = "pg://postgres:111111@localhost:5432/todo";
//var client = new pg.Client(conString);
var client;

//pull in our routes
var router = require('./router.js'); 

app.use('/assets', express.static(path.resolve(__dirname+'../../client/'))); 
app.use(compression()); 
app.use(bodyParser.urlencoded({ 
  extended: true                
}));                            

var pg = require('pg')
  , session = require('express-session')
  , pgSession = require('connect-pg-simple')(session);
 
app.use(session({
  /*store: new pgSession({
    pg : pg,
    conString : conString,
    tableName : 'todo'
  }),*/
  secret: "Ellucian Interns",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days 
}));

app.set('view engine', 'jade'); 
app.set('views', __dirname + '/views'); 
app.use(favicon(__dirname + '/../client/favicon.ico')); 
app.use(cookieParser()); 

router(app);

http.listen(port, function(err) {
	 console.log('listening on ' + port);
});

/*app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});*/

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('addUser', function(req) {
		client = new pg.Client(conString);
		pg.connect(conString, function(error, client, done) {
			var query = client.query();
			var id;
			var todayDay = new Date().getDate();
			var todayMonth = new Date().getMonth()+1;
			var todayYear = new Date().getFullYear();
			if(todayDay < 10) {
				todayDay = '0' + todayDay;
			}
			
			if(todayMonth < 10) {
				todayMonth = '0' + todayMonth;
			}
			
			var dateAdded = todayMonth + "/" + todayDay + "/" + todayYear;
			
			query.on("", function() {
				id = num;
			});
			var query = client.query("INSERT INTO users(id, username, password, dateAdded) VALUES(" + id + ", " + req.password + ", " + req.username + ", " +
						dateAdded + ")", function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				}
			});
			//done(client);
			//});
			pg.end();
		});
	});
	
	socket.on('create', function(req) {
		client = new pg.Client(conString);
		pg.connect(conString, function(error, client, done) {
			var query = client.query(req.create1, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				}
			});
			//done(client);
		//});
		console.log(req.create1);
		//pg.end();
		//pg.connect(conString, function(error, client, done) {
			var query = client.query(req.create2, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				} else {
					done(client);
				}
			});
			//done(client);
		});
		console.log(req.create2);
		pg.end();
	});
	  
	socket.on('insert', function(req) {
		client = new pg.Client(conString);
		var results = [];
		pg.connect(conString, function(error, client, done) {
			var query = client.query(req.insert1).on("row", function (row) {
				console.log(row);
				results.push(row);
				done(client);
			});
			query.on('error', function(error) {
				//handle the error
				console.log(error);
				done(client);
				client = new pg.Client(conString);
				error = "Incorrect syntax";
				socket.emit('err', error);
			});
			console.log(req.insert1);
		});
		pg.end();
		pg.connect(conString, function(error, client, done) {
			var query = client.query(req.insert2).on("row", function (row) {
				results.push(row);
				done(client);
			});
			query.on('error', function(error) {
				//handle the error
				console.log(error);
				done(client);
				//client = new pg.Client(conString);
				error = "Incorrect syntax";
				socket.emit('err', error);
			});
			console.log(req.insert2);
		});
		pg.end();
	});
	  
	socket.on('select', function(req) {
		client = new pg.Client(conString);
		var results = [];
		pg.connect(conString, function(err, client, done) {			
			var query = client.query(req, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				} else {
					socket.emit('table', result);
					done(client);
				}
			});
		});
		pg.end();
	});
	  
	socket.on('put', function(req) {
		client = new pg.Client(conString);
		pg.connect(conString, function(error, client, done) {
			var query = client.query(req, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				} else {
					done(client);
				}
			});
			console.log(req);
		});
		pg.end();
	});

	socket.on('delete', function(req) {
		client = new pg.Client(conString);
		pg.connect(conString, function(error, client, done) {
			var query = client.query(req, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
					done(client);
					//client = new pg.Client(conString);
					error = "Incorrect syntax";
					socket.emit('err', err);
				} else {
					done(client);
					//client = new pg.Client(conString);
				}
			});
			console.log(req);
		});
		pg.end();

	});
	
	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});