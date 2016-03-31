var floorList = [];
var current_floor = 0;

$(function(){
    //handle the new floor submit
    $('#newFloor').submit(function () {
        //if no floor number
        if (!$("#floorNumUpload").val()){
            showErrorAlert("You must enter a floor number.");
            return false;
        }
        if ($("#floorNumUpload").val()<1){
            showErrorAlert("Floor numbers must be greater than 0.");
            return false;
        }
        if ($("#floorNumUpload").val()>99){
            showErrorAlert("Floor numbers must be less than 100.");
            return false;
        }
        //if no file selected
        if (!$("#fileUpload")[0].files[0]){
            showErrorAlert("You must select a file.");
            return false;
        }
        if(floorList[$("#floorNumUpload").val()] && !confirm("Would you like to replace the floor?")){
            return false
        }
        //add to array
        var floor = new FloorPlan();
        floor.floorID = $("#floorNumUpload").val();
        floor.imagePath = $("#fileUpload")[0].files[0].name;
        floor.imageWidth = 0;//TODO
        floor.imageHeight = 0;//TODO
        floorList[$("#floorNumUpload").val()] = floor;
        //add floor list from array
        $("#floorList").empty();
        for(var val in floorList){
            $("#floorList").append('<li id="floor'+val+'" onclick="floorClicked(this)"><a href="#">Floor '+val+'</a></li>');
        }
        //change floor
        changeFloor($("#floorNumUpload").val());
        //clear the form
        $("#newFloor")[0].reset();
        return false;
    });
});

function loadFloorsFromList(){
    $("#floorList").empty();
    for(var val in floorList){
            $("#floorList").append('<li id="floor'+val+'" onclick="floorClicked(this)"><a href="#">Floor '+val+'</a></li>');
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
    var floor = new FloorPlan();
    floor.floorID = 1;
    floor.imagePath  = "floor3.svg";
    floor.imageWidth = 0;//TODO
    floor.imageHeight = 0;//TODO
    floorList[1] = floor;

    $("#floorList").empty();
    for(var val in floorList){
        $("#floorList").append('<li id="floor'+val+'" onclick="floorClicked(this)"><a href="#">Floor '+val+'</a></li>');
    }
    changeFloor(1);
}