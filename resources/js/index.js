var WIDTH = $("#draw-field").prop("width");
var HEIGHT = $("#draw-field").prop("height");
var COLOR_GREY = "#eee";
var COLOR_TRANSPARENT = "transparent";

var drawField = document.getElementById("draw-field");
var context = drawField.getContext("2d");

context.translate(0, drawField.height);
context.scale(1, -1);

drawGrid(COLOR_GREY);

function drawGrid(color) {
    for (var x = 0.5; x < WIDTH; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, HEIGHT);
    }

    for (var y = 0.5; y < HEIGHT; y += 10) {
        context.moveTo(0, y);
        context.lineTo(WIDTH, y);
    }

    context.strokeStyle = color;
    context.stroke();
}

function plot(x, y, index) {
    (function(x, y, index) {
        setTimeout(function () {
            context.fillRect((x * 10), (y * 10), 10, 10);
        }, 500 * (index + 1));
    })(x, y, index);
}

function plotWithBrightness(x, y, b) {
    context.fillStyle = "rgba(0, 0, 0, " + b + ")";
    context.fillRect((x * 10), (y * 10), 10, 10);
}

function getDecimal(number) {
    return number - Math.floor(number);
}

function drawDigitalDiffAnalyzer(x1, y1, x2, y2) {
    var x = x1;
    var y = y1;
    plot(x, y);

    var length = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));

    var dx = (x2 - x1) / length;
    var dy = (y2 - y1) / length;

    var i = 0;
    while(i <= length) {
        x = x + dx;
        y = y + dy;
        plot(~~x, ~~y, i);
        i++;
    }
}

function drawBrezenxem(x1, y1, x2, y2) {
    var x = x1;
    var y = y1;
    plot(x, y, 0);

    var dx = x2 - x1;
    var dy = y2 - y1;

    var e = 2 * dy - dx;

    var i = dx;
    while(--i >= 0) {
        if (e >= 0) {
            x = x + 1;
            y = y + 1;
            e = e - 2 * (dy - dx);
        } else {
            x = x + 1;
            e = e + 2 * dy;
        }

        plot(x, y, i - 1);
    }
}

function drawVu(x1, y1, x2, y2) {
    if (x2 < x1) {
        x1 += x2;
        x2 = x1 - x2;
        x1 -= x2;
        y1 += y2;
        y2 = y1 - y2;
        y1 -= y2;
    }

    var dx = x2 - x1;
    var dy = y2 - y1;
    var gradient;

    if (dx > dy) {
        gradient = dy / dx;
        var intery = y1 + gradient;
        plotWithBrightness(x1, y1, x1, y1, 0);

        for (var x = x1; x < x2; ++x) {
            plotWithBrightness(x, ~~intery, x, ~~intery, 1 - getDecimal(intery));
            plotWithBrightness(x, ~~intery + 1, x, ~~intery + 1, getDecimal(intery));
            intery += gradient;
        }
        plotWithBrightness(x2, y2, x2, y2, 0);
    } else {
        gradient = dy / dx;
        var interx = x1 + gradient;
        plotWithBrightness(x1, y1, x1, y1, 0);
        for (var y = y1; y < y2; ++y) {
            plotWithBrightness(~~interx, y, ~~interx, 1 - getDecimal(interx));
            plotWithBrightness(~~interx + 1, y, ~~interx + 1, y, getDecimal(interx));
            interx += gradient;
        }
        plotWithBrightness(x2, y2, x2, y2, 0);
    }

    /*var gradient = dy / dx;*/

    /*var xEnd = Math.round(x1);
    var yEnd = y1 + gradient * (xEnd - x1);
    var xGap = 1 - getDecimal(x1 + 0.5);
    var xpxl1 = xEnd;
    var ypxl1 = ~~yEnd;
    plotWithBrightness(xpxl1, ypxl1, 1 - getDecimal(yEnd) * xGap);
    plotWithBrightness(xpxl1, ypxl1 + 1, getDecimal(yEnd) * xGap);
    var intery = yEnd + gradient;

    xEnd = Math.round(x2);
    yEnd = y2 + gradient * (xEnd - x2);
    xGap = getDecimal(x2 + 0.5);
    var xpxl2 = xEnd;
    var ypxl2 = ~~yEnd;
    plotWithBrightness(xpxl2, ypxl2, 1 - getDecimal(yEnd) * xGap);
    plotWithBrightness(xpxl2, ypxl2 + 1, getDecimal(yEnd) * xGap);

    for (var i = xpxl1 + 1; i < xpxl2 - 1; i++) {
        plotWithBrightness(i, ~~intery, 1 - getDecimal(intery));
        plotWithBrightness(i, ~~intery + 1, getDecimal(intery));
    }*/
}

/*$("#checkbox-grid").click(function () {
    if ($(this).prop("checked")) {
        drawGrid(COLOR_GREY);
    } else {
        drawGrid(COLOR_TRANSPARENT);
    }
});*/

$(".btn-draw-dda").click(function () {
    var x1 = +$("#x1").val();
    var y1 = +$("#y1").val();
    var x2 = +$("#x2").val();
    var y2 = +$("#y2").val();

    drawDigitalDiffAnalyzer(x1, y1, x2, y2);
});

$(".btn-draw-brezenxem").click(function () {
    var x1 = +$("#x1").val();
    var y1 = +$("#y1").val();
    var x2 = +$("#x2").val();
    var y2 = +$("#y2").val();

    drawBrezenxem(x1, y1, x2, y2);
});

$(".btn-draw-vu").click(function () {
    var x1 = +$("#x1").val();
    var y1 = +$("#y1").val();
    var x2 = +$("#x2").val();
    var y2 = +$("#y2").val();

    drawVu(x1, y1, x2, y2);
});

$('.btn-clear').click(function () {
    drawField.width = drawField.width;

    context.translate(0, drawField.height);
    context.scale(1, -1);

    drawGrid(COLOR_GREY);

    /*if ($("#checkbox-grid").prop("checked")) {
        drawGrid(COLOR_GREY);
    } else {
        drawGrid(COLOR_TRANSPARENT);
    }*/
});
