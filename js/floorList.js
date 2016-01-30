$(function(){
    //handle the new floor submit
    $('#newFloor').submit(function () {
        
        //if no file selected
        if (!$("#fileUpload")[0].files[0]){
            alert("you must select a file");
            return false;
        }
        addSvgToList($("#fileUpload")[0].files[0]);
        return false;
    });
});

//Browse for a svg file and add it to the list of images, inspired by http://www.html5rocks.com/en/tutorials/file/dndfiles/
function addSvgToList(file){

    // Only process svg files.
    if (!file.type.match('.svg')) {
		return;
    }

    var reader = new FileReader();
	
    // Closure to capture the file information.
    reader.onload = (function() {
		return function(e) {
			addToCanvas(e.target.result);
            $("#floorList").append('<li><img src="' +e.target.result+ '" width="100"/></li>');
		};
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);   
}

//take a svg string and add it to the canvas
function addToCanvas(svgFile){
	var can = document.getElementById('floorPlan');
	var ctx = can.getContext('2d');

	var img = new Image();
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
	}
	img.src = svgFile;
}