var jsonMap;

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
        node:{'poi':POIList, 'pot':[]},
        edge:edgeList,
        storyline:storylineList
        });
}

function loadFromJSON() {
    floorList = jsonMap.floorPlan;
    POIList = jsonMap.node.poi;
    POTList = jsonMap.node.pot;
    edgeList = jsonMap.edge;
    storylineList = jsonMap.storyline;
    
    jQuery.each(POIList, function(i, poi) {
        nodeList.push(new Point(poi.x, poi.y));
    });
    jQuery.each(POTList, function(i, pot) {
        nodeList.push(new Point(pot.x, pot.y));
    });
    jQuery.each(edgeList, function(i, edge) {
        nodeList.push(edge.startNode);
        nodeList.push(edge.endNode);
    });
    
    //TODO: remove duplicates?
}

$(document).on('change', '.btn-file :file', function() {
    var input = $(this);
    input.trigger('fileselect', [input.get(0).files[0]]);
})

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, file) {
        if(!file) {
            //TODO: custom file read alert
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            jsonMap = JSON.parse(contents);
            loadFromJSON();
            redraw();
            //refresh menu
            
        };
        reader.readAsText(file);
    });
});