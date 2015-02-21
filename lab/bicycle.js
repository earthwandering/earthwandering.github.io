/**
Requires snap.svg

How many points do we care about?
Back axle
Front Axle
Bottom Bracket
Seat tube meets top tube


*/



function makeBike1(svgSpace, Xo, Yo) {


}

function makeWheel(svgSpace, Xo, Yo, R, spokeCount) {
	console.log("Building wheel: Xo:" + Xo + ", Yo:" + Yo + ", R:" + R + ", spokeCount:" + spokeCount);
	var wheel = svgSpace.group();
	
	wheel.centerX = Xo;
	wheel.centerY = Yo;
	wheel.radius = R;
	wheel.angle = 0;

	var rim = svgSpace.circle(wheel.centerX, wheel.centerY, wheel.radius); 
	var tire = svgSpace.circle(wheel.centerX, wheel.centerY, wheel.radius);

	rim.attr({
		fill-opacity: 0.0,
		stroke: "#5555ff", 
		strokeWidth: 2 
	});


	
	var spoke1 = paper.path("M" + wheel1.centerx + "," + wheel1.centery + "L" + (wheel1.centerx + wheel1.radius) + "," + wheel1.centery);
	console.log("spoke 1 created");
	
	console.log("rim1 created");
	
	wheel1.add(rim1);
	wheel1.add(spoke1);
	
	console.log("wheel1 grouped");			

	wheel1.attr({
		fill: "#ffffff",
		stroke: "#5555ff", 
		strokeWidth: 2 
	});



}

