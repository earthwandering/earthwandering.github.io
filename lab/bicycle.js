/**
Requires snap.svg
*/

var bike = {

    point: function(x, y) {
        return {"x": x, "y": y};
    },

    makeBike: function(svgSpace, Xo, Yo) {
        console.log("about to make bike.  Xo:" + Xo + ", Yo:" + Yo);

        var frameColor = "#FF0000";

        var axleY = Yo-50;
        var backAxleC = this.point(Xo + 100, axleY);
        var frontAxleC = this.point(Xo + 350, axleY);

        var topTubeY = Yo - 180;
        var seatJunctionC = this.point(Xo + 185, topTubeY);
        var topTubeHeadJunctionC = this.point(Xo + 305, topTubeY);
        var downTubeHeadJunctionC = this.point(Xo + 308, topTubeY + 25);

        var bottomBracketC = this.point(Xo + 205, axleY);

        var wheel1 = bike.makeWheel(svgSpace, backAxleC.x, backAxleC.y, 90, 32);
        var wheel2 = bike.makeWheel(svgSpace, frontAxleC.x, frontAxleC.y, 90, 32);

        var seatStay = svgSpace.path("M" + backAxleC.x + "," + backAxleC.y + "L" + seatJunctionC.x + "," + seatJunctionC.y);
        seatStay.attr({stroke: frameColor, strokeWidth: 10});

        var chainStay = svgSpace.path("M" + backAxleC.x + "," + backAxleC.y + "L" + bottomBracketC.x + "," + bottomBracketC.y);
        chainStay.attr({stroke: frameColor, strokeWidth: 10});

        var topTube = svgSpace.path("M" + seatJunctionC.x + "," + seatJunctionC.y + "L" + topTubeHeadJunctionC.x + "," + topTubeHeadJunctionC.y);
        topTube.attr({stroke: frameColor, strokeWidth: 10});

        var downTube = svgSpace.path("M" + bottomBracketC.x + "," + bottomBracketC.y + "L" + downTubeHeadJunctionC.x + "," + downTubeHeadJunctionC.y);
        downTube.attr({stroke: frameColor, strokeWidth: 10});

        var seatTube = svgSpace.path("M" + bottomBracketC.x + "," + bottomBracketC.y + "L" + seatJunctionC.x + "," + seatJunctionC.y);
        seatTube.attr({stroke: frameColor, strokeWidth: 10});

        var headTube = svgSpace.path("M" + topTubeHeadJunctionC.x + "," + topTubeHeadJunctionC.y + "L" + downTubeHeadJunctionC.x + "," + downTubeHeadJunctionC.y);
        headTube.attr({stroke: frameColor, strokeWidth: 10});

        var curveExaggeration = 10;
        var forkCurveString =
            "M" + downTubeHeadJunctionC.x + "," + downTubeHeadJunctionC.y +
            "C" +
            (downTubeHeadJunctionC.x - 2) + "," + (downTubeHeadJunctionC.y + curveExaggeration) + " " +
            (frontAxleC.x - 2) + "," + (frontAxleC.y + curveExaggeration) + " " +
            frontAxleC.x + "," + frontAxleC.y;

        var fork = svgSpace.path(forkCurveString);
        fork.attr({"fill-opacity": 0.0, stroke: frameColor, strokeWidth: 10});

        bike.animateWheel(wheel1);
        bike.animateWheel(wheel2);
    }, //makeBike



    /**
     * @param svgSpace as Snap
     * @param Xo as Number
     * @param Yo as Number
     * @param R as Number
     * @param spokeCount as Number
     */
    makeWheel: function(svgSpace, Xo, Yo, R, spokeCount) {
        console.log("Building wheel: Xo:" + Xo + ", Yo:" + Yo + ", R:" + R + ", spokeCount:" + spokeCount);
        var wheel = svgSpace.group();

        wheel.svgSpace = svgSpace;
        wheel.centerX = Xo;
        wheel.centerY = Yo;
        wheel.radius = R;
        wheel.rimRadius = wheel.radius * .9;
        wheel.tireWidth = wheel.radius * .08;
        wheel.angle = 0;
        wheel.metalColor = "#BBBBBB";
        wheel.tireColor = "#000000";
        wheel.spokeCount = spokeCount;

        var rim = svgSpace.circle(wheel.centerX, wheel.centerY, wheel.rimRadius);
        rim.attr({
            "fill-opacity": 0.0,
            stroke: wheel.metalColor,
            strokeWidth: 2
        });
        wheel.add(rim);
        console.log("rim created");

        var tire = svgSpace.circle(wheel.centerX, wheel.centerY, wheel.radius);
        tire.attr({
            "fill-opacity": 0.0,
            stroke: wheel.tireColor,
            strokeWidth: wheel.tireWidth
        });
        wheel.add(tire);
        console.log("tire created");

        this.makeSpokes(wheel);

        console.log("wheel done");
        return wheel;
    }, //end makeWheel

    makeSpokes: function(wheel) {
        if (wheel.spokeCount < 1) {
            wheel.spokeCount = 1;
        }

        var spokeAngle = 0.0;
        var spokeSpacing = (Math.PI * 2) / wheel.spokeCount;
        console.log("About to create " + wheel.spokeCount + " spoke(s)")
        for (var i = 0; i < wheel.spokeCount; i++) {
            var spoke = this.makeSpoke(wheel, spokeAngle);
            spokeAngle += spokeSpacing;
            //add spoke to wheel
            wheel.add(spoke);
        }
    },

    makeSpoke: function(wheel, angleInRad) {
        //make and return spokes
        console.log("Creating spoke at angle: " + angleInRad);
        var spokeLength = wheel.rimRadius;

        var spokeEndX = wheel.centerX + (Math.sin(angleInRad) * spokeLength);
        var spokeEndY = wheel.centerY + (Math.cos(angleInRad) * spokeLength);
        console.log("Spoke at angle: " + angleInRad + " and length: " + spokeLength + " ends at point: (" + spokeEndX + "," + spokeEndY + ")");
        var spokePath =
            "M" + wheel.centerX + "," + wheel.centerY +
            "L" + spokeEndX + "," + spokeEndY;
        var spoke = wheel.svgSpace.path(spokePath);
        spoke.attr({
            stroke: wheel.metalColor,
            strokeWidth: 2
        });
        console.log("spoke created: " + spokePath);

        return spoke;
    },

    animateWheel: function(wheel) {
        //console.log("Wheel angle: " + wheel1.angle);

        wheel.animate({ transform: 'r360,' + wheel.centerX + ',' + wheel.centerY}, 1000, mina.bounce );

    }
} //end bike

