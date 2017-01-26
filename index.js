var fontSize = 11;
var radio = window.innerHeight/2 - fontSize;
var separationLetters = 2.5;
var ratioRadioCircles = 0.8;
var arcStrokeWidth = 10;
var markerWidth = arcStrokeWidth;
var years = ["2012","2013","2014","2015","2016"];
var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
var hours = ['1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'];
var hues = ["rgba(83, 119, 119,0.8)","rgba(85, 36, 55,0.8)","rgba(190, 43, 62,0.8)","rgba(214, 92, 68,0.8)"];
var arrayArcs = [];

var circles = [years,months,days,hours];
var circlesTitles = ["years","months","days","hours"];

$(document).ready(function(){  
    var diameter = radio*2;

    for (var i = 0; i < circles.length; i++) {
        //
        var circleInfo = $('<div>', {'id' : i + "-info",'class' : "circleInfo"});
        var circleTitle = $('<div>', {'class' : "circleTitle"}).text(circlesTitles[i]);
        circleInfo.append(circleTitle);
        $('.values').append(circleInfo);
        //


        var ratio = (1 - ratioRadioCircles)*i;

        var divNames = $('<div>', {'id': i + '-names', 'class' : "divNames"});
        $('.time-controller').append(divNames);

        var divLines = $('<div>', {'id': i + '-lines', 'class' : "divLines"});
        $('.time-controller').append(divLines);

        fillCircle(i, divNames, divLines);

        var divArcs = $('<div>', {'id': i + '-arcs', 'class' : "divArcs"});
        divArcs.css("left",fontSize + ratio*radio);
        divArcs.css("top",fontSize + ratio*radio);
        divArcs.click(function(event) {
            if(event.target.className != "divArcs" && event.target.className != "marker") {
                var iCircle = this.id.split("-")[0];

                var initialDegrees = getClickDegrees(event, $(this));
                var degreesOneSection = 360/circles[iCircle].length;
                var section = Math.round(initialDegrees/degreesOneSection);

                var degrees = degreesOneSection*section;

                createArc(iCircle, $(this), degrees);
            }
        });

        var diameter = radio*(1 - (1 - ratioRadioCircles)*i)*2;
        divArcs.width(diameter);
        divArcs.height(diameter);

        $('.time-controller').append(divArcs);

        createArc(i, divArcs, 0);
    }

    $('.time-controller').css("font-size",fontSize);

    document.onkeydown = KeyPress;
        
}); 

//Adds names and lines for circle iCircle
function fillCircle(iCircle, divNames, divLines) {
    var ratio = 1 - (1 - ratioRadioCircles)*iCircle;

    for (var i = 0; i < circles[iCircle].length; i++) {
        for (var j = 0; j < circles[iCircle][i].length; j++) {
            var id = i*3 + j;
            var span = $('<span>', {'class' : "names"}).text(circles[iCircle][i].charAt(j));
            span.height(radio*ratio + fontSize);
            span.css('margin-bottom', -radio*ratio - fontSize);
            span.width(fontSize);
            span.css('margin-right', -fontSize);
            divNames.append(span);
            var rot = 360/circles[iCircle].length*i + 180/circles[iCircle].length + separationLetters*((j - circles[iCircle][i].length/2) + 1/2);
            span.css('transform','rotate(' + rot + 'deg)');
        }
        var span = $('<span>', {'class': "lines"});
        var after = $('<span>', {'class': "after"});
        after.height(markerWidth);
        span.append(after);
        var rot = 360/circles[iCircle].length*i;
        span.css('transform','rotate(' + rot + 'deg)');
        span.height(radio*ratio);
        span.css('margin-bottom', -radio*ratio);
        span.width(fontSize);
        span.css('margin-right', -fontSize);
        divLines.append(span);
    }

    divNames.css('top', radio*(1-ratio));
    divNames.css('left', radio + fontSize/2);
    divLines.css('top', fontSize + radio*(1-ratio));
    divLines.css('left', radio + fontSize/2);

}

//Creates an arc for circle iCircle
function createArc(iCircle, divArcs, initialDegrees) {
    var ratio = 1 - (1 - ratioRadioCircles)*iCircle;
    var degreesOneSection = 360/circles[iCircle].length;

    var diametro = radio*ratio*2;
    var radioP = radio*ratio - arcStrokeWidth/2;
    var arc = {
        startAngle: initialDegrees,
        endAngle: initialDegrees + degreesOneSection,
        iCircle: iCircle
    };
    arc.markerStart = $('<div>', { id: "marker_" + arrayArcs.length + "_start", class: "marker markerStart"});
    arc.markerEnd = $('<div>', { id: "marker_" + arrayArcs.length + "_end", class: "marker markerEnd"});

    arc.path = document.createElementNS("http://www.w3.org/2000/svg","svg");
    arc.path.id = "arc_" + arrayArcs.length;
    arc.path.setAttributeNS(null, "class", "arc"); 
    arc.path.style.width = diametro + 'px';
    arc.path.style.height = diametro + 'px';
    var newpath = document.createElementNS("http://www.w3.org/2000/svg","path");  
        newpath.setAttributeNS(null, "stroke", hues[iCircle]); 
        newpath.setAttributeNS(null, "stroke-width", arcStrokeWidth); 
        newpath.setAttributeNS(null, "fill", "none");
        newpath.setAttributeNS(null, "d", describeArc(radio*ratio, radio*ratio, radioP, arc.startAngle, arc.endAngle));  
    arc.path.appendChild(newpath);

    divArcs.append([arc.markerStart[0], arc.markerEnd[0]]);
    divArcs.append(arc.path);
    arrayArcs.push(arc);

    initMarkers(arc, arrayArcs.length - 1, 0, divArcs, initialDegrees);

    valuesChanged();
}

