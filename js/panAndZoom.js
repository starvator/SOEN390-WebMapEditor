/*
    This file contains code related to panning and zooming the map
    Code has been mostly adapted from http://phrogz.net/tmp/canvas_zoom_to_cursor.html

*/

var dragStart,dragged;
var MOUSE_DRAG_GRACE_DIST_SQUARED = 4; // The distance the mouse must move (squared) to count as a drag
var mouseExited = false;

function mouseMove(evt) {
    // Store the location of the mouse relative to the canvas
    var x = evt.pageX - $(canvas).offset().left;
    var y = evt.pageY - $(canvas).offset().top;
    mouseLocation = ctx.transformedPoint(x,y);
    
    if(mouseLocation.x < 0 || mouseLocation.y < 0 || mouseLocation.x > img.width || mouseLocation.y > img.height){
        return false;
    }
    mouseExited = false;
    
    if(dragStart && (mouseLocation.x - dragStart.x) * (mouseLocation.x - dragStart.x) + (mouseLocation.y - dragStart.y) * (mouseLocation.y - dragStart.y) > MOUSE_DRAG_GRACE_DIST_SQUARED)
    {
        dragged = true;

        // Redraw if panning or in node editing mode
        if (dragStart){
            ctx.translate(mouseLocation.x-dragStart.x,mouseLocation.y-dragStart.y);
            redraw();
        }
    }


    if(nodeEditingMode || storylinesEditingMode)
    {
        redraw();
    }
}

function mouseClick(evt) {

    // Only click with left mouse button
    if(!detectLeftButton(evt))
    {
        return false;
    }

    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

    // Store the location of the mouse relative to the canvas
    var x = evt.pageX - $(canvas).offset().left;
    var y = evt.pageY - $(canvas).offset().top;
    mouseLocation = ctx.transformedPoint(x,y);
    dragStart = mouseLocation;

    dragged = false;
}

function mouseUp(evt) {

    // Only interact left mouse button
    if(!detectLeftButton(evt))
    {
        return false;
    }

    // If we did not perform a drag, and the mouse is on the canvas
    // forward the click event to the canvas
    if(!dragged) {
        var x = evt.pageX - $(canvas).offset().left;
        var y = evt.pageY - $(canvas).offset().top;

        if(x >= 0 && y >= 0 && x <= $(canvas).height() && y <= $(canvas).width())
        {
            var pt = ctx.transformedPoint(x,y);
            canvasClick(pt.x,pt.y);
        }
    }

    dragStart = null;
}

function mouseRightClick(evt) {
    cancelOperations();
    evt.preventDefault();
    return false;
}

// From http://stackoverflow.com/questions/3944122/detect-left-mouse-button-press
function detectLeftButton(evt) {
    evt = evt || window.event;
    var button = evt.which || evt.button;
    return button == 1;
}

// Zoom functions
var scaleFactor = 1.1;
var zoom = function(clicks){
    var pt = mouseLocation;
    ctx.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,clicks);
    ctx.scale(factor,factor);
    if(ctx.scale(factor,factor) === undefined){
        scaledIMG[0] = factor*scaledIMG[0];
        scaledIMG[1] = factor*scaledIMG[1];
    }
    ctx.translate(-pt.x,-pt.y);
   
    redraw();
};

//Allow background image to fill the entire canvas
var imageFillWindow = function() {
	var scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
    originalScaledIMG = [scaleFactor*img.width, scaleFactor*img.height];
    if(ctx.scale(scaleFactor,scaleFactor) === undefined){
        scaledIMG[0] = scaleFactor*scaledIMG[0];
        scaledIMG[1] = scaleFactor*scaledIMG[1];
        panBuffer = [0,0];
    }
};

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
        if((sx*scaledIMG[0] >= originalScaledIMG[0]) && (sx*scaledIMG[0] <=img.width) && (sy*scaledIMG[1] >= originalScaledIMG[1]) && (sy*scaledIMG[1] <=img.height)){
            xform = xform.scaleNonUniform(sx,sy);
            return scale.call(ctx,sx,sy);
        }else{
            return false;
        }
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        imgLocation = [imgLocation[0]+dx, imgLocation[1]+dy];
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