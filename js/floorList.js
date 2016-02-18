var floorList = [];

$(function(){
    //handle the new floor submit
    $('#newFloor').submit(function () {
        //if no floor number
        if (!$("#floorNumUpload").val()){
            alert("You must enter a floor number.");
            return false;
        }
        //if no file selected
        if (!$("#fileUpload")[0].files[0]){
            alert("You must select a file.");
            return false;
        }
		if(floorList[$("#floorNumUpload").val()]){
			if(!confirm("Would you like to replace the floor?")){
				return false
			}
		}
		//add to array
		floorList[$("#floorNumUpload").val()] = $("#fileUpload")[0].files[0];
		//add floor list from array
		$("#floorList").empty();
		for(val in floorList){
			$("#floorList").append('<li id="'+floorList[val].name+'" class="active" onclick="changeFloor(this)"><a href="#">Floor '+val+'</a></li>');
		}
        //clear the form
        $("#newFloor")[0].reset();
        return false;
		//change floor
		var id = floorList[val].name
		var $d = $('#'+id);
		changeFloor($d);
    });
});

//take a svg string and add it to the canvas
function addToCanvas(svgFile){
	var can = document.getElementById('floorPlan');
	var ctx = can.getContext('2d');

	img = new Image();
	img.onload = function() {
		nodeList = [];
		redraw();		
	}
	img.src = svgFile;
}

function changeFloor(elem){
	var svgFile = $(elem).attr("id");
	changeIMGsource('floor_plans/'+svgFile);
	redraw();
}