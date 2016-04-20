var radio = 50;
var degreesStart = 0;
var degreesEnd = 0;

var arrayMarkerPairs = [];

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper, startOrEnd, arc){
    //alert(offsetSelector.left);

    //console.log(offsetSelector.width());

    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        


    var cssDegs = convertThetaToCssDegs(theta);
    var rotate = 'rotate(' +cssDegs + 'deg)';
    cropper.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    //console.log(cssDegs);
    var radioP = radio - 2.5;
    if (startOrEnd === 'start') {
        degreesStart = cssDegs;
    }
    else {
        degreesEnd = cssDegs;
    }
    arc.children()[0].setAttribute("d", describeArc(radio, radio, radioP, degreesStart, degreesEnd));  
    $('body').on('mouseup', function(event){ $('body').unbind('mousemove')});

}
    
function convertThetaToCssDegs(theta){
    var cssDegs = 90 - theta;
    if (cssDegs < 0) {
        cssDegs += 360;
    }
    return cssDegs;
}

$(document).ready(function(){  
    var firstPair =  {
        markerStart: $('#marker_1_start'),
        markerEnd : $('#marker_1_end'),
        arc: $('#arc_1')
    };
    arrayMarkerPairs.push(firstPair);

    var diametro = radio*2;

    $('#dynamic-container')[0].style.width = diametro + 'px'; 
    $('#dynamic-container')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.width = diametro + 'px';
    $('#innerCircle')[0].style.height = diametro + 'px';

    initLastPair();                  
}); 

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
    //console.log(endAngle - startAngle);

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function initMarker(marker, arc) {
    var startOrEnd = marker[0].id.split("_")[2];
    var radioP = radio - 5;
    marker[0].style.left = radioP + 'px';
    marker[0].style.transformOrigin = "5px " + radio + "px";
    marker.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, marker, startOrEnd, arc);    
        });                 
    });
}

function initLastPair() {
    var currentMarkerPair = arrayMarkerPairs[arrayMarkerPairs.length - 1];
    initMarker(currentMarkerPair.markerStart, currentMarkerPair.arc);
    initMarker(currentMarkerPair.markerEnd, currentMarkerPair.arc);

    var diametro = radio*2;
    currentMarkerPair.arc[0].style.width = diametro + 'px'; 
    currentMarkerPair.arc[0].style.height = diametro + 'px';
    currentMarkerPair.arc[0].style.top = -diametro + 'px';
}


