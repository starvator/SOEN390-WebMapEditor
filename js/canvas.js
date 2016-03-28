// Classes

//the id generator
var i=0;

var Node_ID = 0;
var SP_id = 0;

function Point(x,y,floor) {
    this.x = x;
    this.y = y;
    this.id=i;
    this.floorID = floor;
    i++;
}

function Edge(origin, destination) {
    this.origin = origin;
    this.destination = destination;
    this.toJSON = function() {
        return {
            startNode: this.origin.ID,
            endNode:this.destination.ID,
            distance:distance(this.origin, this.destination)
            };
    };
}

//TODO refactor and place in appropriate location later
//This class is for any Language Text pairing such as descriptions or titles
/** TO BE USED IN LATER STORY
function LanguageText() {
    this.pairs = [];
    this.addPair = function(lang, value){
        this.pairs.push({'language':lang, 'value':value});
    };
    this.toJSON = function() {
        return this.pairs;
    };
    this.getByLanguage = function(lang){
        for(var i = 0; i < this.pairs.length; i++)
        {
            if(this.pairs[i].language === lang)
            {
                return this.pairs[i].value;
            }
        }
    };
    this.setByLanguage = function(lang, value){
        for(var i = 0; i < this.pairs.length; i++)
        {
            if(this.pairs[i].language === lang)
            {
                this.pairs[i].value = value;
            }
        }
    };
}
**/

function IBeacon(uuid, major, minor) {
    this.uuid = uuid;
    this.major = major;
    this.minor = minor;
}

function Media(){
    this.image = [];
    this.video = [];
    this.audio = [];
    this.addMedia = function(file) {
        switch(file.type) {
            case "image":
                this.image.push(file);
                break;
            case "video":
                this.video.push(file);
                break;
            case "audio":
                this.audio.push(file);
                break;
            default:
                showErrorAlert('Something went wrong while adding your file (Type not recognized).');
                break;
        }
    };
}

function File(type) {
    this.type = type;
    this.path = "";
    this.language = "";
    this.caption = "";
}

function POI(point) {
    this.ID = Node_ID;
    Node_ID++;
    this.isSet = false;
    this.title = "";//new LanguageText('title');
    this.description = "";//new LanguageText('description');
    this.point = point;
    this.floorID = current_floor;
    this.ibeacon = new IBeacon("","","");
    //TODO: verify autotrigger toggle functionality
    this.media = new Media();
    this.storyPoint = [];
    this.isAutoOn = true;

    this.toJSON = function() {
        return {
            id: this.ID,
            title: this.title,
            description: this.description,
            x:this.point.x,
            y:this.point.y,
            floorID:this.floorID,
            iBeacon:this.ibeacon,
            media:this.media, //TODO
            storyPoint:this.storyPoint, //TODO
            autoOn:this.isAutoOn
        };
    };
}

function setCreatePOIid(){
    $("#"+active_id).removeClass("active");
    $("#editPOIButton").addClass("active");
    active_id = -2;
    hideInactiveStoryLines();
    highlightPOI(active_id);
    redraw();
}

function POT(point, label) {
    this.ID = Node_ID;
    Node_ID++;
    this.label = label;
    this.point = point;
    this.floorID = current_floor;
    this.storyline = active_id;


    this.toJSON = function() {
        return {
            id: this.ID,
            label: this.label, // TODO: make language text
            x:this.point.x,
            y:this.point.y,
            floorID:this.floorID
        };
    };
}

function FloorPlan() {
    this.floorID = 0;
    this.imagePath = "";
    this.imageWidth = 0;
    this.imageHeight = 0;
}

function Storyline(){
    this.ID = "";//gets defined in storylines.js
    this.title = "";//new LanguageText();
    this.description = "";//new LanguageText();
    this.path = [];
    this.thumbnail = "";
    this.walkingTimeInMinutes = ""; //TODO auto generate with math?
    this.floorsCovered = [];
}

function StoryPoint() {
    this.ID = SP_id;
    this.storylineID = active_id;
    this.title = "";//new LanguageText();
    this.description = "";//new LanguageText();
    this.media = new Media();
    SP_id++;
}

// End Classes

var NODE_SNAP_DIST_SQUARED = 400;   // Const distance to perform mouse to node distance checks, squared to optimize out expensive square root operations

