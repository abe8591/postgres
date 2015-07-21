var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var conString = "pg://postgres:111111@localhost:5432/todo";
var client = new pg.Client(conString);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  client.connect();
  pg.connect(conString, function(err, client, done) {
	
	socket.on('create', function(req) {
		console.log(req.create1);
		console.log(req.create2);
		client.query(req.create1);
		client.query(req.create2);
	});
	  
	socket.on('insert', function(req) {
		var results = [];
		client.query(req.insert1).on("row", function (row) {
			results.push(row);
		});
		console.log(req.insert1);
		client.query(req.insert2).on("row", function (row) {
			results.push(row);
		});
		console.log(req.insert2);
	});
	  
	socket.on('select', function(req) {
		var results = [];
		//client.query(req).on("row", function (row) {
			//results.push(row);
		//});
		
		client.query(req, function (err, result) {
			// On end JSONify and write the results to console and to HTML output
			console.log(JSON.stringify(result, null, "    "));
			socket.emit('table', result);
		});
	});
	  
	socket.on('put', function(req) {
		client.query(req);
		console.log(req);
	});

	socket.on('delete', function(req) {
		client.query(req);
		console.log(req);
	
	});
	
	if(err) {
	  console.log(err);
	}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});