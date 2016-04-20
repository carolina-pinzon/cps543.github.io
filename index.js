var radio = 50;
var degreesStart = 0;
var degreesEnd = 0;

var arrayMarkerPairs = [];

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper, startOrEnd, arc, index){
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
        arrayMarkerPairs[index].startAngle = cssDegs;
    }
    else {
        arrayMarkerPairs[index].endAngle = cssDegs;
    }
    arc.children()[0].setAttribute("d", describeArc(radio, radio, radioP, arrayMarkerPairs[index].startAngle, arrayMarkerPairs[index].endAngle));  
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
        markerStart: $('#marker_0_start'),
        markerEnd : $('#marker_0_end'),
        arc: $('#arc_0'),
        startAngle: 0,
        endAngle: 0
    };
    arrayMarkerPairs.push(firstPair);

    var diametro = radio*2;

    $('#dynamic-container')[0].style.width = diametro + 'px'; 
    $('#dynamic-container')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.width = diametro + 'px';
    $('#innerCircle')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.marginBottom = -diametro + 'px';

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

    var diametro = radio*2;
    currentMarkerPair.arc[0].style.width = diametro + 'px'; 
    currentMarkerPair.arc[0].style.height = diametro + 'px';
    currentMarkerPair.arc[0].style.top = -diametro + 'px';
}

function createPair() {
    var lastPair = {
        startAngle: 0,
        endAngle: 0
    };
    lastPair.markerStart = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_start", class: "marker"});
    lastPair.markerEnd = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_end", class: "marker"});
    lastPair.arc = $('<svg>', { id: "arc_" + arrayMarkerPairs.length, class: "arc"});
    lastPair.arc.append(
        $('<path>', { fill: "none", stroke: "#446688", "stroke-width":"5"})
        );
    $('#dynamic-container').append([lastPair.markerStart[0], lastPair.markerEnd[0]]);
    $('#time-pair-container').append(lastPair.arc);
    arrayMarkerPairs.push(lastPair);
    //console.log
    initLastPair();
}

window.setTimeout(function() {
    createPair()
}, 1000);  
