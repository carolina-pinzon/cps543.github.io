var radio = 200;
var fontSize = 16;
var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

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

function initMarker(marker, arc, index,initialDegree) {
    var startOrEnd = marker[0].id.split("_")[2];
    var radioP = radio - 5;
    marker[0].style.left = radioP + 'px';
    marker[0].style.transformOrigin = "5px " + radio + "px";
    //marker[0].style.transformOrigin = "5px " + radio + "px";
    var rotate = 'rotate(' +initialDegree + 'deg)';
    marker.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    marker.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, marker, startOrEnd, arc, index);    
        });                 
    });
}

function initLastPair(initialDegree) {
    var index = arrayMarkerPairs.length - 1;
    var currentMarkerPair = arrayMarkerPairs[index];

    initMarker(currentMarkerPair.markerStart, currentMarkerPair.arc, index, initialDegree);
    initMarker(currentMarkerPair.markerEnd, currentMarkerPair.arc, index, initialDegree);
}

function getCssDegrees(event) {
    console.log(event.clientX, event.clientY);
    var offsetSelector = $('#innerCircle').parent();
    var x = event.clientX - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(event.clientY - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);
    return convertThetaToCssDegs(theta);
}

function buildLastPair(cssDegs) {
    var diametro = radio*2;
    var lastPair = {
        startAngle: cssDegs,
        endAngle: cssDegs
    };
    lastPair.markerStart = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_start", class: "marker"});
    lastPair.markerEnd = $('<div>', { id: "marker_" + arrayMarkerPairs.length + "_end", class: "marker"});
    lastPair.arc = document.createElementNS("http://www.w3.org/2000/svg","svg");
    lastPair.arc.setAttributeNS(null, "class", "arc"); 
    lastPair.arc.style.width = diametro + 'px';
    lastPair.arc.style.height = diametro + 'px';
    //lastPair.arc.style.top = -diametro + 'px';
    lastPair.arc.style.marginRight = -diametro + 'px';
    var newpath = document.createElementNS("http://www.w3.org/2000/svg","path");  
        newpath.setAttributeNS(null, "stroke", "#446688"); 
        newpath.setAttributeNS(null, "stroke-width", 5); 
        newpath.setAttributeNS(null, "fill", "none");
    lastPair.arc.appendChild(newpath);
    return lastPair;
}

function createPair(event) {
    var cssDegs = 0;
    if (event) {
        cssDegs = getCssDegrees(event);
        console.log(cssDegs);
    }
    var lastPair = buildLastPair(cssDegs);

    $('#dynamic-container').append([lastPair.markerStart[0], lastPair.markerEnd[0]]);
    $('#time-pair-container').append(lastPair.arc);
    
    arrayMarkerPairs.push(lastPair);
    initLastPair(cssDegs);
} 

function KeyPress(e) {
    var evtobj = window.event? event : e
    console.log(arrayMarkerPairs.length);
    if(evtobj.keyCode == 90 && (evtobj.ctrlKey || evtobj.metaKey) && arrayMarkerPairs.length > 1){
        var pairToRemove = arrayMarkerPairs[arrayMarkerPairs.length - 1];
        pairToRemove.markerStart.remove();
        pairToRemove.markerEnd.remove();
        pairToRemove.arc.removeEventListener("click", createPair);
        pairToRemove.arc.remove();
        arrayMarkerPairs.pop();
    }
}

function addMonthNames() {
    for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < months[i].length; j++) {
            console.log(months[i].charAt(j));
            var id = i*3 + j;
            var span = $('<span>', {'id': 'monthNames_' + id, 'class' : "names"}).text(months[i].charAt(j));
            console.log(span);
            $('#month-names').append(span);
            var rot = 360/months.length*i + (j-1)*5 + 180/months.length;
            span.css('transform','rotate(' + rot + 'deg)');
        }
        var span = $('<span>', {'class': "lines"});
        var rot = 360/months.length*i;
        span.css('transform','rotate(' + rot + 'deg)');
        $('#month-lines').append(span);
    }
    $('#month-names .names').height(radio + fontSize);
    $('#month-names .names').css('margin-bottom', -radio - fontSize);
    $('#month-names .names').width(fontSize);
    $('#month-names .names').css('margin-right', -fontSize);
    $('#month-lines .lines').height(radio);
    $('#month-lines .lines').css('margin-bottom', -radio);
    $('#month-lines .lines').width(fontSize);
    $('#month-lines .lines').css('margin-right', -fontSize);
    $('#month-names').css('top', 0);
    $('#month-names').css('left', radio + fontSize/2);
    $('#month-lines').css('top', fontSize);
    $('#month-lines').css('left', radio + fontSize/2);
}

function addDayNames() {
    for (var i = 0; i < days.length; i++) {
        for (var j = 0; j < days[i].length; j++) {
            console.log(days[i].charAt(j));
            var id = i*3 + j;
            var span = $('<span>', {'id': 'dayNames_' + id}).text(days[i].charAt(j));
            var rot = 360/days.length*i + (j-1)*5 + 180/days.length;
            span.css('transform','rotate(' + rot + 'deg)');
            console.log(rot);
            $('#day-names').append(span);
        }
    }
    $('#day-names span').height(radio*0.8 + 12);
    $('#day-names span').css('margin-bottom', -radio*0.8 - 12)
    $('#day-names').css('top', -2*radio*0.9 - 15);
    $('#day-names').css('right', -radio + 4);
    $('#day-names').css('margin-right', 2*radio*0.8 - 12);
}

$(document).ready(function(){  
    var diametro = radio*2;

    $('#dynamic-container')[0].style.width = diametro + 'px'; 
    $('#dynamic-container')[0].style.height = diametro + 'px';
    $('#dynamic-container')[0].style.marginBottom = -diametro + 'px';
    $('#innerCircle')[0].style.width = diametro + 'px';
    $('#innerCircle')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.marginBottom = -diametro + 'px';
    $('#time-pair-container').css("left",radio + fontSize);
    $('#time-pair-container').css("margin-left",-radio);
    $('#time-pair-container').css("top",fontSize);
    $('.time-controller').css("font-size",fontSize);

    createPair();  

    document.onkeydown = KeyPress;

    addMonthNames();
    addDayNames();
    //addMonthLines();
    //addDayLines();
        
}); 
