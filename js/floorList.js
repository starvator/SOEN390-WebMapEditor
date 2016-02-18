$(function(){
    //handle the new floor submit
    $('#newFloor').submit(function () {
        //if no floor number
        if (!$("#floorNumUpload").val()){
            alert("you must enter a floor number");
            return false;
        }
        //if no file selected
        if (!$("#fileUpload")[0].files[0]){
            alert("you must select a file");
            return false;
        }
        //add the svg to the list and canvas
        addSvgToList($("#fileUpload")[0].files[0],$("#floorNumUpload").val());
        //clear the form
        $("#newFloor")[0].reset();
        return false;
    });
});

//Browse for a svg file and add it to the list of images, inspired by http://www.html5rocks.com/en/tutorials/file/dndfiles/
function addSvgToList(file,floorNum){

    // Only process svg files.
    if (!file.type.match('.svg')) {
		return;
    }

    var reader = new FileReader();
	
    // Closure to capture the file information.
    reader.onload = (function() {
		return function(e) {
			addToCanvas(e.target.result);
            $("#floorList").append('<li id="floor'+floorNum+'" onclick="changeFloor(this)"><a href="#">Floor '+floorNum+'</a></li>');
		};
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);   
}

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
	var id = $(elem).attr("id");
	addToCanvas();
	// do stuff
}
