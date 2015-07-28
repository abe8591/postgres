var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');
var favicon = require('serve-favicon');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

pg.defaults.poolSize = 100;

var conString = "pg://other_user:u_pick_it@52.2.3.184:5432/ellucian";
//var client = new pg.Client(conString);
var client;

http.listen(port, function(err) {
	 console.log('listening on ' + port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(favicon(__dirname + '/client/favicon.ico'));

io.on('connection', function(socket){
	console.log('a user connected');
	
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