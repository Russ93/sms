var App = angular.module('day3app', ['ngRoute']);

App.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/detail',{
			templateUrl:'views/detail.html',
			controller: 'DetailCtrl'
		})
}])

App.controller('HomeCtrl', ['$scope', "$rootScope", function ($scope, $rootScope){
	$scope.title = "Home";
	$rootScope.pageTitle = "Home";
	$scope.posts = [
	{
		"Title": "Are you ready for the truth?",
		"Content": "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man."
	},
	{
		"Title": "I gotta piss",
		"Content": "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass."
	}
	]
}]);

App.controller('DetailCtrl', ['$scope', "$rootScope", function ($scope, $rootScope){
	$scope.title = "Detail";
	$rootScope.pageTitle = "Detail";
	$scope.clickMe = function(){
		alert('OOOOHHHH NOOOOOES!!');
	}
}])