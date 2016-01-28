$(function(){
	//event listeners
	document.getElementById('file').addEventListener('change', addSvgToList, false);
});

//Browse for a svg file and add it to the list of images, inspired by http://www.html5rocks.com/en/tutorials/file/dndfiles/
function addSvgToList(evt){
    var file = evt.target.files[0]; // The svg file

    // Only process svg files.
    if (!file.type.match('.svg')) {
		return;
    }

    var reader = new FileReader();
	
    // Closure to capture the file information.
    reader.onload = (function() {
		return function(e) {
			$("#floorList").append('<li><img src="' +e.target.result+ '" width="100"/></li>');
		};
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);   
}