var canvas;
var ctx;
var img;                            // The background floor image
var nodeEditingMode = false;        // True when in place node mode
var storylinesEditingMode = false;  // True when in editing storyline mode
var nodeList = [];                  // List of transition nodes to draw to the canvas
var POIList = [];
var POTList = [];
var mouseLocation = new Point(0,0); // Location of the mouse on the canvas
var mouseOnNode;                    // The node that the mouse is currently hovering over
var edgeList = [];                  // List of edges between transition points
var lastSelectedNode;               // During edge creation, the first selected node
var lastlastSelectedNode;           // During deleting an edge, we need to know 2 nodes to delete the edge between them
var nodeColor = "#660066";
var hlColor = "#009900";
var confirmedColor = "#0000FF";
var previousSelectedPoint = new Point(0,0); // Used to store the previous click location of the mouse so that we can cancel a move
var canDeleteEdge;                  // The index of the current selected edge in edgeList in edge delete mode, if it can be deleted
var POIID;

//For JSON use
var floorList = [];
var storylineList = [];

var hlPointList = [];
var hlEdgeList = [];

var POTtypes = {
    "none": 0x63,
    "ramp": 0x72,
    "stairs": 0x73,
    "elevator": 0x76,
    "washroom": 0x77,
    "exit": 0x78,
    "entrance": 0x6e,
    "emergency-exit": 0x6d
};

$(function(){
    canvas = document.getElementById('floorPlan');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    img = new Image();
    img.onload = function() {
        ctx.drawImage(img, -1000, -1000);
    };
    img.src = "floor_plans/floor3.svg";

    // Register events
    document.getElementsByTagName("BODY")[0].addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseClick, false);
    document.getElementsByTagName("BODY")[0].addEventListener('mouseup',mouseUp, false);
    canvas.addEventListener('contextmenu', mouseRightClick, false);

    trackTransforms(ctx);

    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);

    //detect a delete button press
    $('body').on('keydown', function() {
    var key = event.keyCode || event.charCode;

    //if backspace or delete key
    if( key == 8 || key == 46 || key == 13 ){
        if (current_node_tool ==="nodeDelete"){
			var nodeToDelete = lastSelectedNode;
			if(!nodeToDelete){
				bootbox.alert("Please select a node to delete first.", function() {
				});
				return false;
			}
			var result = false;
			bootbox.confirm("Deleting this point will delete all data associated with it, including edges and StoryPoint information. Are you sure you want to delete this point?", function(result) {
				if(!result){
					return;
				}
				else{
					deleteNode(nodeToDelete);
				}
				return result;
			});
        }// end of nodeDelete
        else if (current_node_tool==="edgeDelete"){
            if (canDeleteEdge){
                deleteEdge(canDeleteEdge);
            }
            return false;
        }// end of edgeDelete
    }
  });

    loadInitialFloor();
});

function changeIMGsource(source){
    img.src = source;
}

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

    drawEdges();

    // Draw all stored transition nodes on the map
    jQuery.each(nodeList,function(i,anode){
        drawNode(anode);
    });

    // When placing a node
    if(nodeEditingMode)
    {
        drawNodeEditingCursor();
    }
    if (storylinesEditingMode && !mouseOnNode){
        // Draw a temporary point at the cursor's location when over empty space and not creating an edge
        ctx.beginPath();
        ctx.fillStyle= nodeColor;
        ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
        ctx.fill();
    }
}

