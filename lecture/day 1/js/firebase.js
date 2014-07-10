angular.module("firebase", ["firebase"]).controller(
"Firetube", ["$scope", "$firebase", function($scope, $firebase){
    var ref = new Firebase("https://ng-conf.firebaseio.com/");
    $scope.comments = $firebase(ref)
    
    $scope.addComment = function(e){
        if(e.keycode != 13) return;
        
    }
}])