var App = angular.module('day4app', ['ngRoute', 'firebase']);
var myDataRef = new Firebase('https://q4fxwkikfk9.firebaseio-demo.com/');

stuff = {
	"step1": "myDataRef.set('User ' + name + ' says ' + text)",
	"step2": "myDataRef.set({name: name, text: text})",
	"step3": "myDataRef.push({name: name, text: text})"
}

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

App.filter('toArray', function () {
    'use strict';
 
    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }
 
        return Object.keys(obj).filter(function(key){if(key.charAt(0) !== "$") {return key;}}).map(function (key) {
            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    };
});

App.controller('HomeCtrl', ['$scope', "$rootScope", "$firebase",function ($scope, $rootScope, $firebase){
	var URL;
	$scope.title = "Home";
	$rootScope.pageTitle = "Home";
	URL = "https://vivid-fire-5420.firebaseio.com/";
	$scope.items = $firebase(new Firebase(URL));
	// $scope.items.$set($scope.posts);
	$scope.savePost = function(){
		$scope.items.$add($scope.newPost);
		$scope.newPost = {};
	}
}]);

App.controller('DetailCtrl', ['$scope', "$rootScope", function ($scope, $rootScope){
	$scope.title = "Detail";
	$rootScope.pageTitle = "Detail";
	$scope.clickMe = function(){
		alert('OOOOHHHH NOOOOOES!!');
	}
}])