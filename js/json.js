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
    POIList = jsonMap.poi;
    POTList = jsonMap.pot;
    edgeList = jsonMap.edge;
    storylineList = jsonMap.storyline;
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
        };
        reader.readAsText(file);
    });
});