// A function to draw a node on the canvas
function drawNode(anode) {
    // If the node is not on the current floor, ignore it
    if(anode.floorID !== current_floor)
    {
        return true;
    }

    // If currently moving the current node, move it to the mouse location
    if(current_node_tool === "move" && lastSelectedNode === anode)
    {
        anode.point.x = mouseLocation.x;
        anode.point.y = mouseLocation.y;
    }

    // If we are in node editing mode, and a node has not already been found, check to see if the mouse is near the current node
    if((nodeEditingMode || storylinesEditingMode) && !mouseOnNode && NODE_SNAP_DIST_SQUARED > ((mouseLocation.x - anode.point.x) * (mouseLocation.x - anode.point.x) + (mouseLocation.y - anode.point.y) * (mouseLocation.y - anode.point.y)))
    {
        // If the mouse is near, set the node and change its colour
        mouseOnNode = anode;
        ctx.fillStyle=confirmedColor;
    }
    else
    {
        //Add condition to take into account storyline
        if(_.contains(hlPointList,anode.point))
        {
            ctx.fillStyle = hlColor;
        }
        else
        {
            ctx.fillStyle = nodeColor;
        }
    }

    // The last selected node during edge creation is a different colour
    if(anode === lastSelectedNode) {
        ctx.fillStyle=confirmedColor;
    }
    if (anode === lastlastSelectedNode && current_node_tool === "edgeDelete"){
        ctx.fillStyle=confirmedColor;
    }



    if(anode.label !== undefined && anode.label !== "none") {
        // Draw a background
        ctx.beginPath();
        ctx.fillStyle="#e6e6e6";
        ctx.arc(anode.point.x,anode.point.y,18,0,2*Math.PI);
        ctx.fill();


        // Draw the associated tool
        ctx.font = '20px souvlaki-font-1';
        ctx.fillStyle= nodeColor;
        ctx.fillText(String.fromCharCode(POTtypes[anode.label]), anode.point.x - 10,anode.point.y + 10);
    }
    else
    {
        // Draw a reglar point
        ctx.beginPath();
        ctx.arc(anode.point.x,anode.point.y,9,0,2*Math.PI);
        ctx.fill();
    }
}

