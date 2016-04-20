var radio = 100;
var degreesStart = 0;
var degreesEnd = 0;

var arrayMarkerPairs = [];

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper, startOrEnd, arc, index){
    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        

    var cssDegs = convertThetaToCssDegs(theta);
    var rotate = 'rotate(' +cssDegs + 'deg)';
    cropper.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    var radioP = radio - 2.5;
    if (startOrEnd === 'start') {
        arrayMarkerPairs[index].startAngle = cssDegs;
    }
    else {
        arrayMarkerPairs[index].endAngle = cssDegs;
    }
    arc.childNodes[0].setAttributeNS(null, "d", describeArc(radio, radio, radioP, arrayMarkerPairs[index].startAngle, arrayMarkerPairs[index].endAngle));  
    $('body').on('mouseup', function(event){ $('body').unbind('mousemove')});
}
    
function convertThetaToCssDegs(theta){
    var cssDegs = 90 - theta;
    if (cssDegs < 0) {
        cssDegs += 360;
    }
    return cssDegs;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    //console.log(angleInRadians);

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    if (startAngle > endAngle) {
        startAngle -= 360;
    }

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function initMarker(marker, arc, index) {
    var startOrEnd = marker[0].id.split("_")[2];
    var radioP = radio - 5;
    marker[0].style.left = radioP + 'px';
    marker[0].style.transformOrigin = "5px " + radio + "px";
    marker.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, marker, startOrEnd, arc, index);    
        });                 
    });
}

function initLastPair() {
    var index = arrayMarkerPairs.length - 1;
    var currentMarkerPair = arrayMarkerPairs[index];

    initMarker(currentMarkerPair.markerStart, currentMarkerPair.arc, index);
    initMarker(currentMarkerPair.markerEnd, currentMarkerPair.arc, index);
}

function createPair() {
    var diametro = radio*2;
    var lastPair = {
        startAngle: 0,
        endAngle: 0
    };
    lastPair.markerStart = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_start", class: "marker"});
    lastPair.markerEnd = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_end", class: "marker"});
    lastPair.arc = document.createElementNS("http://www.w3.org/2000/svg","svg");
    lastPair.arc.setAttributeNS(null, "class", "arc"); 
    lastPair.arc.style.width = diametro + 'px';
    lastPair.arc.style.height = diametro + 'px';
    lastPair.arc.style.top = -diametro + 'px';
    lastPair.arc.style.marginRight = -diametro + 'px';
    var newpath = document.createElementNS("http://www.w3.org/2000/svg","path");  
        newpath.setAttributeNS(null, "stroke", "#446688"); 
        newpath.setAttributeNS(null, "stroke-width", 5); 
        newpath.setAttributeNS(null, "fill", "none");
    lastPair.arc.appendChild(newpath);

    $('#dynamic-container').append([lastPair.markerStart[0], lastPair.markerEnd[0]]);
    $('#time-pair-container').append(lastPair.arc);
    arrayMarkerPairs.push(lastPair);
    initLastPair();
} 

$(document).ready(function(){  
    var diametro = radio*2;

    $('#dynamic-container')[0].style.width = diametro + 'px'; 
    $('#dynamic-container')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.width = diametro + 'px';
    $('#innerCircle')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.marginBottom = -diametro + 'px';

    createPair();  
        
}); 
