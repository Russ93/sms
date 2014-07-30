App = angular.module("day4app", ['ngRoute', 'firebase'])
URL = "https://lecture.firebaseio.com/"
App.config [
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.when("/",
      templateUrl: "views/home.html"
      controller: "HomeCtrl"
    ).when "/detail/:id",
      templateUrl: "views/detail.html"
      controller: "DetailCtrl"

]

App.filter "toArray", ->
  "use strict"
  (obj) ->
    return obj  unless obj instanceof Object
    Object.keys(obj).filter((key) ->
      key  if key.charAt(0) isnt "$"
    ).map (key) ->
      Object.defineProperty obj[key], "$key",
        __proto__: null
        value: key

App.controller "HomeCtrl", [
  "$scope"
  "$rootScope"
  "$firebase"
  ($scope, $rootScope, $firebase) ->
    $scope.items = $firebase(new Firebase(URL))
    $scope.title = "Home"
    $scope.savePost = ->
      $scope.items.$add($scope.newPost)
      $scope.newPost = {}
]
App.controller "DetailCtrl", [
  "$scope"
  "$rootScope"
  "$routeParams"
  "$firebase"
  ($scope, $rootScope, $routeParams, $firebase) ->
    $scope.title = "Detail"
    $rootScope.pageTitle = "Detail Page"
    $scope.post = $firebase(new Firebase(URL+$routeParams.id))
]