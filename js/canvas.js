// Classes

function Point(x,y) {
	this.x = x;
	this.y = y;
}

function Edge(origin, destination) {
	this.origin = origin;
	this.destination = destination;
}

//A StoryPoint is a point that also contains HTML text
function StoryPoint(point) {
	this.text = "";
	this.point = point;
	this.updateDescription = function(text){
		this.text=text;
	}
}

// End Classes

var NODE_SNAP_DIST_SQUARED = 100;   // Const distance to perform mouse to node distance checks, squared to optimize out expensive square root operations

var canvas;
var ctx;
var img;							// The background floor image
var nodeEditingMode = false;		// True when in place node mode
var nodeList = [];					// List of transition nodes to draw to the canvas
var mouseLocation = new Point(0,0);	// Location of the mouse on the canvas
var mouseOnNode;					// The node that the mouse is currently hovering over
var edgeList = [];					// List of edges between transition points
var lastSelectedNode;				// During edge creation, the first selected node
var nodeColor = "#808080";
var confirmedColor = "#0000FF"; 

$(function(){
	canvas = document.getElementById('floorPlan');
	ctx = canvas.getContext('2d');
	resizeCanvas();
	
	img = new Image();
	img.onload = function() {
		ctx.drawImage(img, -1000, -1000);
	}
	img.src = "floor_plans/floor3.svg";
	
	// Register events
	document.getElementsByTagName("BODY")[0].addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mousedown', mouseClick, false);
	document.getElementsByTagName("BODY")[0].addEventListener('mouseup',mouseUp, false);
	
	trackTransforms(ctx);
				
	canvas.addEventListener('DOMMouseScroll',handleScroll,false);
	canvas.addEventListener('mousewheel',handleScroll,false);
});

// Main canvas drawing method
function redraw() {	
	// Clear the canvas
	var p1 = ctx.transformedPoint(0,0);
	var p2 = ctx.transformedPoint(canvas.width,canvas.height);
	ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
	
	// Draw the background image
	ctx.drawImage(img, -1000, -1000);
	
	// Clear the currently stored node
	mouseOnNode = null;
	
	// Set line styles
	ctx.strokeStyle = nodeColor;
	ctx.lineWidth = 5;
	
	// Draw all the edges
	jQuery.each(edgeList,function(i,anedge){
		ctx.beginPath();
		ctx.moveTo(anedge.origin.x,anedge.origin.y);
		ctx.lineTo(anedge.destination.x,anedge.destination.y);
		ctx.stroke();
	});
	
	// Draw all stored transition nodes on the map
	jQuery.each(nodeList,function(i,anode){

		// If we are in node editing mode, and a node has not already been found, check to see if the mouse is near the current node
		if(nodeEditingMode && !mouseOnNode && NODE_SNAP_DIST_SQUARED > ((mouseLocation.x - anode.x) * (mouseLocation.x - anode.x) + (mouseLocation.y - anode.y) * (mouseLocation.y - anode.y)))
		{
			// If the mouse is near, set the node and change its colour
			mouseOnNode = anode;
			ctx.fillStyle=confirmedColor;
		}
		else
		{
			ctx.fillStyle= nodeColor;
		}
	
		// The last selected node during edge creation is a different colour
		if(anode == lastSelectedNode) {
			ctx.fillStyle=confirmedColor;
		}
	
		// Draw a point
		ctx.beginPath();
		ctx.arc(anode.x,anode.y,7,0,2*Math.PI);
		ctx.fill();
	});	
	
	// When placing a node
	if(nodeEditingMode)
	{
		// Draw a temporary point at the cursor's location when over empty space and not creating an edge
		if(!lastSelectedNode && !mouseOnNode)
		{
			ctx.beginPath();
			ctx.fillStyle= nodeColor;
			ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
			ctx.fill();
		}
		// When creating an edge and the mouse is in empty space, create a line to the cursor with a temporary point
		else if(lastSelectedNode && !mouseOnNode)
		{
			ctx.strokeStyle = confirmedColor;
			ctx.beginPath();
			ctx.moveTo(lastSelectedNode.x,lastSelectedNode.y);
			ctx.lineTo(mouseLocation.x,mouseLocation.y);
			ctx.stroke();
		
			ctx.beginPath();
			ctx.fillStyle=confirmedColor;
			ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
			ctx.fill();
		}
		// When creating an edge and hovering on top of a node, draw a line to that node
		else if (lastSelectedNode && mouseOnNode)
		{
			ctx.strokeStyle = confirmedColor;
			ctx.beginPath();
			ctx.moveTo(lastSelectedNode.x,lastSelectedNode.y);
			ctx.lineTo(mouseOnNode.x,mouseOnNode.y);
			ctx.stroke();
		}
	}	
}

function canvasClick(x,y) {
	if(nodeEditingMode) {
		
		// If clicking on empty space
		if(!mouseOnNode && !lastSelectedNode) {			
			// Store a new node in the list of transition nodes
			nodeList.push(new Point(x, y));
		}
		// If clicking on a node and not yet starting an edge
		else if(mouseOnNode && !lastSelectedNode) {
			// Select this first node for edge creation
			lastSelectedNode = mouseOnNode;	
		} 
		// If clicking on a second node to create an edge (cannot click on the same node or create an already existing edge)
		else if (mouseOnNode && lastSelectedNode && mouseOnNode != lastSelectedNode && !nodesInEdges(mouseOnNode, lastSelectedNode)) {
			// Create a new edge
			edgeList.push(new Edge(lastSelectedNode, mouseOnNode));
			lastSelectedNode = null; // Clear the selected node
		}
	}
}

// Check to see if the set of nodes is in the current list of nodes
function nodesInEdges(a,b) {
	
	for (var i = 0; i < edgeList.length; i++) {
		if((edgeList[i].origin == a && edgeList[i].destination == b) || (edgeList[i].origin == b && edgeList[i].destination == a))
		{	
			return true;
		}
	}
	
	return false;
}

function resizeCanvas(){
	var con = $("#floorPlanContainer");
	if(con.width() > con.height()) {
		canvas.width = con.width();
		canvas.height = con.width();
	} else {
		canvas.width = con.height();
		canvas.height = con.height();
	}
}

//resize the canvas whenever its container is resized.
$(window).on('resize', function(){
	resizeCanvas();
	redraw();
});