var socket = io();
var g,n,my_col,myp5;
var w = window.innerWidth-25;
var h = window.innerHeight-25;

var s = function( p ) { 
    var clear_b, toggle_b,canvas;
    var Esize = 18;

    p.setup = function() {
        my_col = {R: p.random(255), G: p.random(255), B:p.random(255)};
        socket.emit('start', {name: n, col:my_col});
    }

    socket.on('join',function(data){
        canvas = p.createCanvas(data.width,data.height);
        p.background(61);
        p.strokeWeight(5);
    });

    var singleTouch = true;
    var draw_t = true;

    $(function() {
        $('body').on('touchstart touchmove', function (e) {
            console.log(e.touches.length);
            if (e.touches.length > 1){
                singleTouch = false;
            }else{
                singleTouch = true;
                e.preventDefault();
            }
        });
    });

    p.touchMoved = function(){
        if(singleTouch){
        if(draw_t){
            var mx = p.mouseX  / w;
            var my = p.mouseY  / h;
            var px = p.pmouseX / w;
            var py = p.pmouseY / h;
            var pos = [mx,my,px,py];
            p.stroke(my_col.R,my_col.G,my_col.B);
            p.line(p.mouseX,p.mouseY,p.pmouseX,p.pmouseY);
            socket.emit('draw',{type:'line',pos:pos,col: my_col,game:g});
        }else{
            var mx = p.mouseX  / w;
            var my = p.mouseY  / h;
            var pos = [mx,my];
            p.noStroke();
            p.fill(61);
            p.ellipse(p.mouseX,p.mouseY,50,50);
            socket.emit('draw',{type:'erase',pos:pos,col: my_col,game:g});
        }
        }
    }

    function clr_emit(){
        socket.emit('clear',{game:g});
    }

    function toggle(){
        if(draw_t){
            draw_t = false;
            toggle_b.html('Draw');
        }else{
            draw_t = true;
            toggle_b.html('Eraser');
        }
    }

    socket.on('other_draw', function (data) {
        if(data.game == g){
            if(data.type === 'line'){
                p.stroke(data.col.R,data.col.G,data.col.B);
                p.line(data.pos[0]*w,data.pos[1]*h,data.pos[2]*w,data.pos[3]*h);
            }else{
                p.noStroke();
                p.fill(61);
                p.ellipse(data.pos[0]*w,data.pos[1]*h,50,50);
            }
        }
    });

    socket.on('clr',function(data){
        if(data.game == g){
            p.background(61);
        }
    });

    p.makebuttons = function(){
        clear_b = p.createButton('Clear');
        toggle_b = p.createButton('Eraser');
        clear_b.mousePressed(clr_emit);
        toggle_b.mousePressed(toggle);
    }
};

socket.on('userUpdate',function(data){
    if(data.game == g){
        $('#users').html('Users:');
        data.users.forEach(user => $('#users').append("<li style='color: rgb("
            +Math.floor(user.col.R)+", "
            +Math.floor(user.col.G)+", "
            +Math.floor(user.col.B)+")'>"+user.name+"</li>"));
    }
});

function play() {
    g = $('#game').val();
    n = $('#name').val();
    if(!n){
        n = "Anon";
    }
    if(g != ""){
        socket.emit('left',{game:g});
        socket.emit('init',{game:g,w:w,h:h});
        if(myp5){
            myp5.setup();
        }else{
            myp5 = new p5(s);
            myp5.makebuttons();
        }
    }
}




