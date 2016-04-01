var floorList = [];
var current_floor = 0;

$(function(){
    $("#deletecurrentfloor").hide();
    //handle the new floor submit
    $('#newFloorAddButton').click(function () {
        //if no floor number
        if (!$("#floorNumUpload").val()){
            showErrorAlert("You must enter a floor number.");
            return false;
        }
        if ($("#floorNumUpload").val()<0){
            showErrorAlert("Floor numbers must be greater than or equal to 0.");
            return false;
        }
        if ($("#floorNumUpload").val()>99){
            showErrorAlert("Floor numbers must be less than 100.");
            return false;
        }
        //if no file selected
        if (!$("#fileUpload")[0].files[0]){
            showErrorAlert("You must select an svg file for your floorplan.");
            return false;
        }
        if(floorList[$("#floorNumUpload").val()]){
            bootbox.confirm("Are you sure you want to overwrite this floor?", function(result) {
            if(!result){
                return;
            }
            else{
                loadFloor();
                return;
            }
            });
        }
        else{
            loadFloor();
            return;
        }
    });
});

function loadFloor(){
    //add to array
    $("#deletecurrentfloor").show();
    var floor = new FloorPlan();
    floor.floorID = $("#floorNumUpload").val();
    floor.imagePath = $("#fileUpload")[0].files[0].name;
    floor.imageWidth = 0;//TODO
    floor.imageHeight = 0;//TODO
    floorList[$("#floorNumUpload").val()] = floor;
    //add floor list from array
    $("#floorList").empty();
    for(var val in floorList){
        $("#floorList").append('<li class="list-group-item floorListItem" id="floor'+val+'" onclick="floorClicked(this)">Floor '+val+'</a></li>');
    }
    //change floor
    changeFloor($("#floorNumUpload").val());
    //clear the form
    $("#newFloor")[0].reset();
    $("#default_img").hide();
    $("#floorListHolder").show();
}

function loadFloorsFromList(){
    $("#floorList").empty();
    for(var val in floorList){
            $("#floorList").append('<li class="list-group-item floorListItem" id="floor'+val+'" onclick="floorClicked(this)">Floor '+val+'</a></li>');
    }
    //for importing existing work
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
    if(hasFloor){
        $("#floorListHolder").show();
        $("#default_img").hide();
        var cfloor = floorList[floorList.length - 1];
        for (var val=0; floorList.length>val;val++){
            try {
                if (floorList[val].floorID != null){
                    changeFloor(val);
                    deleteShown = true;
                    break;
                }
            }
            catch(err){
            }
        }
    }
}

function changeFloor(val){
    changeIMGsource("floor_plans/"+floorList[val].imagePath);
    current_floor = parseInt(val);
    $("#floor"+val).addClass("active");
    redraw();
}

function floorClicked(elem){
    var id = $(elem).attr("id");
    $("#floorList").find(".active").removeClass("active");
    $("#"+id).addClass("active");
    changeFloor(id.substring(5));
};

function loadInitialFloor() {
    $("#floorListHolder").hide();
    //just draws default image to canvas
    canvas = document.getElementById('floorPlan');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = "";
    var floor = new FloorPlan();
    floor.floorID = 1;
    floor.imagePath  = "";
    floor.imageWidth = 0;//TODO
    floor.imageHeight = 0;//TODO
    floorList[1] = floor;

    $("#floorList").empty();
    for(var val in floorList){
        $("#floorList").append('<li id="floor'+val+'" onclick="floorClicked(this)"><a href="#">Floor '+val+'</a></li>');
    }
    changeFloor(1);
}

function deleteFloor(){
    for(var val=nodeList.length-1; val>=0;val--){
        if (nodeList[val].floorID === current_floor){
            deleteNode(nodeList[val]);
        }
    }
    //remove the floor from the floorlist
    delete floorList[current_floor];
    loadFloorsFromList();
    var deleteShown = false;
    for (var val=0; floorList.length>val;val++){
        try {
            if (floorList[val].floorID != null){
                changeFloor(val);
                deleteShown = true;
                break;
            }
        }
        catch(err){
        }
    }
    if(!deleteShown){
        $("#deletecurrentfloor").hide();
        $("#floorListHolder").hide();
        //reset floor list to avoid having unneeded indexes
        floorList = [];
        var p1 = ctx.transformedPoint(0,0);
        img.src="";
        var p2 = ctx.transformedPoint(canvas.width,canvas.height);
        ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        $("#default_img").show();
    }
}