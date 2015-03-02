angular.module('todoApp', [])
    .controller('whatsUpController', ['$scope', function($scope) {
        var counter = 0;
        $scope.todos = [
            {text:'learn angular', done:true},
            {text:'build an angular app. oh yeah?', done:false}];

        $scope.addTodo = function() {
            $scope.todos.push({text:$scope.todoText, done:false});
            $scope.todoText = '';
        };

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        $scope.archive = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) $scope.todos.push(todo);
            });
        };

        $scope.zipper = "some text for zipper!";

        $scope.someFunction = function() {
            counter++;
            console.log("someFunctionCalled counter: " + counter);
            return "some function's text result";
        };

        $scope.someFunctionResult = $scope.someFunction();

        $scope.someBooleanFunction = function() {
            return true;
        }


    }]);


