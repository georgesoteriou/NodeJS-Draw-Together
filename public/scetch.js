var socket = io();
var my_col

function setup(){
	createCanvas(windowWidth-25,windowHeight-25);
	background(61);
    	my_col = {R: random(255), G: random(255), B:random(255)}
    	button = createButton('Clear');
    	button.mousePressed(clr_emit);
    	noStroke();
}

function mouseDragged() {
	var xPos = mouseX/width;
	var yPos = mouseY/height;
	fill(my_col.R,my_col.G,my_col.B);
	ellipse(mouseX,mouseY,10,10);
	socket.emit('ellipse',{X:xPos,Y:yPos,col: my_col});
}

function clr_emit(){
    	socket.emit('clear');
}

socket.on('clr',function(){
    	background(61);
});

socket.on('other_ellipse', function (data) {
	fill(data.col.R,data.col.G,data.col.B);
	ellipse(data.X*width,data.Y*height,10,10);
});
