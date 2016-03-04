/*
    This file contains code related to panning and zooming the map
    Code has been mostly adapted from http://phrogz.net/tmp/canvas_zoom_to_cursor.html

*/

var dragStart,dragged;
var MOUSE_DRAG_GRACE_DIST_SQUARED = 4; // The distance the mouse must move (squared) to count as a drag
var totalZoomOut;

function mouseMove(evt) {
    // Store the location of the mouse relative to the canvas
    var x = evt.pageX - $(canvas).offset().left;
    var y = evt.pageY - $(canvas).offset().top;
    mouseLocation = ctx.transformedPoint(x,y);

    if(dragStart && (mouseLocation.x - dragStart.x) * (mouseLocation.x - dragStart.x) + (mouseLocation.y - dragStart.y) * (mouseLocation.y - dragStart.y) > MOUSE_DRAG_GRACE_DIST_SQUARED)
    {
        if((currentImagePos[0] + (mouseLocation.x - dragStart.x)) <= 0 && (currentImagePos[0] + currentImageSize[0] + (mouseLocation.x - dragStart.x)) >= canvas.width
        && (currentImagePos[1] + (mouseLocation.y - dragStart.y)) <= 0 && (currentImagePos[1] + currentImageSize[1] + (mouseLocation.y - dragStart.y)) >= canvas.height){
            dragged = true;
            ctx.translate(mouseLocation.x-dragStart.x,mouseLocation.y-dragStart.y);
            currentImagePos[0]+=mouseLocation.x-dragStart.x;
            currentImagePos[1]+=mouseLocation.y-dragStart.y;
            redraw();
        }
    }


    if(nodeEditingMode || storylinesEditingMode)
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
    //Boundary check
    //console.log(factor); Math.floor(1/totalZoomOut))
	if((Math.max(canvas.width / currentImageSize[0], canvas.height / currentImageSize[1]) <= Math.floor(1/totalZoomOut)) && (factor*currentImageSize[0] > totalZoomOut*xPanLimits[1]) && (factor*currentImageSize[1] > totalZoomOut*yPanLimits[1])){
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        currentImageSize[0] = factor*currentImageSize[0];
        currentImageSize[1] = factor*currentImageSize[1];
        redraw();
	}
}

//Allow background image to fill the entire canvas
var imageFillWindow = function() {
	totalZoomOut = Math.min(canvas.width / img.width, canvas.height / img.height);
    currentImageSize[0] = totalZoomOut*img.width;
    currentImageSize[1] = totalZoomOut*img.height;
    ctx.scale(totalZoomOut,totalZoomOut);
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