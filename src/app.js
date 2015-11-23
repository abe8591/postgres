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
    tableName : 'todo',
  }),*/
  secret : 'imafakesecret',
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

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('checkUser', function(req) {
		client = new pg.Client(conString);
		var username = "'" + req.username + "'";
		var pass = "'" + req.password + "'";
		pg.connect(conString, function(error, client, done) {
			var query = client.query("SELECT user_id FROM users WHERE username = " + username + " AND pass = " + pass, function(err, result) {
				done(client);
				if(isNaN(query._result.rows[0].user_id) == false) { 
					app.post('/postgres', function(req, res) {
						res.render('/postgres');
						
					});
				}
			});
			
		});
		pg.end();
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
			console.log(req.create2);
		});
		
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
					console.log(result);
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