var socket = io();
var my_col

function setup(){
	createCanvas(800,800);
	background(61);
    my_col = {R: random(255), G: random(255), B:random(255)}
    button = createButton('clear');
    button.mousePressed(clr_emit);
    noStroke();
}

function draw(){
	if (mouseIsPressed) {
		fill(my_col.R,my_col.G,my_col.B);
		ellipse(mouseX,mouseY,10,10);
		socket.emit('ellipse',{X:mouseX,Y:mouseY,col: my_col});
	}
}

function clr_emit(){
    socket.emit('clear');
}

function clr_on(){
    background(61);
}

socket.on('clr',clr_on);

socket.on('other_ellipse', function (data) {
	fill(data.col.R,data.col.G,data.col.B);
	ellipse(data.X,data.Y,10,10);
});
