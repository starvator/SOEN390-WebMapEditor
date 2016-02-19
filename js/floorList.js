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
			$("#floorList").append('<li id="floor'+val+'" onclick="floorClicked(this)"><a href="#">Floor '+val+'</a></li>');
		}
		//change floor
		changeFloor($("#floorNumUpload").val());
		//clear the form
        $("#newFloor")[0].reset();
		return false;
    });
});

function changeFloor(val){
	changeIMGsource("floor_plans/"+floorList[val].name);
	$("#floor"+val).addClass("active");
	redraw();	
}

function floorClicked(elem){
	var id = $(elem).attr("id");
    $("#floorList").find(".active").removeClass("active");
    $("#"+id).addClass("active");
	changeFloor(id.substring(5));
};