// Classes

function Point(x,y) {
	this.x = x;
	this.y = y;
}


// End Classes


var canvas;
var ctx;
var img;							// The background floor image
var nodeDrawMode;					// True when in draw mode
var mouseLocation = new Point(0,0);	// Location of the mouse on the canvas

$(function(){
	canvas = document.getElementById('floorPlan');
	ctx = canvas.getContext('2d');

	img = new Image();
	img.onload = function() {
		ctx.drawImage(img, -1000, -1000);
	}
	img.src = "floor_plans/floor3.svg";
	
	document.getElementsByTagName("BODY")[0].addEventListener('mousemove', mouseMove, false);
});

// Main canvas drawing method
function redraw() {	
	// Clear the canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	// Draw the background image
	ctx.drawImage(img, -1000, -1000);
	
	if(nodeDrawMode)
	{
		ctx.beginPath();
		ctx.fillStyle="#FF0000";
		ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
		ctx.fill();
	}
}

function mouseMove(evt) {
	if(nodeDrawMode)
	{
		// Store the location of the mouse relative to the canvas
		mouseLocation.x = evt.pageX - $(canvas).offset().left;
		mouseLocation.y = evt.pageY - $(canvas).offset().top;
		
		redraw();
	}	
}