# global App
App = angular.module('connecting_point', ['ngRoute','firebase','ngResource', 'ui.ace'])
# App = angular.module('connecting_point', ['ngRoute','firebase','ngResource', 'angularTreeview'])
URL = "https://vivid-fire-5420.firebaseio.com"
# conn = $firebase(new Firebase(URL))

App.config [
	"$routeProvider"
	($routeProvider) ->
		$routeProvider.when "/",
			templateUrl: "views/landing.html"
			controller: "LandCtrl"
		.when "/user",
			templateUrl: "views/user.html"
			controller: "UserCtrl"
		.when "/user/:session",
			templateUrl: "views/user.html"
			controller: "UserCtrl"
]


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

		$rootScope.$on "$firebaseSimpleLogin:login", (e, user) ->
			if $location.$$path is "/"
				$location.path '/user'

		$rootScope.$on "$firebaseSimpleLogin:logout", (e) ->
			# $rootScope.loginObj = null
			console.log "logout"
			$location.path '/'
			return
]

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
	"$routeParams"
	"$firebase"
	"GetRepos"
	"GetContents"
	"GetFile"
	($scope, $rootScope, $routeParams, $firebase, GetRepos, GetContents, GetFile) ->
		$rootScope.session = $firebase new Firebase URL+"/sessions"

		if $routeParams.session?
			$rootScope.currentSession = $routeParams.session
			$rootScope.location = $firebase(new Firebase(URL+"/sessions/"+$routeParams.session))
			$rootScope.location.$on 'loaded', (value) ->
				console.log "URL", URL+value
				$rootScope.location = URL+value
				$rootScope.currentFile = $rootScope.location.replace("https://vivid-fire-5420.firebaseio.com","")
				$rootScope.code = $firebase(new Firebase(URL+value))
				$rootScope.code.$on 'change', (value) ->
					console.log $rootScope.code
					$rootScope.aceModel = $rootScope.code.$value
			# $firebase new Firbase URL+"/"+$scope.session

		$scope.modes = ['Scheme', 'XML', 'Javascript']
		$scope.mode = $scope.modes[0]
			
		$rootScope.$on "$firebaseSimpleLogin:login", (e, user) ->
			console.log user
			params =
				username: user.username
				access_token: user.accessToken
			$scope.repos = GetRepos.get params

			console.log "repos", $scope.repos
			console.log "params", params

		editor = null
		$scope.aceOption =
			mode: $scope.mode.toLowerCase()
			theme: 'Chrome'
			onChange: (something) ->
				$rootScope.code.$set editor.getSession().getValue()
				# console.log $rootScope.aceModel
				# console.log editor.getSession().getValue()
				return
			onLoad: (_ace) ->
				editor = _ace
				# HACK to have the ace instance in the scope...
				$scope.modeChanged = ->
					_ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase())
		# $base64.decode 'YSBzdHJpbmc='

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

		$scope.$watch 'repo', (newValue, oldValue) ->
			if $rootScope.loginObj.user?
				params = 
					owner: $rootScope.loginObj.user.username
					repo: $scope.repos[$scope.repo].name
					access_token: $rootScope.loginObj.user.accessToken
					# path: $scope.sha
				$scope.repoContents = GetContents.get params
				console.log $scope.repoContents
		return

]
