/*
	This file contains code related to panning and zooming the map
	Code has been mostly adapted from http://phrogz.net/tmp/canvas_zoom_to_cursor.html

*/

var dragStart,dragged;

function mouseMove(evt) {
	
	// Store the location of the mouse relative to the canvas
	var x = evt.pageX - $(canvas).offset().left;
	var y = evt.pageY - $(canvas).offset().top;
	mouseLocation = ctx.transformedPoint(x,y);
		
	dragged = true;
	
	// Redraw if panning or in node editing mode
	
	if (dragStart){
		ctx.translate(mouseLocation.x-dragStart.x,mouseLocation.y-dragStart.y);
		redraw();
	}

	if(nodeEditingMode)		
	{		
		redraw();
	}	
}

function mouseClick(evt) {
	document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
	
	// Store the location of the mouse relative to the canvas
	var x = evt.pageX - $(canvas).offset().left;
	var y = evt.pageY - $(canvas).offset().top;
	mouseLocation = ctx.transformedPoint(x,y);
	dragStart = mouseLocation;
	
	dragged = false;
}

function mouseUp(evt) {	
	// If we did not perform a drag, forward the click event to the canvas
	if(!dragged) {
		var x = evt.pageX - $(canvas).offset().left;
		var y = evt.pageY - $(canvas).offset().top;
		var pt = ctx.transformedPoint(x,y);
	
		canvasClick(pt.x,pt.y);
	}

	dragStart = null;
}

// Zoom functions
var scaleFactor = 1.1;
var zoom = function(clicks){
	var pt = mouseLocation;
	ctx.translate(pt.x,pt.y);
	var factor = Math.pow(scaleFactor,clicks);
	ctx.scale(factor,factor);
	ctx.translate(-pt.x,-pt.y);
	redraw();
}

var handleScroll = function(evt){
	var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
	if (delta) zoom(delta);
	return evt.preventDefault() && false;
};


// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var scale = ctx.scale;
	ctx.scale = function(sx,sy){
		xform = xform.scaleNonUniform(sx,sy);
		return scale.call(ctx,sx,sy);
	};
	var rotate = ctx.rotate;
	ctx.rotate = function(radians){
		xform = xform.rotate(radians*180/Math.PI);
		return rotate.call(ctx,radians);
	};
	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}