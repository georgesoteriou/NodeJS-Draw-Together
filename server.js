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
'use strict';

const fs = require('fs');

var json;

fs.readFile('data.json', (err, data) => {
    json = JSON.parse(data);
});

io.on('connection', function(socket) {
    var g;
    var user;
    console.log('connection');
    socket.on('init', function(data){
        maybeg = json.all.filter(e => e.game == data.game);
        if (maybeg.length == 0){
            g = {game:data.game, draw: [], width:data.w, height:data.h, users: []};
            console.log(g.width,g.height);
            json.all.push(g);
        }else{
            g = maybeg[0];
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('showAllGames',function(){
        socket.emit('allGames', json.all);
    });

    socket.on('start', function(data){
        user = {name:data.name, col:data.col};
        g.users.push(user);
        io.emit('userUpdate',{game:g.game, users: g.users});
        socket.emit('join', {width:g.width,height:g.height});
        g.draw.forEach(function(e){
           socket.emit('other_draw',e);
       });
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('left',function(data){
        if(g){
            g.users = g.users.filter(e => e != user);
            io.emit('userUpdate',{game:g.game, users: g.users});
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('draw', function(data) {
        if(json.all.some(e => e.game == data.game)){
            g.draw.push(data);
            socket.broadcast.emit('other_draw', data);
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        if(g){
            g.users = g.users.filter(e => e != user);
            io.emit('userUpdate',{game:g.game, users: g.users});
            if(g.users.length == 0 && g.draw.length == 0){
                json.all = json.all.filter(e => e.game != g.game);
            }
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('discon', function(){
        console.log('user changed game');
        if(g){
            g.users = g.users.filter(e => e != user);
            io.emit('userUpdate',{game:g.game, users: g.users});
            if(g.users.length == 0 && g.draw.length == 0){
                json.all = json.all.filter(e => e.game != g.game);
            }
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('clear',function(data){
        if(json.all.some(e => e.game == data.game)){
        	g.draw = [];
        	io.emit('clr',data);
        }
        fs.writeFileSync('data.json', JSON.stringify(json));
    });

    socket.on('clearall',function(){
        json.all = [];
        fs.writeFileSync('data.json', JSON.stringify(json));
    });
});
