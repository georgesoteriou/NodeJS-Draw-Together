var socket = io();
var my_col
var Esize = 18;

function setup(){
	createCanvas(windowWidth-25,windowHeight-25);
	background(61);
    my_col = {R: random(255), G: random(255), B:random(255)}
    strokeWeight(8);
    button = createButton('Clear');
    button.mousePressed(clr_emit);
}
var singleTouch = true;
$(function() {
    $('body').on('touchstart', function (e) {
        console.log(e.touches.length);
        if (e.touches.length > 1){
            singleTouch = false;
            $(this).css("overflow", "auto");
        }else{
            singleTouch = true;
            $(this).css("overflow", "hidden");
        }
    });
});
function touchMoved(){
    if(singleTouch){
	    var mx = mouseX  / width;
	    var my = mouseY  / height;
        var px = pmouseX / width;
        var py = pmouseY / height;
        var pos = [mx,my,px,py];
	    stroke(my_col.R,my_col.G,my_col.B);
	    line(mouseX,mouseY,pmouseX,pmouseY);
	    socket.emit('lines',{pos:pos,col: my_col});
    }
}

function clr_emit(){
    	socket.emit('clear');
}

socket.on('clr',function(){
    	background(61);
});

socket.on('other_lines', function (data) {
	stroke(
        data.col.R,
        data.col.G,
        data.col.B
    );
	line(
        data.pos[0]*width,
        data.pos[1]*height,
        data.pos[2]*width,
        data.pos[3]*height
    );
});
