(function() {
  var App, URL;

  App = angular.module('connecting_point', ['ngRoute', 'firebase', 'ngResource', 'ui.ace']);

  URL = "https://vivid-fire-5420.firebaseio.com";

  App.config([
    "$routeProvider", function($routeProvider) {
      return $routeProvider.when("/", {
        templateUrl: "views/landing.html",
        controller: "LandCtrl"
      }).when("/user", {
        templateUrl: "views/user.html",
        controller: "UserCtrl"
      }).when("/user/:session", {
        templateUrl: "views/user.html",
        controller: "UserCtrl"
      });
    }
  ]);

  App.run([
    "$firebaseSimpleLogin", "$rootScope", "$location", "GetRepos", function($firebaseSimpleLogin, $rootScope, $location, GetRepos) {
      var conn;
      $rootScope.close = function() {
        return $rootScope.modal = false;
      };
      URL = "https://vivid-fire-5420.firebaseio.com";
      conn = new Firebase(URL);
      $rootScope.loginObj = $firebaseSimpleLogin(conn);
      $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
        if ($location.$$path === "/") {
          return $location.path('/user');
        }
      });
      return $rootScope.$on("$firebaseSimpleLogin:logout", function(e) {
        console.log("logout");
        $location.path('/');
      });
    }
  ]);

  App.controller("LandCtrl", [
    "$scope", "$rootScope", "$firebase", "$location", function($scope, $rootScope, $firebase, $location) {
      return $scope.title = "Home";
    }
  ]);

  App.controller("UserCtrl", [
    "$scope", "$rootScope", "$routeParams", "$firebase", "GetRepos", "GetContents", "GetFile", function($scope, $rootScope, $routeParams, $firebase, GetRepos, GetContents, GetFile) {
      var editor, secret, trim;
      $rootScope.session = $firebase(new Firebase(URL + "/sessions"));
      if ($routeParams.session != null) {
        $rootScope.currentSession = $routeParams.session;
        $rootScope.location = $firebase(new Firebase(URL + "/sessions/" + $routeParams.session));
        $rootScope.location.$on('loaded', function(value) {
          console.log("URL", URL + value);
          $rootScope.location = URL + value;
          $rootScope.currentFile = $rootScope.location.replace("https://vivid-fire-5420.firebaseio.com", "");
          $rootScope.code = $firebase(new Firebase(URL + value));
          return $rootScope.code.$on('change', function(value) {
            console.log($rootScope.code);
            return $rootScope.aceModel = $rootScope.code.$value;
          });
        });
      }
      $scope.modes = ['Scheme', 'XML', 'Javascript'];
      $scope.mode = $scope.modes[0];
      $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
        var params;
        console.log(user);
        params = {
          username: user.username,
          access_token: user.accessToken
        };
        $scope.repos = GetRepos.get(params);
        console.log("repos", $scope.repos);
        return console.log("params", params);
      });
      editor = null;
      $scope.aceOption = {
        mode: $scope.mode.toLowerCase(),
        theme: 'Chrome',
        onChange: function(something) {
          $rootScope.code.$set(editor.getSession().getValue());
        },
        onLoad: function(_ace) {
          editor = _ace;
          return $scope.modeChanged = function() {
            return _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
          };
        }
      };
      $scope.title = "User - loginObj.user";
      $scope.conn = $firebase(new Firebase(URL + "/name"));
      secret = "c2e8b102ca576e0060f6dc493956288170d6eaaa";
      trim = function(x) {
        return x.replace(/^\s+|\s+$/gm, '');
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
      $scope.$watch('repo', function(newValue, oldValue) {
        var params;
        if ($rootScope.loginObj.user != null) {
          params = {
            owner: $rootScope.loginObj.user.username,
            repo: $scope.repos[$scope.repo].name,
            access_token: $rootScope.loginObj.user.accessToken
          };
          $scope.repoContents = GetContents.get(params);
          return console.log($scope.repoContents);
        }
      });
    }
  ]);

  App.filter("base64", function() {
    return function(string) {
      var Base64;
      Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
          var a, f, i, n, o, r, s, t, u;
          t = "";
          n = void 0;
          r = void 0;
          i = void 0;
          s = void 0;
          o = void 0;
          u = void 0;
          a = void 0;
          f = 0;
          e = Base64._utf8_encode(e);
          while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
              u = a = 64;
            } else {
              if (isNaN(i)) {
                a = 64;
              }
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
          }
          return t;
        },
        decode: function(e) {
          var a, f, i, n, o, r, s, t, u;
          t = "";
          n = void 0;
          r = void 0;
          i = void 0;
          s = void 0;
          o = void 0;
          u = void 0;
          a = void 0;
          f = 0;
          e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u !== 64) {
              t = t + String.fromCharCode(r);
            }
            if (a !== 64) {
              t = t + String.fromCharCode(i);
            }
          }
          t = Base64._utf8_decode(t);
          return t;
        },
        _utf8_encode: function(e) {
          var n, r, t;
          e = e.replace(/\r\n/g, "\n");
          t = "";
          n = 0;
          while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
              t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
              t += String.fromCharCode(r >> 6 | 192);
              t += String.fromCharCode(r & 63 | 128);
            } else {
              t += String.fromCharCode(r >> 12 | 224);
              t += String.fromCharCode(r >> 6 & 63 | 128);
              t += String.fromCharCode(r & 63 | 128);
            }
            n++;
          }
          return t;
        },
        _utf8_decode: function(e) {
          var c1, c2, c3, n, r, t;
          t = "";
          n = 0;
          r = c1 = c2 = 0;
          while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
              t += String.fromCharCode(r);
              n++;
            } else if (r > 191 && r < 224) {
              c2 = e.charCodeAt(n + 1);
              t += String.fromCharCode((r & 31) << 6 | c2 & 63);
              n += 2;
            } else {
              c2 = e.charCodeAt(n + 1);
              c3 = e.charCodeAt(n + 2);
              t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
              n += 3;
            }
          }
          return t;
        }
      };
      if (string != null) {
        return Base64.decode(string);
      } else {
        return string;
      }
    };
  });

  App.directive("folder", [
    function() {
      return {
        restrict: "AE",
        template: '<li ng-repeat="cont in contents" file="cont" repo="repo" ng-class="{ folder: cont.type == \'dir\' }"></li>',
        scope: {
          folder: "=",
          repo: '=',
          contents: '='
        },
        controller: function($rootScope, $scope, GetContents) {}
      };
    }
  ]);

  App.directive("file", [
    '$compile', function($compile) {
      return {
        restrict: "AE",
        template: '<span ng-click="openItem()">{{file.name}}</span>',
        scope: {
          file: "=",
          repo: "="
        },
        controller: function($scope, $rootScope, $firebase, GetFile, GetContents, $filter) {
          var conn;
          conn = $firebase(new Firebase(URL + "/" + $rootScope.loginObj.user.username));
          return $scope.openItem = function() {
            var params;
            params = {
              owner: $rootScope.loginObj.user.username,
              repo: $scope.repo,
              path: $scope.file.path,
              access_token: $rootScope.loginObj.user.accessToken
            };
            $rootScope.location = "/" + $rootScope.loginObj.user.username + "/" + $scope.repo + "/" + $scope.file.path.replace(".", "-");
            if ($scope.file.type !== 'dir') {
              $rootScope.file = GetFile.get(params);
              return $rootScope.file.$promise.then(function() {
                var child;
                $rootScope.aceModel = $filter('base64')($rootScope.file.content);
                if ($rootScope.currentSession === void 0) {
                  $rootScope.session.$add($rootScope.location).then(function(key) {
                    console.log(key.path.n[1]);
                    return $rootScope.currentSession = key.path.n[1];
                  });
                } else {
                  $rootScope.session[$rootScope.currentSession] = $rootScope.location;
                  $rootScope.session.$save($rootScope.currentSession);
                }
                child = conn.$child("/" + $scope.repo + "/" + $scope.file.path.replace(".", "-"));
                child.$set($rootScope.aceModel);
              });
            } else {
              params = {
                owner: $rootScope.loginObj.user.username,
                repo: $scope.repo,
                path: $scope.file.path,
                access_token: $rootScope.loginObj.user.accessToken
              };
              return $scope.contents = GetContents.get(params);
            }
          };
        },
        link: function($scope, $element, attrs) {
          if ($scope.file.type === 'dir') {
            $element.append('<ul folder="file.path" repo="repo" contents="contents"></ul>');
            return $compile($element.contents())($scope);
          }
        }
      };
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

  App.factory("UpdateFile", function($resource) {
    return $resource("https://api.github.com/repos/:owner/:repo/contents/:path");
  });

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

}).call(this);
