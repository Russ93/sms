(function() {
  var App, URL;

  App = angular.module('connecting_point', ['ngRoute', 'firebase', 'ngResource', 'base64']);

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

  App.factory("AngularGit", function($resource) {
    return $resource("https://api.github.com/repos/angular/angular.js/:category/:sha");
  });

  App.factory("GetRepos", function($resource) {
    return $resource("https://api.github.com/users/:username/repos", null, {
      'get': {
        method: 'get',
        isArray: true
      }
    });
  });

  App.factory("GetCommits", function($resource) {
    return $resource("https://api.github.com/repos/:owner/:repo/commits", null, {
      'get': {
        method: 'get',
        isArray: true
      }
    });
  });

  App.factory("GitTrees", function($resource) {
    return $resource("https://api.github.com/repos/:owner/:repo/git/trees/:sha?recursive=1");
  });

  App.factory("GetContents", function($resource) {
    return $resource("https://api.github.com/repos/:owner/:repo/contents/:path", null, {
      'get': {
        method: 'get',
        isArray: true
      }
    });
  });

  App.factory("GetFile", function($resource) {
    return $resource("https://api.github.com/repos/:owner/:repo/contents/:path");
  });

  App.run([
    "$firebaseSimpleLogin", "$rootScope", "$location", "GetRepos", function($firebaseSimpleLogin, $rootScope, $location, GetRepos) {
      var conn;
      $rootScope.close = function() {
        return $rootScope.modal = false;
      };
      URL = "https://vivid-fire-5420.firebaseio.com";
      conn = new Firebase(URL);
      $rootScope.loginObj = $firebaseSimpleLogin(conn);
      return $rootScope.$on("$firebaseSimpleLogin:logout", function(e) {
        console.log("logout");
        $location.path('/');
      });
    }
  ]);

  App.filter("toArray", function() {
    "use strict";
    return function(obj) {
      if (!(obj instanceof Object)) {
        return obj;
      }
      return Object.keys(obj.filter(function(key) {
        if (key.charAt(0 !== "$")) {
          return key;
        }
      }).map(function(key) {
        return Object.defineProperty(obj[key], "$key", {
          __proto__: null,
          value: key
        });
      }));
    };
  });

  App.controller("LandCtrl", [
    "$scope", "$rootScope", "$firebase", function($scope, $rootScope, $firebase) {
      return $scope.title = "Home";
    }
  ]);

  App.controller("UserCtrl", [
    "$scope", "$rootScope", "$firebase", "GetRepos", "GetCommits", "GetContents", "GetFile", "$base64", function($scope, $rootScope, $firebase, GetRepos, GetCommits, GetContents, GetFile, $base64) {
      var secret, trim;
      $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
        var params;
        console.log(user.username);
        params = {
          username: user.username
        };
        $scope.repos = GetRepos.get(params);
        return console.log($scope.repos);
      });
      $scope.title = "User - loginObj.user";
      $scope.conn = $firebase(new Firebase(URL + "/name"));
      secret = "c2e8b102ca576e0060f6dc493956288170d6eaaa";
      trim = function(x) {
        return x.replace(/^\s+|\s+$/gm, '');
      };
      $scope.openItem = function($event) {
        var params;
        if ($event.target.children[0] === void 0) {
          params = {
            owner: $rootScope.loginObj.user.username,
            repo: $scope.repos[$scope.repo].name,
            path: trim($event.target.textContent)
          };
          return GetFile.get(params);
        }
      };
      $scope["new"] = function() {
        return $rootScope.modal = true;
      };
      $scope.create = function() {
        $rootScope.modal = false;
        $scope.conn.$child("files".$add({
          name: $scope.newFile
        }));
        return console.log({
          file: $scope.newFile
        });
      };
      $scope.$watch('sha', function(newValue, oldValue) {
        var params;
        if ($rootScope.loginObj.user !== null) {
          params = {
            owner: $rootScope.loginObj.user.username,
            repo: $scope.repos[$scope.repo].name
          };
          $scope.repoContents = GetContents.get(params);
          return console.log($scope.repoContents);
        }
      });
      $scope.$watch('repo', function(newValue, oldValue) {
        var params;
        if ($rootScope.loginObj.user !== null) {
          params = {
            owner: $rootScope.loginObj.user.username,
            repo: $scope.repos[$scope.repo].name
          };
          return GetCommits.get(params, function(data) {
            return $scope.sha = data[data.length - 1].sha;
          });
        }
      });
    }
  ]);

  App.directive("folder", [
    function() {
      return {
        restrict: "AE",
        template: '<li ng-repeat="cont in contents" file="cont" repo="repo"></li>',
        scope: {
          folder: "=",
          repo: '='
        },
        controller: function($rootScope, $scope, GetContents) {
          var params;
          console.log($scope.folder);
          params = {
            owner: $rootScope.loginObj.user.username,
            repo: $scope.repo,
            path: $scope.folder
          };
          return $scope.contents = GetContents.get(params);
        }
      };
    }
  ]);

  App.directive("file", [
    '$compile', function($compile) {
      return {
        restrict: "AE",
        template: '{{file.name}}',
        scope: {
          file: "=",
          repo: "="
        },
        link: function($scope, $element, attrs) {
          if ($scope.file.type === 'dir') {
            $element.append('<ul folder="file.path" repo="repo"></ul>');
            return $compile($element.contents())($scope);
          }
        }
      };
    }
  ]);

}).call(this);
