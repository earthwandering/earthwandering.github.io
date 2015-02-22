/**
Requires snap.svg
*/

var bike = {

    point: function(x, y) {
        return {"x": x, "y": y};
    },

    getBasicBikeParameters: function(Xo, Yo) {
        var bp = {};
        bp.Xo = Xo;
        bp.Yo = Yo;
        bp.frameColor = "#FF0000";
        bp.frameAttrs = {stroke: bp.frameColor, strokeWidth: 10};
        bp.axleY = Yo-50;
        bp.topTubeY = Yo - 180;

        bp.backAxleC = this.point(bp.Xo + 100, bp.axleY);
        bp.frontAxleC = this.point(bp.Xo + 350, bp.axleY);
        bp.seatJunctionC = this.point(bp.Xo + 185, bp.topTubeY);
        bp.topTubeHeadJunctionC = this.point(bp.Xo + 305, bp.topTubeY);
        bp.downTubeHeadJunctionC = this.point(bp.Xo + 308, bp.topTubeY + 25);

        bp.bottomBracketC = this.point(bp.Xo + 205, bp.axleY);

        return bp;
    }, //end getBasicBikeParameters

    getPathStringFromPoints: function(point1, point2) {
        return "M" + point1.x + "," + point1.y + "L" + point2.x + "," + point2.y
    },

    makeBasicBike: function(svgSpace, Xo, Yo) {
        return this.makeBike(svgSpace, this.getBasicBikeParameters(Xo, Yo));
    },

    makeBike: function(svgSpace, bikeParameters) {
        var bp = bikeParameters;

        console.log("about to make bike.  Xo:" + bp.Xo + ", Yo:" + bp.Yo);


        var wheel1 = bike.makeWheel(svgSpace, bp.backAxleC.x, bp.backAxleC.y, 90, 32);
        var wheel2 = bike.makeWheel(svgSpace, bp.frontAxleC.x, bp.frontAxleC.y, 90, 32);

        var seatStay = svgSpace.path(this.getPathStringFromPoints(bp.backAxleC, bp.seatJunctionC));
        seatStay.attr(bp.frameAttrs);

        var chainStay = svgSpace.path(this.getPathStringFromPoints(bp.backAxleC, bp.bottomBracketC));
        chainStay.attr(bp.frameAttrs);

        var topTube = svgSpace.path(this.getPathStringFromPoints(bp.seatJunctionC, bp.topTubeHeadJunctionC));
        topTube.attr(bp.frameAttrs);

        var downTube = svgSpace.path(this.getPathStringFromPoints(bp.bottomBracketC, bp.downTubeHeadJunctionC));
        downTube.attr(bp.frameAttrs);

        var seatTube = svgSpace.path(this.getPathStringFromPoints(bp.bottomBracketC, bp.seatJunctionC));
        seatTube.attr(bp.frameAttrs);

        var headTube = svgSpace.path(this.getPathStringFromPoints(bp.topTubeHeadJunctionC, bp.downTubeHeadJunctionC));
        headTube.attr(bp.frameAttrs);

        var curveExaggeration = 10;
        var forkCurveString =
            "M" + bp.downTubeHeadJunctionC.x + "," + bp.downTubeHeadJunctionC.y +
            "C" +
            (bp.downTubeHeadJunctionC.x - 2) + "," + (bp.downTubeHeadJunctionC.y + curveExaggeration) + " " +
            (bp.frontAxleC.x - 2) + "," + (bp.frontAxleC.y + curveExaggeration) + " " +
            bp.frontAxleC.x + "," + bp.frontAxleC.y;

        var fork = svgSpace.path(forkCurveString);
        fork.attr({"fill-opacity": 0.0, stroke: bp.frameColor, strokeWidth: 10});

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

