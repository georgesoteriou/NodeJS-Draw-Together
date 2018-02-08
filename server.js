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
var all_ellipses = [];

io.on('connection', function(socket) {
	console.log('connection');
    all_ellipses.forEach(function(ellipse){
        socket.emit('other_ellipse',ellipse);
    });
	socket.on('ellipse', function(data) {
		console.log('ellipse', data);
        all_ellipses.push(data);
		socket.broadcast.emit('other_ellipse', data);
	});
	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
    socket.on('clear',function(){
        all_ellipses = [];
        io.emit('clr');
    });
});
