// Classes

//the id generator
var i=0;

var POI_id = 0;
var POT_id = 0;
var SP_id = 0;

function Point(x,y) {
    this.x = x;
    this.y = y;
    this.id=i;
    i++;
}

function Edge(origin, destination) {
    this.origin = origin;
    this.destination = destination;
    this.toJSON = function() {
    //TODO: finish and add appropriate methods
        return {
            startNode: this.origin,
            endNode:this.destination,
            floorNumber:'TODO to be retrieved',
            distance:distance(this.origin, this.destination)
            };
    };
}

//TODO refactor and place in appropriate location later
//This class is for any Language Text pairing such as descriptions or titles
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
                alert('Something went wrong while adding your file (Type not recognized).');
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
    this.ID = POI_id;
    POI_id++;
    this.isSet = false;
    this.title = new LanguageText('title');
    this.description = new LanguageText('description');
    this.point = point;
    this.floorID = current_floor;
    this.ibeacon = "";
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
    active_id = -2;
    redraw();
}

function POT(point) {
    this.ID = POT_id; //TODO GENERATED appropriately
    POT_id++;
    this.label = new LanguageText();//<ramp or stairs or elevator or intersection or washroom or exit or entrance or emergency exit>
    this.point = point;
    this.floorID = current_floor;
    //I think these two are needed
    this.storyline = active_id;
    storylineList[storyline].floorsCovered.push(this.floorID);

    //TODO
    this.toJSON = function() {
        return {
            id: this.ID,
            label: this.label,
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
    this.title = new LanguageText();
    this.description = new LanguageText();
    this.path = [];
    this.thumbnail = "";
    this.walkingTimeInMinutes = ""; //TODO auto generate with math?
    this.floorsCovered = [];
}

function StoryPoint() {
    this.ID = SP_id;
    this.storylineID = active_id;
    this.title = new LanguageText();
    this.description = new LanguageText();
    this.media = new Media();
    SP_id++;
}

// End Classes

var NODE_SNAP_DIST_SQUARED = 100;   // Const distance to perform mouse to node distance checks, squared to optimize out expensive square root operations

var canvas;
var ctx;
var img;                            // The background floor image
var nodeEditingMode = false;        // True when in place node mode
var storylinesEditingMode = false;  // True when in editing storyline mode
var nodeList = [];                  // List of transition nodes to draw to the canvas
var POIList = [];
var mouseLocation = new Point(0,0); // Location of the mouse on the canvas
var mouseOnNode;                    // The node that the mouse is currently hovering over
var edgeList = [];                  // List of edges between transition points
var lastSelectedNode;               // During edge creation, the first selected node
var nodeColor = "#660066";
var hlColor = "#009900";
var confirmedColor = "#0000FF";

//For JSON use
var floorList = [];
var pointList = [];
var storylineList = [];
var hlPointList = [];

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

        // If we are in node editing mode, and a node has not already been found, check to see if the mouse is near the current node
        if((nodeEditingMode || storylinesEditingMode) && !mouseOnNode && NODE_SNAP_DIST_SQUARED > ((mouseLocation.x - anode.x) * (mouseLocation.x - anode.x) + (mouseLocation.y - anode.y) * (mouseLocation.y - anode.y)))
        {
            // If the mouse is near, set the node and change its colour
            mouseOnNode = anode;
            ctx.fillStyle=confirmedColor;
        }
        else
        {
            //Add condition to take into account storyline
            ctx.fillStyle= nodeColor;
            for (var val in hlPointList){
                if (anode.id === hlPointList[val].id){
                    ctx.fillStyle = hlColor;
                }
            }
        }

        // The last selected node during edge creation is a different colour
        if(anode === lastSelectedNode) {
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
            var pointsTrue = 0;
            for(var val in hlPointList){
                if(hlPointList[val].id === lastSelectedNode.id){
                    pointsTrue++;
                }
                if(hlPointList[val].id === mouseOnNode.id){
                    pointsTrue++;
                }
                if(pointsTrue === 2){
                    ctx.strokeStyle = hlColor;
                }
                else{
                    ctx.strokeStyle = confirmedColor;
                }
            }
            ctx.beginPath();
            ctx.moveTo(lastSelectedNode.x,lastSelectedNode.y);
            ctx.lineTo(mouseOnNode.x,mouseOnNode.y);
            ctx.stroke();
        }
    }
    if (storylinesEditingMode && !mouseOnNode){
        // Draw a temporary point at the cursor's location when over empty space and not creating an edge
        ctx.beginPath();
        ctx.fillStyle= nodeColor;
        ctx.arc(mouseLocation.x,mouseLocation.y,7,0,2*Math.PI);
        ctx.fill();
    }
}

function drawEdges(){
    // Draw all the edges
    for(var e in edgeList){
        if(_.contains(hlPointList, edgeList[e].origin)){
            if(_.contains(hlPointList, edgeList[e].destination)){
                ctx.strokeStyle = hlColor;
            }
            else{
                ctx.strokeStyle = nodeColor;
            }
        }
        else{
            ctx.strokeStyle = nodeColor;
        }
        ctx.beginPath();
        ctx.moveTo(edgeList[e].origin.x,edgeList[e].origin.y);
        ctx.lineTo(edgeList[e].destination.x,edgeList[e].destination.y);
        ctx.stroke();
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
        else if (mouseOnNode && lastSelectedNode && mouseOnNode !== lastSelectedNode && !nodesInEdges(mouseOnNode, lastSelectedNode)) {
            // Create a new edge
            edgeList.push(new Edge(lastSelectedNode, mouseOnNode));
            lastSelectedNode = null; // Clear the selected node
        }
    }
    else if (storylinesEditingMode && mouseOnNode){
    //*******NOTE: in the current form POI's cannot have multiple storylines associated to them. -JD
        //TODOTYLER: get the id of the current point of interest
        //alert(mouseOnNode.id);
        //TODOTYLER: get the id of the currently selected storyline
        //alert(active_id);
        var found = false;
        //find point in list and fill editor
        if(POIList.length === 0){
            var newPOI = new POI(mouseOnNode);
            newPOI.storyPoint = [];
            fillEditor(newPOI);
        }else{
            for(var val in POIList){
                if(POIList[val].point.id === mouseOnNode.id){
                        fillEditor(POIList[val]);
                        found = true;
                break;
                }
            }
            if(!found){
                var newPOI = new POI(mouseOnNode);
                fillEditor(newPOI);
            }
        }
    }
}

// Cancel any edge creation operations
function cancelOperations() {
    lastSelectedNode = null;
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
        for(var p in POIList[val].storyPoint){
            if(POIList[val].storyPoint[p].storylineID === story){
                hlPointList.push(POIList[val].point);
                break;
            }
        }
    }
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