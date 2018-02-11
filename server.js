var express = require('express');

var port = process.env.PORT || 5050;

var server = express()
    .use(express.static(__dirname + '/public'))
    .use(express.static(__dirname))
    .set('views', __dirname + '/public')
    .engine('.html', require('ejs').renderFile)
    .get('/', function(req, res) {
        res.render('index.html');
    })
    .listen(port, function() { console.log("Listening on port " + port); });

var io = require('socket.io')(server);
var all = [];

io.on('connection', function(socket) {
	console.log('connection');
        all_lines.forEach(function(data){
        	socket.emit('other_draw',data);
        });
	socket.on('draw', function(data) {
        	all.push(data);
		socket.broadcast.emit('other_draw', data);
	});
	socket.on('disconnect', function(){
    		console.log('user disconnected');
  	});
    	socket.on('clear',function(){
        	all = [];
        	io.emit('clr');
    	});
});
