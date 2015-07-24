var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var conString = "pg://other_user:u_pick_it@52.2.3.184:5432/ellucian";
var client = new pg.Client(conString);

http.listen(port, function(err) {
	 console.log('listening on ' + port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('create', function(req) {
		pg.connect(conString, function(err, client, done) {
			if(err) {
				console.log(err);
			} else {
				console.log(req.create1);
				console.log(req.create2);
				client.query(req.create1);
				client.query(req.create2);
				done();
			}
		});
	});
	  
	socket.on('insert', function(req) {
		pg.connect(conString, function(err, client, done) {
			if(err) {
				console.log(err);
			} else {
				var results = [];
				client.query(req.insert1).on("row", function (row) {
					results.push(row);
				});
				console.log(req.insert1);
				client.query(req.insert2).on("row", function (row) {
					results.push(row);
				});
				console.log(req.insert2);
				done();
			}
		});
	});
	  
	socket.on('select', function(req) {
		var results = [];
		pg.connect(conString, function(err, client, done) {			
			client.query(req, function (err, result) {
				// Write out as HTML output
				if(err) {
					console.log(err);
				} else {
					socket.emit('table', result);
					done();
				}
			});
		});
	});
	  
	socket.on('put', function(req) {
		pg.connect(conString, function(err, client, done) {
			client.query(req, function (err, result) {
				if(err) {
					console.log(err);
				} else {
					done();
				}
			});
			console.log(req);
		});
	});

	socket.on('delete', function(req) {
		pg.connect(conString, function(err, client, done) {
			client.query(req, function (err, result) {
				if(err) {
					console.log(err);
				} else {
					done();
				}
			});
			console.log(req);
		});

	});
	
	socket.on('disconnect', function () {
		pg.end();
		io.emit('user disconnected');
	});
});