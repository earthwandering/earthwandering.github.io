

var bikeParams = bicycle.getBasicBikeParameters(25, 275);

function buildBike() {
	var bp = bikeParams;
	console.log("About to build bike with frameColor: " + bp.frameColor);
	console.log("Xo: " + bp.Xo);
	bicycle.makeBike(bp);
};
