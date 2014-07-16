(function() {
  var App, URL;

  App = angular.module('connecting_point', ['ngRoute', 'firebase']);

  URL = "https://vivid-fire-5420.firebaseio.com";

  App.config([
    "$routeProvider", function($routeProvider) {
      return $routeProvider.when("/", {
        templateUrl: "views/landing.html",
        controller: "LandCtrl"
      }).when("/user", {
        templateUrl: "views/user.html",
        controller: "UserCtrl"
      });
    }
  ]);

  App.run([
    "$firebaseSimpleLogin", "$rootScope", "$location", function($firebaseSimpleLogin, $rootScope, $location) {
      var conn;
      $rootScope.close = function() {
        return $rootScope.modal = false;
      };
      URL = "https://vivid-fire-5420.firebaseio.com";
      conn = new Firebase(URL);
      $rootScope.loginObj = $firebaseSimpleLogin(conn);
      $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
        return $location.path('/user');
      });
      $rootScope.$on("$firebaseSimpleLogin:logout", function(e) {
        console.log("logout");
        return $location.path('/');
      });
      return console.log("$rootScope.loginObj", $rootScope.loginObj.user);
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

  App.controller("LandCtrl", [
    "$scope", "$rootScope", "$firebase", function($scope, $rootScope, $firebase) {
      return $scope.title = "Home";
    }
  ]);

  App.controller("UserCtrl", [
    "$scope", "$rootScope", "$firebase", function($scope, $rootScope, $firebase) {
      $scope.title = "User - loginObj.user";
      $scope.conn = $firebase(new Firebase(URL + "/name"));
      $scope["new"] = function() {
        return $rootScope.modal = true;
      };
      return $scope.create = function() {
        $rootScope.modal = false;
        $scope.conn.$child("files").$add({
          name: $scope.newFile
        });
        return console.log({
          file: $scope.newFile
        });
      };
    }
  ]);

}).call(this);
