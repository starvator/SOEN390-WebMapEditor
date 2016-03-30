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
	var floor = new FloorPlan();
	floor.floorID = $("#floorNumUpload").val();
	floor.imagePath = $("#fileUpload")[0].files[0].name;// DK HEEEEEERE
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
	if(floorList.length != 0){
		$("#floorListHolder").show();
		$("#default_img").hide();
		var cfloor = floorList[floorList.length - 1];
		changeFloor(cfloor.floorID);
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
}