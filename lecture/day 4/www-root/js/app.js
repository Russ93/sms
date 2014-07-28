(function() {
  var App, URL;

  App = angular.module("day4app", ['ngRoute', 'firebase']);

  URL = "https://lecture.firebaseio.com/";

  App.config([
    "$routeProvider", function($routeProvider) {
      return $routeProvider.when("/", {
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
      }).when("/detail/:id", {
        templateUrl: "views/detail.html",
        controller: "DetailCtrl"
      });
    }
  ]);

  App.filter("toArray", function() {
    "use strict";
    return function(obj) {
      if (!(obj instanceof Object)) {
        return obj;
      }
      return Object.keys(obj).filter(function(key) {
        if (key.charAt(0) !== "$") {
          return key;
        }
      }).map(function(key) {
        return Object.defineProperty(obj[key], "$key", {
          __proto__: null,
          value: key
        });
      });
    };
  });

  App.controller("HomeCtrl", [
    "$scope", "$rootScope", "$firebase", function($scope, $rootScope, $firebase) {
      $scope.items = $firebase(new Firebase(URL));
      $scope.title = "Home";
      return $scope.savePost = function() {
        $scope.items.$add($scope.newPost);
        return $scope.newPost = {};
      };
    }
  ]);

  App.controller("DetailCtrl", [
    "$scope", "$rootScope", "$routeParams", "$firebase", function($scope, $rootScope, $routeParams, $firebase) {
      $scope.title = "Detail";
      $rootScope.pageTitle = "Detail Page";
      return $scope.post = $firebase(new Firebase(URL + $routeParams.id));
    }
  ]);

  App.directive("commentsSection", [
    function() {
      return {
        restrict: "AE",
        templateUrl: "views/comments.html",
        scope: {
          postId: '@commentSection'
        },
        controller: function($scope, $firebase) {
          $scope.comments = $firebase(new Firebase(URL + $scope.postId + "/comments"));
          console.log($scope.comments);
          $scope.saveComment = function() {
            $scope.comments.$add($scope.newComment);
            $scope.newComment = {};
          };
        }
      };
    }
  ]);

}).call(this);
