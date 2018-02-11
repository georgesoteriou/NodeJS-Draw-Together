
var socket = io();
var my_col, toggle_b;
var Esize = 18;

function setup(){
    createCanvas(windowWidth-25,windowHeight-25);
    background(61);
    my_col = {R: random(255), G: random(255), B:random(255)}
    strokeWeight(8);
    clear_b = createButton('Clear');
    clear_b.mousePressed(clr_emit);
    toggle_b = createButton('Eraser');
    toggle_b.mousePressed(toggle);
    socket.emit('start');
}
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

function touchMoved(){
    if(singleTouch){
	if(draw_t){
	    var mx = mouseX  / width;
	    var my = mouseY  / height;
            var px = pmouseX / width;
            var py = pmouseY / height;
            var pos = [mx,my,px,py];
	    stroke(my_col.R,my_col.G,my_col.B);
	    line(mouseX,mouseY,pmouseX,pmouseY);
	    socket.emit('draw',{type:'line',pos:pos,col: my_col});
	}else{
	    var mx = mouseX  / width;
	    var my = mouseY  / height;
        var pos = [mx,my];
	    noStroke();
	    fill(61);
	    ellipse(mouseX,mouseY,50,50);
	    socket.emit('draw',{type:'erase',pos:pos,col: my_col});
	}
    }
}

function clr_emit(){
    	socket.emit('clear');
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
        if(data.type === 'line'){
	    	stroke(data.col.R,data.col.G,data.col.B);
	    	line(data.pos[0]*width,data.pos[1]*height,data.pos[2]*width,data.pos[3]*height);
	    }else{
		    noStroke();
		    fill(61);
		    ellipse(data.pos[0]*width,data.pos[1]*height,50,50);
	    }
    });
    socket.on('clr',function(){
            background(61);
    });

