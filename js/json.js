var jsonMap;

function confirmSave(){
    if(floorList.length == 0){
        bootbox.alert("Please create a map first, or import your work from a previous session.", function() {
        });
        return;
    }
    var saveButton = $('#JSONsave');
    var hasFloor = false;
    for (var val=0; floorList.length>val;val++){
        try {
            if (floorList[val].floorID != null){
                hasFloor = true;
                break;
            }
        }
        catch(err){
        }
    }
    if(!hasFloor){
        bootbox.alert("An empty project cannot be saved. Please create a floor or import a floor plan", function() {
        });
        return false;
    }
    
    if((edgeList.length == 0)){
        bootbox.alert("A project must contain at least two nodes and one edge in order to be valid. Please review your map.", function() {
        });
        return false;
    }
    //check if the graph is valid
    for(var n=0; nodeList.length>n;n++){
        var idOfNode = nodeList[n].point.id;
        var hasEdge = false;
        forEachEdge:
        for (var val in edgeList){
            if ((idOfNode != edgeList[val].origin.point.id) && (idOfNode != edgeList[val].destination.point.id)){
            }
            else{
                hasEdge = true;
                break forEachEdge;
            }
        }
        if(!hasEdge){
            bootbox.alert("Whoops! One of your points isn't connected. Please review your map before saving.", function() {
            });
            return false;
        }
    }
    var result = false;
    bootbox.confirm("Please confirm that you have reviewed your Storylines before saving:", function(result) {
    saveButton.show("Confirm result: "+result);
    if(result == true){
        var name = "mapData";
        
        bootbox.prompt({
          title: "Please name the export file:",
          value: "mapData",
          callback: function(result) {
            if (result === null) {
                bootbox.alert("You have not saved the map data.", function() {
                });
            } else {
            name = result.concat(".json");
            download(name,createJSON());
            }
          }
        });
    }
    else {
        bootbox.alert("You have not saved the map data.", function() {
        saveButton.show("cancel");
        }); 
    }
    }); 
}

function createJSON() {
    /*
    JSON File Outline, as specified and agreed upon by team leaders
        floorplan
        node
            poi
            pot
        edge
        storyline
    */
    return JSON.stringify({
        floorPlan:floorList,
        node:{'poi':POIList, 'pot':POTList},
        edge:edgeList,
        storyline:storylineList
        });
}

function loadFromJSON() {
    $("#deletecurrentfloor").show();

    floorList = [];
    storylineList = [];
    POIList = [];
    POTList = [];
    nodeList = [];
    edgeList = [];

    //floorList
    $.each(jsonMap.floorPlan, function(i, fp) {
        if(fp !== null) {
            floorList[eval(fp.floorID)] = (FloorPlan.fromJSON(fp));
        }
    });
    //remove the path from the url of the floorplan
    for (var val in floorList){
        var tempPath = floorList[val].imagePath.split("/");
        floorList[val].imagePath = tempPath[tempPath.length-1];
    }

    //storylineList
    $.each(jsonMap.storyline, function(i, sl) {
        if(sl !== null) {
            storylineList.push(Storyline.fromJSON(sl));
        }
    });
    
    //POI
    $.each(jsonMap.node.poi, function(i, poi) {
        if(poi !== null) {
            POIList.push(POI.fromJSON(poi));
        }
    });
     
    //POT
    $.each(jsonMap.node.pot, function(i, pot) {
        if(pot !== null) {
            POTList.push(POT.fromJSON(pot));
        }
    });
       
    //edgeList
    $.each(jsonMap.edge, function(i, e) {
        if(e !== null) {
            edgeList.push(Edge.fromJSON(e));
        }
    });
}

// Atomic from-JSON Constructors for Each Class

FloorPlan.fromJSON = function(json) {

    var fp = new FloorPlan();
    fp.floorID = parseInt(json.floorID);
    fp.imagePath = json.imagePath;
    fp.imageWidth = json.imageWidth;
    fp.imageHeight = json.imageHeight;
    
    return fp;
};

StoryPoint.fromJSON = function(json) {

    var sp = new StoryPoint();
    sp.storylineID = parseInt(json.storylineID);
    sp.title = LanguageText.fromJSON(json.title, "title");
    sp.description = LanguageText.fromJSON(json.description, "description");
    sp.media = json.media;
    
    return sp;
};

POI.fromJSON = function(json) {

    var ppp = new Point(json.x, json.y, json.floorID);
    var poi = new POI(ppp);
    poi.ID = parseInt(json.id);

    poi.title = LanguageText.fromJSON(json.title, "title");
    poi.description = LanguageText.fromJSON(json.description, "description");
    poi.floorID = parseInt(json.floorID);
    poi.ibeacon = IBeacon.fromJSON(json.ibeacon);
    poi.media = json.media;
	poi.isSet = true;
    
    $.each(json.storyPoint, function(i, sp) {
        poi.storyPoint.push(StoryPoint.fromJSON(sp));
    });
    
    nodeList.push(poi);
    
    return poi;
};

POT.fromJSON = function(json) {

    var ppp = new Point(json.x, json.y, json.floorID);
    var pot = new POT(ppp);
    pot.ID = parseInt(json.id);
    pot.label = json.label.toLowerCase();
    pot.floorID = parseInt(json.floorID); 
    
    nodeList.push(pot);
    
    return pot;
};

Edge.fromJSON = function(json) {

    var start = findNodeByID(json.startNode);
    var end = findNodeByID(json.endNode);

    var e = new Edge(start, end);
    
    return e;
};

IBeacon.fromJSON = function(json) {
    
    var ib = new IBeacon(json.uuid, json.major, json.minor);
  
    return ib;
};

function findNodeByID(id){
    var found;
    $.each(POIList, function(i, poi) {
       if(poi.ID === id){
           found = poi;
       } 
    });
    
    $.each(POTList, function(i, pot) {
       if(pot.ID === id){
           found = pot;
       } 
    });
    
    return found;
}

Storyline.fromJSON = function(json) {

    var s = new Storyline();
	if(parseInt(json.id) !== undefined)
		s.ID = parseInt(json.id);
	else if(parseInt(json.ID) !== undefined){
		s.ID = parseInt(json.ID);
	}
    s.title = LanguageText.fromJSON(json.title, "title");
    s.description = LanguageText.fromJSON(json.description, "description");
    s.path = json.path;
    s.thumbnail = json.thumbnail;
    s.walkingTimeInMinutes = json.walkingTimeInMinutes;
    s.floorsCovered = json.floorsCovered;
    
    return s;
};

LanguageText.fromJSON = function(json, type) {

    var lt = new LanguageText();
	if(type === "title"){
		$.each(json, function(i, pair) {
			lt.addPair(pair.language, pair.title);
		});
	}else if (type === "description") {
		$.each(json, function(i, pair) {
			lt.addPair(pair.language, pair.description);
		});		
	}
    return lt;
};


$(document).on('change', '.btn-file :file', function() {
    var input = $(this);
    input.trigger('fileselect', [input.get(0).files[0]]);
})

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, file) {
        if(!file) {
            showErrorAlert("There was a problem with your file. Please try again.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            jsonMap = JSON.parse(contents);
            loadFromJSON();
            redraw();
            buildStorylineMenuFromList();
            loadFloorsFromList();
        };
        reader.readAsText(file);
    });
});