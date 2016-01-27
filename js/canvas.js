window.onload = function(){
	var can = document.getElementById('floorPlan');
	var ctx = can.getContext('2d');

	var img = new Image();
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
	}
	img.src = "floor_plans/floor3.svg";
}