// Functionality to draw a cursor on the map when in node editing mode
function drawNodeEditingCursor() {
    // Draw a temporary point at the cursor's location when over empty space and not creating an edge
    if(!lastSelectedNode && !mouseOnNode)
    {
        if(current_node_tool === "point")
        {
            if(current_tool === "none")
            {
                // Draw a point
                ctx.beginPath();
                ctx.fillStyle= nodeColor;
                ctx.arc(mouseLocation.x,mouseLocation.y,9,0,2*Math.PI);
                ctx.fill();
            }
            else
            {
                ctx.font = '20px souvlaki-font-1';
                ctx.fillStyle= nodeColor;
                // Draw the selected tool
                ctx.fillText(String.fromCharCode(POTtypes[current_tool]), mouseLocation.x - 10,mouseLocation.y + 10);
            }
        }
        else if(current_node_tool === "edge")
        {
            ctx.font = '20px Glyphicons Halflings';
            ctx.fillStyle= nodeColor;
            // Draw the selected tool
            ctx.fillText(String.fromCharCode(0xe096), mouseLocation.x - 10,mouseLocation.y + 10);
        }
        else if(current_node_tool === "move")
        {
            ctx.font = '20px Glyphicons Halflings';
            ctx.fillStyle= nodeColor;
            // Draw the selected tool
            ctx.fillText(String.fromCharCode(0xe068), mouseLocation.x - 10,mouseLocation.y + 10);
        }
        else if (current_node_tool ==="nodeDelete")
        {
            ctx.font = '20px Glyphicons Halflings';
            ctx.fillStyle= nodeColor;
            // Draw the selected tool
            ctx.fillText(String.fromCharCode(0xe083), mouseLocation.x - 10,mouseLocation.y + 10);
        }
        else if (current_node_tool ==="edgeDelete")
        {
            ctx.font = '20px Glyphicons Halflings';
            ctx.fillStyle= nodeColor;
            // Draw the selected tool
            ctx.fillText(String.fromCharCode(0xe014), mouseLocation.x - 10,mouseLocation.y + 10);
        }
    }
    // When creating an edge and the mouse is in empty space, create a line to the cursor with a temporary point
    else if(lastSelectedNode && !mouseOnNode && current_node_tool !== "nodeDelete" && current_node_tool !== "edgeDelete")
    {
        ctx.strokeStyle = confirmedColor;
        ctx.beginPath();
        ctx.moveTo(lastSelectedNode.point.x,lastSelectedNode.point.y);
        ctx.lineTo(mouseLocation.x,mouseLocation.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle=confirmedColor;
        ctx.arc(mouseLocation.x,mouseLocation.y,9,0,2*Math.PI);
        ctx.fill();
    }
    // When creating an edge and hovering on top of a node, draw a line to that node
    else if (lastSelectedNode && mouseOnNode && current_node_tool !== "nodeDelete" && current_node_tool !== "edgeDelete")
    {
        ctx.strokeStyle = confirmedColor;
        ctx.beginPath();
        ctx.moveTo(lastSelectedNode.point.x,lastSelectedNode.point.y);
        ctx.lineTo(mouseOnNode.point.x,mouseOnNode.point.y);
        ctx.stroke();
    }
    else if (lastSelectedNode && lastlastSelectedNode)
    {
        for (var val in edgeList){
            if ((edgeList[val].origin.point.id===lastlastSelectedNode.point.id && edgeList[val].destination.point.id===lastSelectedNode.point.id)||(edgeList[val].origin.point.id===lastSelectedNode.point.id && edgeList[val].destination.point.id===lastlastSelectedNode.point.id)) {
                ctx.strokeStyle = confirmedColor;
                ctx.beginPath();
                ctx.moveTo(lastlastSelectedNode.point.x,lastlastSelectedNode.point.y);
                ctx.lineTo(lastSelectedNode.point.x,lastSelectedNode.point.y);
                ctx.stroke();
                canDeleteEdge = val;
                return;
            }
        }
        canDeleteEdge = false;
    }
}

function drawEdges(){
    // Draw all the edges
    for(var e in edgeList){

        // If a node in the edge is not on the current floor, don't draw the edge
        if(edgeList[e].origin.floorID !== current_floor || edgeList[e].destination.floorID !== current_floor)
        {
            continue;
        }

        if(_.contains(hlEdgeList, edgeList[e]))
        {
            ctx.strokeStyle = hlColor;
        }
        else
        {
            ctx.strokeStyle = nodeColor;
        }

        ctx.beginPath();
        ctx.moveTo(edgeList[e].origin.point.x,edgeList[e].origin.point.y);
        ctx.lineTo(edgeList[e].destination.point.x,edgeList[e].destination.point.y);
        ctx.stroke();
    }
}

function canvasClick(x,y) {
    if(nodeEditingMode) {
        canvasClickNodeEditing(x,y);
    }
    else if (storylinesEditingMode && mouseOnNode){
        canvasClickStoryEditing();
    }
}

function canvasClickNodeEditing(x,y)
{
    // If clicking on empty space
    if(current_node_tool === "point" && !mouseOnNode && !lastSelectedNode) {
        // Store a new node in the list of transition nodes
        var point = new Point(x, y, current_floor);
		var pot = new POT(point, current_tool);
        nodeList.push(pot);
        POTList.push(pot);

    }
    // If clicking on a node and not yet starting an edge
    else if(current_node_tool === "edge" && mouseOnNode && !lastSelectedNode) {
        // Check the selected node has to possibility of connecting to another node
        if(canNodeConnect(mouseOnNode))
        {
            // Select this first node for edge creation
            lastSelectedNode = mouseOnNode;
        }
        else
        {
            showWarningAlert("The point you are creating a transition from cannot be connected to another point!");
        }
    }
    // If clicking on a second node to create an edge (cannot click on the same node or create an already existing edge)
    else if (current_node_tool === "edge" && mouseOnNode && lastSelectedNode && mouseOnNode !== lastSelectedNode && !nodesInEdges(mouseOnNode, lastSelectedNode)) {
        // Create a new edge
        edgeList.push(new Edge(lastSelectedNode, mouseOnNode));
        lastSelectedNode = null; // Clear the selected node
    }
    // On the first click start moving the node
    else if(current_node_tool === "move" && mouseOnNode && !lastSelectedNode)
    {
        previousSelectedPoint.x = mouseOnNode.point.x;
        previousSelectedPoint.y = mouseOnNode.point.y;
        lastSelectedNode = mouseOnNode;
    }
    // On the second click start moving the node
    else if(current_node_tool === "move" && lastSelectedNode)
    {
        lastSelectedNode = null;
    }
    else if(current_node_tool === "nodeDelete" && mouseOnNode)
    {
        lastSelectedNode = mouseOnNode;
    }
    else if (current_node_tool === "nodeDelete" && !mouseOnNode)
    {
        lastSelectedNode = null;
        redraw();
    }
    else if (current_node_tool === "edgeDelete" && mouseOnNode){
        if (!lastlastSelectedNode){
            lastlastSelectedNode = mouseOnNode;
        }
        else {
            lastSelectedNode = mouseOnNode;
        }
        redraw();
    }
    else if (current_node_tool === "edgeDelete" && !mouseOnNode)
    {
        lastlastSelectedNode = null;
        lastSelectedNode = null;
        redraw();
    }
}

function canvasClickStoryEditing()
{
    //*******NOTE: in the current form POI's cannot have multiple storylines associated to them. -JD
    //TODOTYLER: get the id of the current point of interest
    //alert(mouseOnNode.id);
    //TODOTYLER: get the id of the currently selected storyline
    //alert(active_id);

    // Cancel POI creation if the node is a POT that isn't labelled "none"
    if(mouseOnNode.label !== undefined && mouseOnNode.label !== "none")
    {
        showWarningAlert("Cannot create a storypoint or POI on a special Point of Transition");
        return false;
    }

    var found = false;
    //find point in list and fill editor
    if(POIList.length === 0){
        var newPOI = new POI(mouseOnNode.point);
		newPOI.ID = mouseOnNode.ID;
        newPOI.storyPoint = [];
        fillEditor(newPOI);
    }else{
        for(var val in POIList){
            if(POIList[val].point.id == mouseOnNode.point.id){
                    fillEditor(POIList[val]);
                    found = true;
            break;
            }
        }
        if(!found){
            var newPOI = new POI(mouseOnNode.point);
			newPOI.ID = mouseOnNode.ID;
            fillEditor(newPOI);
        }
    }
}

// Cancel any edge creation operations
function cancelOperations() {

    // If a node was being moved, move it back
    if(lastSelectedNode && current_node_tool === "move")
    {
        lastSelectedNode.x = previousSelectedPoint.x;
        lastSelectedNode.y = previousSelectedPoint.y;
    }
    else if (current_node_tool === "edgeDelete")
    {
        lastlastSelectedNode = null;
    }

    lastSelectedNode = null;
    redraw();
}

// Check to see if the set of nodes is in the current list of nodes
function nodesInEdges(a,b) {

    for (var i = 0; i < edgeList.length; i++) {
        if((edgeList[i].origin === a && edgeList[i].destination === b) || (edgeList[i].origin === b && edgeList[i].destination === a))
        {
            return true;
        }
    }

    return false;
}

// Check to see if there is a possibility to create an edge from a node
function canNodeConnect(a) {
    // Get a list of all the nodes, minus the current node a
    var allNodes = removeFromList(a, nodeList.slice());

    for(var i = 0; i < edgeList.length; i++)
    {
        // If the node is in an edge, remove the other node
        if(a === edgeList[i].origin)
        {
           allNodes = removeFromList(edgeList[i].destination, allNodes);
        }
        else if(a === edgeList[i].destination)
        {
           allNodes = removeFromList(edgeList[i].origin, allNodes);
        }
    }

    // If there are still nodes left, then we can make a connection
    return allNodes.length > 0;
}

function isNodePOT(node) {
    // Determine if the node is a POT
    for(var pot in POTList)
    {
        if(POTList[pot].point === node)
        {
            return POTList[pot];
        }
    }
}

// Remove the first element from a list
function removeFromList(ele, list)
{
    list = list.slice();

    for(var i = 0; i < list.length; i++)
    {
        if(list[i] === ele)
        {
            list.splice(i, 1);
            return list;
        }
    }
}

function highlightPOI(story){
    //resets highlight list
    hlPointList = [];
    for(var val in POIList){
        if (story===-2){
           hlPointList.push(POIList[val].point);
        }
        else {
            for(var p in POIList[val].storyPoint){
                if(POIList[val].storyPoint[p].storylineID == story){
                    hlPointList.push(POIList[val].point);
                    break;
                }
            }
        }
    }

    hlEdgeList = [];

    if(active_id >= 0)
    {
        // Map the list of IDs to a list of nodes
        var storyPoints = _.map(storylineList[active_id].path, function(pathID) { return _.find(nodeList, function(node) { return pathID === node.ID; }); });

        // Attempt to find the shortest path between each node
        for(var i = 0; i < storyPoints.length - 1; i++)
        {
            hlEdgeList = _.union(hlEdgeList, findShortestPath(storyPoints[i], storyPoints[i + 1]));
        }
    }
}

function deleteNode(node){
    var idOfNodePoint = node.point.id;
    var idOfNode = node.ID;
    //remove the node fromt the list
    nodeList = removeFromList(node, nodeList.slice());

    //delete all connecting edges
    for (var val=edgeList.length-1; val>=0;val--){
        if (edgeList[val].origin.point.id === idOfNodePoint || edgeList[val].destination.point.id === idOfNodePoint){
            edgeList = removeFromList(edgeList[val], edgeList.slice());
        }
    }

    //remove all POI and StoryPoints from the GUI
    for (var val=POIList.length-1; val>=0;val--){
        if (POIList[val].point.id === idOfNodePoint){
            //GUI
            for (var gui in POIList[val].storyPoint){
                $("#StorylinesList").find("#"+POIList[val].storyPoint[gui].ID+"_a").parent().remove();
            }
            //remove all POI
            POIList = removeFromList(POIList[val], POIList.slice());
        }
    }

    //remove all StoryPoints
    for (var storyLineVal in storylineList){
        //loop through the path
        for (var val= storylineList[storyLineVal].path.length-1;val>=0;val--){
            if (storylineList[storyLineVal].path[val] === idOfNode){
                //delete it from the list
                storylineList[storyLineVal].path = removeFromList(storylineList[storyLineVal].path[val], storylineList[storyLineVal].path.slice());
            }
        }
		//loop through the floorsCovered
		for (var val= storylineList[storyLineVal].floorsCovered.length-1;val>=0;val--){
            if (storylineList[storyLineVal].floorsCovered[val] === idOfNode){
                //delete it from the list
                storylineList[storyLineVal].floorsCovered = removeFromList(storylineList[storyLineVal].floorsCovered[val], storylineList[storyLineVal].floorsCovered.slice());
            }
        }
    }

    //remove all POT
    for (var val=POTList.length-1; val>=0;val--){
        if (POTList[val].point.id === idOfNodePoint){
           POTList = removeFromList(POTList[val], POTList.slice());
        }
    }

    //redraw
    lastSelectedNode = null;
    redraw();
}

function deleteStoryPoint(){
    var poiID = currentPOI.ID; //delete this from storyline[].path
    var storypointID = active_id;

    for (var val in POIList){
        if (POIList[val].ID === poiID){
            //remove from GUI
            $("#StorylinesList").find("#"+POIList[val].storyPoint[active_id].ID+"_a").parent().remove();

            //delete it in the POIList
            POIList[val].storyPoint = removeFromList(POIList[val].storyPoint[active_id], POIList[val].storyPoint.slice());
            break;
        }
    }

    //remove id from storyline
    for (var val in storylineList){
        if (storylineList[val].ID == active_id){
            for (var i in storylineList[val].path){
                if (storylineList[val].path[i] === POIID){
                    storylineList[val].path = removeFromList(storylineList[val].path[i], storylineList[val].path.slice());
                    break;
                }
            }
			for (var i in storylineList[val].floorsCovered){
                if (storylineList[val].floorsCovered[i] === POIID){
                    storylineList[val].floorsCovered = removeFromList(storylineList[val].floorsCovered[i], storylineList[val].floorsCovered.slice());
                    break;
                }
            }
        }
    }
    highlightPOI(active_id);
    redraw();
}

function deletePOI(){
    //remove POI from POIList
    for (var val in POIList){
        if (POIList[val].ID == POIID){
            //remove gui
            for (var gui in POIList[val].storyPoint){
                $("#StorylinesList").find("#"+POIList[val].storyPoint[gui].ID+"_a").parent().remove();
            }
            POIList = removeFromList(POIList[val], POIList.slice());

            //remove reference to id from storyline to the storypoint
            for (var i in storylineList){
                for (var j in storylineList[i].path){
                    if (storylineList[i].path[j] === POIID){
                        storylineList[i].path = removeFromList(storylineList[i].path[j], storylineList[i].path.slice());
                    }
                }
				for (var j in storylineList[i].floorCovered){
                    if (storylineList[i].floorCovered[j] === POIID){
                        storylineList[i].floorCovered = removeFromList(storylineList[i].floorCovered[j], storylineList[i].floorCovered.slice());
                    }
                }
            }
            break;
        }
    }
    highlightPOI(active_id);
    redraw();
}

function deleteEdge(val){
    edgeList = removeFromList(edgeList[val], edgeList.slice());
    canDeleteEdge = null;
    lastSelectedNode = null;
    lastlastSelectedNode = null;
    redraw();
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

    // Realign the canvas' transform
    trackTransforms(ctx);
}

//resize the canvas whenever its container is resized.
$(window).on('resize', function(){
    resizeCanvas();
    redraw();
});