//Initialize markers (arc beginning and end)
function initMarkers(arc, index, initialDegree, divArcs, initialDegrees) {
    var markerStart = arc.markerStart;
    var markerEnd = arc.markerEnd;

    var ratio = 1 - (1 - ratioRadioCircles)*arc.iCircle;
    var radioCircle = radio*ratio;
    var rotate = 'rotate(' + initialDegrees + 'deg)';
    var degreesOneSection = 360/circles[arc.iCircle].length;

    markerStart.css("left", radioCircle - markerWidth/2);
    markerStart.css("transform-origin",  markerWidth/2 + "px " + radioCircle + "px 0px");
    markerStart.css("width", markerWidth);
    markerStart.css("height", markerWidth);
    markerStart.css("margin-bottom", -markerWidth);
    markerStart.css("margin-right", -markerWidth);
    markerStart.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    markerStart.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateMarkers($(arc.path), event.pageX, event.pageY, markerStart, 'start', arc, index);   
            valuesChangedDebounced();
        });                 
    });

    markerEnd.css("left", radioCircle - markerWidth/2);
    markerEnd.css("transform-origin", markerWidth/2 + "px " + radioCircle + "px 0px");
    markerEnd.css("width", markerWidth);
    markerEnd.css("height", markerWidth);
    markerEnd.css("margin-bottom", -markerWidth);
    markerEnd.css("margin-right", -markerWidth);
    var endAngle = initialDegrees+degreesOneSection;
    var rotate = 'rotate(' + endAngle + 'deg)';
    markerEnd.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    markerEnd.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateMarkers($(arc.path), event.pageX, event.pageY, markerEnd, 'end', arc, index); 
            valuesChangedDebounced();
        });                 
    });
}

var valuesChangedDebounced = _.debounce(valuesChanged, 250);

function valuesChanged() {
    $('.arcInfo').remove();
    for (var i = 0; i < arrayArcs.length; i++) {
        var iArrayStart = Math.round(arrayArcs[i].startAngle/(360/circles[arrayArcs[i].iCircle].length));
        var iArrayEnd = Math.round(arrayArcs[i].endAngle/(360/circles[arrayArcs[i].iCircle].length) - 1);

        if(iArrayEnd < 0) {
            iArrayEnd = circles[arrayArcs[i].iCircle].length - 1;
        }
        else if(iArrayEnd > circles[arrayArcs[i].iCircle].length - 1) {
            iArrayEnd = 0;
        }

        if(iArrayStart > circles[arrayArcs[i].iCircle].length - 1) {
            iArrayStart = 0;
        }
        else if(iArrayStart < 0) {
            iArrayStart = circles[arrayArcs[i].iCircle].length - 1;
        }
        

        var arcInfo = $('<div>',{'id' : arrayArcs.length - 1 + "-arcInfo",'class' : "arcInfo"}).text(circles[arrayArcs[i].iCircle][iArrayStart] + " - " + circles[arrayArcs[i].iCircle][iArrayEnd]);
        $("#" + arrayArcs[i].iCircle + "-info").append(arcInfo);
        //$('#' + i + "-arcInfo").text(arrayArcs[i].startAngle.toFixed(3) + " - " + arrayArcs[i].endAngle.toFixed(3));
    }
}

//Rotates markers on mouse down
function rotateMarkers(offsetSelector, xCoordinate, yCoordinate, ending, startOrEnd, arc, index){
    var ratio = 1 - (1 - ratioRadioCircles)*arc.iCircle;
    var radioCircle = radio*ratio;

    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        

    var cssDegs = convertThetaToCssDegs(theta);
    var degreesOneSection = 360/circles[arc.iCircle].length;
    var section = Math.round(cssDegs/degreesOneSection);

    var degrees = degreesOneSection*section;

    var rotate = 'rotate(' + degrees + 'deg)';

    ending.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    var radioP = radioCircle - arcStrokeWidth/2;
    if (startOrEnd === 'start') {
        arrayArcs[index].startAngle = degrees;
    }
    else {
        arrayArcs[index].endAngle = degrees;
    }
    arc.path.childNodes[0].setAttributeNS(null, "d", describeArc(radioCircle, radioCircle, radioP, arrayArcs[index].startAngle, arrayArcs[index].endAngle));  
    
    $('body').on('mouseup', function(event){
        $('body').unbind('mousemove')
    });
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

    if(Math.abs(endAngle - startAngle) == 360 || Math.abs(endAngle - startAngle) == 0) {
        return circlePath(x, y, radius);
    }

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function circlePath(cx, cy, r){
    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
}

//Convert click position to degrees
function getClickDegrees(event, element) {
   var offsetSelector = element;
    var x = event.clientX - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(event.clientY - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);
    return convertThetaToCssDegs(theta);
}

//Listen to ctrl+z to remove last arc added
function KeyPress(e) {
    var evtobj = window.event? event : e;
    if(evtobj.keyCode == 90 && (evtobj.ctrlKey || evtobj.metaKey) && arrayArcs.length > circles.length){
        var pairToRemove = arrayArcs[arrayArcs.length - 1];
        pairToRemove.markerStart.remove();
        pairToRemove.markerEnd.remove();
        pairToRemove.path.remove();
        arrayArcs.pop();

        valuesChanged();
    }
}

