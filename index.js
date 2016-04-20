var radio = 50;
var degreesStart = 0;
var degreesEnd = 0;
var markerStart =  $('#marker')[0];
var markerEnd =  $('#marker1')[0];

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper, startOrEnd){
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
    /*if (degreesStart > degreesEnd) {
        var temp = degreesStart;
        degreesStart = degreesEnd;
        degreesEnd = temp;
    }*/
    console.log('start',degreesStart,'end',degreesEnd);
    document.getElementById("arc1").setAttribute("d", describeArc(radio, radio, radioP, degreesStart, degreesEnd));  
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

    var diametro = radio*2;

    $('#dynamic-container')[0].style.width = diametro + 'px'; 
    $('#dynamic-container')[0].style.height = diametro + 'px';
    $('#innerCircle')[0].style.width = diametro + 'px';
    $('#innerCircle')[0].style.height = diametro + 'px';
    var radioP = radio - 5;
    $('#marker')[0].style.left = radioP + 'px';
    $('#marker')[0].style.transformOrigin = "5px " + radio + "px";
    $('#marker1')[0].style.left = radioP + 'px';
    $('#marker1')[0].style.transformOrigin = "5px " + radio + "px";
    var diametroP = diametro + radio/2 + 4;;
    $('#arc')[0].style.width = diametro + 'px'; 
    $('#arc')[0].style.height = diametro + 'px';
    $('#arc')[0].style.top = -diametro + 'px';
    diametroP -= 4;
    //$('#arc')[0].style.top = -diametroP + 'px';//250
    //$('#arc')[0].style.left = 4 + 'px';//4
    diametroP = radio/2 + 4;
    //$('#arc')[0].style.marginLeft = -diametroP + 'px';//54



    $('#marker').on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, $('#marker'),'start');    
        });
                            
    });  

    $('#marker1').on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, $('#marker1'),'end');    
        });
                            
    }); 

    //document.getElementById("arc1").setAttribute("d", describeArc(80, 80, 50, 0, 270));                  
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

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    //console.log(endAngle - startAngle);

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}


