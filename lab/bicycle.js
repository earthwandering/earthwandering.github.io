/**
Requires snap.svg
*/

var bike = {

    makeBike: function(svgSpace, Xo, Yo) {
        console.log("about to make bike.  Xo:" + Xo + ", Yo:" + Yo);

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
    }
} //end bike

