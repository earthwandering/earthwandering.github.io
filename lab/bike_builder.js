angular.module('bikeBuilderApp', [])
    .controller('bikeBuilderController', ['$scope', function($scope) {

        $scope.bikeParameters = bicycle.getBasicBikeParameters(25, 275);

        $scope.buildBike = function() {
            var bp = $scope.bikeParameters;
            console.log("About to build bike with frameColor: " + bp.frameColor);
            console.log("Xo: " + bp.Xo);
            bicycle.makeBike(bp);

        };


        $scope.someMessage = "zipper 2";


    }]);