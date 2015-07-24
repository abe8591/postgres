var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var conString = "pg://postgres:111111@149.24.49.145:5432/todo";
var client = new pg.Client(conString);

http.listen(port, function(err) {
	
	 console.log('listening on *:3000');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('create', function(req) {
		//
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
		//client.connect();
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
		//client.connect();
		pg.connect(conString, function(err, client, done) {
			//client.query(req).on("row", function (row) {
				//results.push(row);
			//});
			
			client.query(req, function (err, result) {
				// On end JSONify and write the results to console and to HTML output
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
		//client.connect();
		pg.connect(conString, function(err, client, done) {
			client.query(req, function (err, result) {
				if(err) {
					console.log(err);
				} else {
					console.log(JSON.stringify(result, null, "    "));
					done();
				}
			});
			console.log(req);
		});
	});

	socket.on('delete', function(req) {
		//client.connect();
		pg.connect(conString, function(err, client, done) {
			client.query(req, function (err, result) {
				if(err) {
					console.log(err);
				} else {
					console.log(JSON.stringify(result, null, "    "));
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