// Classes

function Point(x,y) {
	this.x = x;
	this.y = y;
}


// End Classes


var canvas;
var ctx;
var img;							// The background floor image
var placingNodes = false;			// True when in place node mode
var nodeList = [];					// List of transition nodes to draw to the canvas
var mouseLocation = new Point(0,0);	// Location of the mouse on the canvas

$(function(){
	canvas = document.getElementById('floorPlan');
	ctx = canvas.getContext('2d');

	img = new Image();
	img.onload = function() {
		ctx.drawImage(img, -1000, -1000);
	}
	img.src = "floor_plans/floor3.svg";
	
	// Register events
	document.getElementsByTagName("BODY")[0].addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mousedown', mouseClick, false);
});

// Main canvas drawing method
function redraw() {	
	// Clear the canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	// Draw the background image
	ctx.drawImage(img, -1000, -1000);
	
	// Draw all stored transition nodes on the map
	jQuery.each(nodeList,function(i,anode){
		ctx.beginPath();
		ctx.fillStyle="#FFFF00";
		ctx.arc(anode.x,anode.y,7,0,2*Math.PI);
		ctx.fill();
	});
	
	// When placing a node, draw temporary node at the cursor's location
	if(placingNodes)
	{
		ctx.beginPath();
		ctx.fillStyle="#FF0000";
		ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
		ctx.fill();
	}	
}

function mouseMove(evt) {
	if(placingNodes)
	{
		// Store the location of the mouse relative to the canvas
		mouseLocation.x = evt.pageX - $(canvas).offset().left;
		mouseLocation.y = evt.pageY - $(canvas).offset().top;
		
		redraw();
	}	
}

function mouseClick(evt) {
	if(placingNodes) {
		var x = evt.pageX - $(canvas).offset().left;
		var y = evt.pageY - $(canvas).offset().top;
		
		// Store a new node in the list of transition nodes
		nodeList.push(new Point(x, y));
	}
}