/**
Requires snap.svg
*/

var bicycle = {
    fullDebugOn: false,

    makeBasicBike: function(svgSpace, Xo, Yo) {
        return this.makeBike(svgSpace, this.getBasicBikeParameters(Xo, Yo));
    },

    getBasicBikeParameters: function(Xo, Yo) {
        var bp = {};
        bp.Xo = Xo;
        bp.Yo = Yo;
        bp.frameColor = !this.fullDebugOn ? "#FF0000" : "#555555";
        bp.bareMetal = !this.fullDebugOn ? "#AAAAAA" : "#333333";
        bp.frameThickness = !this.fullDebugOn ? 8 : 1;
        bp.frameAttrs = {stroke: bp.frameColor, strokeWidth: bp.frameThickness};
        bp.axleY = Yo-50;
        bp.topTubeY = Yo - 180;

        bp.backAxleC = this.point(bp.Xo + 100, bp.axleY);
        bp.frontAxleC = this.point(bp.Xo + 373, bp.axleY);
        bp.seatJunctionC = this.point(bp.Xo + 190, bp.topTubeY);
        bp.bottomBracketC = this.point(bp.Xo + 210, bp.axleY);

        bp.topTubeHeadJunctionC = this.point(bp.Xo + 335, bp.topTubeY);
        bp.downTubeHeadJunctionC = this.point(bp.Xo + 338, bp.topTubeY + 25);

        bp.junctions = [bp.backAxleC, bp.frontAxleC, bp.seatJunctionC, bp.topTubeHeadJunctionC, bp.downTubeHeadJunctionC, bp.bottomBracketC];

        return bp;
    }, //end getBasicBikeParameters

    generateSeat: function(bikeSvg, seatPostC) {
        var x = seatPostC.x;
        var y = seatPostC.y;

        var seat = bikeSvg.svgSpace.group();

        var rail = bikeSvg.svgSpace.path(
            "M" + x + "," + (y - 2) +
            "L" + (x - 15) + "," + (y - 4) +
            "L" + (x - 20) + "," + (y - 18)
        );
        rail.attr({strokeWidth: 2, stroke: "#555555", "fill-opacity": 0.0});
        seat.add(rail);

        var saddle = bikeSvg.svgSpace.path(
            "M" + x + "," + y + //start at post
                "L" + (x + 41) + "," + (y - 11) + //bottom edge of front
                "L" + (x + 43) + "," + (y - 15) + //top edge of front
                "L" + (x + 7) + "," + (y - 15) + //middle of saddle top
                "L" + (x - 20) + "," + (y - 20) + // top of back
                "L" + (x - 22) + "," + (y - 18) +
                "Z"
        );
        saddle.attr({stroke: "#000000", strokeWidth: 2, fill: "#333333"});
        seat.add(saddle);

        return seat;
    },

    generateHandlebars: function(bikeSvg, stemC) {
        var bp = bikeSvg.bikeParameters;
        var handlebars = bikeSvg.svgSpace.group();

        var stemEndC = this.point((stemC.x + 25),(stemC.y - 8));
        var stemTop = bikeSvg.svgSpace.path(this.getPathStringFromPoints(stemC, stemEndC));
        stemTop.attr({stroke: bp.bareMetal, strokeWidth: (bp.frameThickness - 2)});
        handlebars.add(stemTop);

        var stemJoint = bikeSvg.svgSpace.circle(stemC.x, stemC.y,((bp.frameThickness - 2)/2));
        stemJoint.attr({stroke: bp.bareMetal, fill: bp.bareMetal});
        handlebars.add(stemJoint);

        var c1 = this.point((stemEndC.x + 35), (stemEndC.y - 10));
        var c2 = this.point((stemEndC.x + 45), (stemEndC.y + 40));
        var p2 = this.point((stemEndC.x + 10), (stemEndC.y + 40));

        var drops = this.generateCurve(bikeSvg.svgSpace, stemEndC, c1, c2, p2, false);
        drops.attr({stroke: "#333333", "fill-opacity": 0.0, strokeWidth: (bp.frameThickness - 2)});
        handlebars.add(drops);

        var hoodP1 = this.point((stemEndC.x + 24), (stemEndC.y + 4));
        var hoodP2 = this.point((stemEndC.x + 33), (stemEndC.y - 6));

        var brakeStartC = hoodP2.addCoords(-1, 1);
        var brakeC1 = brakeStartC.addCoords(9, 8);
        var brakeEndC = brakeStartC.addCoords(10, 30);
        var brakeC2 = brakeEndC.addCoords(3, -15);

        var brakeLever = this.generateCurve(bikeSvg.svgSpace, brakeStartC, brakeC1, brakeC2, brakeEndC);
        brakeLever.attr({stroke: bp.bareMetal, strokeWidth: 3, "fill-opacity": 0.0});
        handlebars.add(brakeLever);

        var hoods = bikeSvg.svgSpace.path(this.getPathStringFromPoints(hoodP1, hoodP2));
        hoods.attr({stroke: "#000000", strokeWidth: 10});
        handlebars.add(hoods);

        return handlebars;
    },

    makeBike: function(svgSpace, bikeParameters) {
        var bp = bikeParameters;

        var bikeSvg = svgSpace.group();
        bikeSvg.svgSpace = svgSpace;
        bikeSvg.bikeParameters = bikeParameters;

        console.log("about to make bicycle.  Xo:" + bp.Xo + ", Yo:" + bp.Yo);

        var wheel1 = bicycle.makeWheel(svgSpace, bp.backAxleC.x, bp.backAxleC.y, 90, 32);
        bikeSvg.add(wheel1);

        var wheel2 = bicycle.makeWheel(svgSpace, bp.frontAxleC.x, bp.frontAxleC.y, 90, 32);
        bikeSvg.add(wheel2);

        var seatStay = svgSpace.path(this.getPathStringFromPoints(bp.backAxleC, bp.seatJunctionC));
        seatStay.attr(bp.frameAttrs);
        bikeSvg.add(seatStay);

        var chainStay = svgSpace.path(this.getPathStringFromPoints(bp.backAxleC, bp.bottomBracketC));
        chainStay.attr(bp.frameAttrs);
        bikeSvg.add(chainStay);

        var seatPostTopC = this.getPointOnParallelLine(bp.seatJunctionC, 40, bp.bottomBracketC, bp.seatJunctionC);
        var seatPost = svgSpace.path(this.getPathStringFromPoints(bp.seatJunctionC, seatPostTopC))
        seatPost.attr({stroke: bp.bareMetal, strokeWidth: bp.frameThickness - 2});
        bikeSvg.add(seatPost);

        var seat = this.generateSeat(bikeSvg, seatPostTopC);
        bikeSvg.add(seat);

        var stemTopC = this.getPointOnParallelLine(bp.topTubeHeadJunctionC, 33, bp.downTubeHeadJunctionC, bp.topTubeHeadJunctionC);
        var stem = svgSpace.path(this.getPathStringFromPoints(bp.topTubeHeadJunctionC, stemTopC));
        stem.attr({stroke: bp.bareMetal, strokeWidth: bp.frameThickness - 2});
        bikeSvg.add(stem);

        var handlebars = this.generateHandlebars(bikeSvg, stemTopC);
        bikeSvg.add(handlebars);

        var topTube = svgSpace.path(this.getPathStringFromPoints(bp.seatJunctionC, bp.topTubeHeadJunctionC));
        topTube.attr(bp.frameAttrs);
        bikeSvg.add(topTube);

        var downTube = svgSpace.path(this.getPathStringFromPoints(bp.bottomBracketC, bp.downTubeHeadJunctionC));
        downTube.attr(bp.frameAttrs);
        bikeSvg.add(downTube);

        var seatTube = svgSpace.path(this.getPathStringFromPoints(bp.bottomBracketC, bp.seatJunctionC));
        seatTube.attr(bp.frameAttrs);
        bikeSvg.add(seatTube)

        var headTube = svgSpace.path(this.getPathStringFromPoints(bp.topTubeHeadJunctionC, bp.downTubeHeadJunctionC));
        headTube.attr(bp.frameAttrs);
        bikeSvg.add(headTube);

        var forkC1 = this.point((bp.downTubeHeadJunctionC.x + 7), (bp.downTubeHeadJunctionC.y + 50));
        var forkC2 = this.point((bp.frontAxleC.x - 20), (bp.frontAxleC.y - 20));
        var fork = this.generateCurve(svgSpace, bp.downTubeHeadJunctionC, forkC1, forkC2, bp.frontAxleC, false);
        fork.attr({"fill-opacity": 0.0, stroke: bp.frameColor, strokeWidth: bp.frameThickness});
        bikeSvg.add(fork);

        bicycle.paintJunctions(bikeSvg);

        bicycle.animateWheel(wheel1);
        bicycle.animateWheel(wheel2);
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

    paintJunctions: function(bikeSvg) {
        bikeSvg.bikeParameters.junctions.forEach(function (item) {
            var junctionPaint = bikeSvg.svgSpace.circle(item.x, item.y, bikeSvg.bikeParameters.frameThickness/2);
            junctionPaint.attr({stroke: bikeSvg.bikeParameters.frameColor, "fill": bikeSvg.bikeParameters.frameColor });
        });

    },

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

    },

    /**
     * TODO: This is a first attempt implementing this one.  I'll need to check it later
     * @param startPoint
     * @param length
     * @param targetPoint1
     * @param targetPoint2
     * @returns {*}
     */
    getPointOnParallelLine: function(startPoint, length, targetPoint1, targetPoint2) {
        var slope = Math.atan((targetPoint2.x - targetPoint1.x)/(targetPoint2.y - targetPoint1.y));

        var change = this.point(-(Math.sin(slope) * length), -(Math.cos(slope) * length));

        var result = startPoint.addPoint(change);
        console.log("slope:" + slope + " change:" + change + " result: " + result + " start:" + startPoint);

        return result;
    },

    getPathStringFromPoints: function(point1, point2) {
        return "M" + point1.x + "," + point1.y + "L" + point2.x + "," + point2.y
    },

    generateCurve: function(svgSpace, p1, c1, c2, p2, debugOn) {
        console.log("Received curve points. p1:" + p1 + " p2:" + p2 + " c1:" + c1 + " c2:" + c2);

        var pathString =
            "M" + p1.x + "," + p1.y +
            "C" + c1.x + "," + c1.y +
            " " + c2.x + "," + c2.y +
            " " + p2.x + "," + p2.y;

        console.log("Creating curve with path: " + pathString);

        var curve = svgSpace.path(pathString);

        if (debugOn || this.fullDebugOn) {
            console.log("Showing debug lines");
            var cLine1 = svgSpace.path(this.getPathStringFromPoints(p1, c1));
            cLine1.attr({stroke: "#FF0000", strokeWidth: 1});

            var cLine2 = svgSpace.path(this.getPathStringFromPoints(p2, c2));
            cLine2.attr({stroke: "#FF0000", strokeWidth: 1});
        }
        return curve;
    },

    point: function(x, y) {
        return {
            "x": x,
            "y": y,
            toString: function () {
                return "(" + this.x + "," + this.y + ")";
            },
            addPoint: function (point2) {
                return bicycle.point(this.x + point2.x, this.y + point2.y);
            },
            addCoords: function(x2, y2) {
                return bicycle.point(this.x + x2, this.y + y2);
            }
        }
    }


} //end bicycle

