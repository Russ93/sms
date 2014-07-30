# global App
App = angular.module('connecting_point', ['ngRoute','firebase','ngResource', 'ui.ace'])
# App = angular.module('connecting_point', ['ngRoute','firebase','ngResource', 'angularTreeview'])
URL = "https://vivid-fire-5420.firebaseio.com"
# conn = $firebase(new Firebase(URL))

App.config [
	"$routeProvider"
	($routeProvider) ->
		$routeProvider.when("/",
			templateUrl: "views/landing.html"
			controller: "LandCtrl"
		).when "/user",
			templateUrl: "views/user.html"
			controller: "UserCtrl"
]


App.factory "AngularGit", ($resource) ->
	$resource "https://api.github.com/repos/angular/angular.js/:category/:sha"

App.factory "GetRepos", ($resource) ->
	$resource "https://api.github.com/users/:username/repos",null, {'get': {method: 'get', isArray: true }}

App.factory "GetCommits", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/commits",null, {'get': {method: 'get', isArray: true }}

App.factory "GitTrees", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/git/trees/:sha?recursive=1"

App.factory "GetContents", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path",null, {'get': {method: 'get', isArray: true }}

App.factory "GetFile", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path"

App.factory "UpdateFile", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path"


App.run [
	"$firebaseSimpleLogin"
	"$rootScope"
	"$location"
	"GetRepos"
	($firebaseSimpleLogin, $rootScope, $location, GetRepos) ->
		$rootScope.close = ->
			$rootScope.modal = false
		URL = "https://vivid-fire-5420.firebaseio.com"
		conn = new Firebase(URL)
		$rootScope.loginObj = $firebaseSimpleLogin conn

		$rootScope.$on "$firebaseSimpleLogin:logout", (e) ->
			# $rootScope.loginObj = null
			console.log "logout"
			$location.path '/'
			return
]


App.filter "toArray", ->
	"use strict"
	(obj) ->
		return obj  unless obj instanceof Object
		Object.keys obj .filter((key) ->
			key  if key.charAt 0 isnt "$"
		).map (key) ->
			Object.defineProperty obj[key], "$key",
				__proto__: null
				value: key

App.filter "base64", ->
	(string) ->
		Base64 =
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
			encode: (e) ->
				t = ""
				n = undefined
				r = undefined
				i = undefined
				s = undefined
				o = undefined
				u = undefined
				a = undefined
				f = 0
				e = Base64._utf8_encode(e)
				while f < e.length
					n = e.charCodeAt(f++)
					r = e.charCodeAt(f++)
					i = e.charCodeAt(f++)
					s = n >> 2
					o = (n & 3) << 4 | r >> 4
					u = (r & 15) << 2 | i >> 6
					a = i & 63
					if isNaN(r)
						u = a = 64
					else a = 64  if isNaN(i)
					t = t + @_keyStr.charAt(s) + @_keyStr.charAt(o) + @_keyStr.charAt(u) + @_keyStr.charAt(a)
				t

			decode: (e) ->
				t = ""
				n = undefined
				r = undefined
				i = undefined
				s = undefined
				o = undefined
				u = undefined
				a = undefined
				f = 0
				e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")
				while f < e.length
					s = @_keyStr.indexOf(e.charAt(f++))
					o = @_keyStr.indexOf(e.charAt(f++))
					u = @_keyStr.indexOf(e.charAt(f++))
					a = @_keyStr.indexOf(e.charAt(f++))
					n = s << 2 | o >> 4
					r = (o & 15) << 4 | u >> 2
					i = (u & 3) << 6 | a
					t = t + String.fromCharCode(n)
					t = t + String.fromCharCode(r)  unless u is 64
					t = t + String.fromCharCode(i)  unless a is 64
				t = Base64._utf8_decode(t)
				t

			_utf8_encode: (e) ->
				e = e.replace(/\r\n/g, "\n")
				t = ""
				n = 0

				while n < e.length
					r = e.charCodeAt(n)
					if r < 128
						t += String.fromCharCode(r)
					else if r > 127 and r < 2048
						t += String.fromCharCode(r >> 6 | 192)
						t += String.fromCharCode(r & 63 | 128)
					else
						t += String.fromCharCode(r >> 12 | 224)
						t += String.fromCharCode(r >> 6 & 63 | 128)
						t += String.fromCharCode(r & 63 | 128)
					n++
				t

			_utf8_decode: (e) ->
				t = ""
				n = 0
				r = c1 = c2 = 0
				while n < e.length
					r = e.charCodeAt(n)
					if r < 128
						t += String.fromCharCode(r)
						n++
					else if r > 191 and r < 224
						c2 = e.charCodeAt(n + 1)
						t += String.fromCharCode((r & 31) << 6 | c2 & 63)
						n += 2
					else
						c2 = e.charCodeAt(n + 1)
						c3 = e.charCodeAt(n + 2)
						t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
						n += 3
				t
		if string?
			return Base64.decode string
		else
			return string

App.controller "LandCtrl", [
	"$scope"
	"$rootScope"
	"$firebase"
	"$location"
	($scope, $rootScope, $firebase, $location) ->
		# if $rootScope.loginObj.username isnt null
		# 	$location.path('/user')
		$scope.title = "Home"
		# $scope.savePost = ->
		#   $scope.items.$add($scope.newPost)
		#   $scope.newPost = {}
]
App.controller "UserCtrl", [
	"$scope"
	"$rootScope"
	"$firebase"
	"GetRepos"
	"GetCommits"
	"GetContents"
	"GetFile"
	($scope, $rootScope, $firebase, GetRepos, GetCommits, GetContents, GetFile) ->
		# $filter('base64')($rootScope.file.content)
		
		$scope.modes = ['Scheme', 'XML', 'Javascript']
		$scope.mode = $scope.modes[0]
			
		$rootScope.$on "$firebaseSimpleLogin:login", (e, user) ->
			console.log user
			params =
				username: user.username
				access_token: user.accessToken
			$scope.repos = GetRepos.get params
			console.log $scope.repos

		$scope.aceOption =
			mode: $scope.mode.toLowerCase()
			theme: 'monokai'
			onLoad: (_ace) ->

				# HACK to have the ace instance in the scope...
				$scope.modeChanged = ->
					_ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase())
		# $base64.decode 'YSBzdHJpbmc='

		$rootScope.aceModel = "hello"

		$scope.title = "User - loginObj.user"
		$scope.conn = $firebase new Firebase URL+"/name"

		secret = "c2e8b102ca576e0060f6dc493956288170d6eaaa"
		# /:owner/:repo/:sha
		

		trim = (x) ->
			return x.replace(/^\s+|\s+$/gm,'')

		$scope.new = ->
			$rootScope.modal = true
		$scope.create = ->
			$rootScope.modal = false
			$scope.conn.$child "files" .$add name: $scope.newFile 
			console.log file: $scope.newFile
		$scope.$watch 'sha', (newValue, oldValue) ->
			if $rootScope.loginObj.user isnt null
				params = 
					owner: $rootScope.loginObj.user.username
					repo: $scope.repos[$scope.repo].name
					access_token: $rootScope.loginObj.user.accessToken
					# path: $scope.sha
				$scope.repoContents = GetContents.get params
				console.log $scope.repoContents

		$scope.$watch 'repo', (newValue, oldValue) ->
			if $rootScope.loginObj.user isnt null
				params =
					owner: $rootScope.loginObj.user.username
					repo: $scope.repos[$scope.repo].name
					access_token: $rootScope.loginObj.user.accessToken
				GetCommits.get params, (data) ->
					$scope.sha = data[data.length-1].sha
		return

]
