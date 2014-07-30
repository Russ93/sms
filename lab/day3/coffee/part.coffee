App.directive "folder", [->
	restrict: "AE"
	template: '<li ng-repeat="cont in contents" file="cont" repo="repo" ng-class="{ folder: cont.type == \'dir\' }"></li>'
	scope:
		folder: "="
		repo: '='
		contents: '='
	controller: ($rootScope, $scope, GetContents) ->
		
]

App.directive "file", ['$compile',($compile) ->
	restrict: "AE"
	template: '<span ng-click="openItem()">{{file.name}}</span>'
	scope:
		file: "="
		repo: "="
	controller: ($scope, $rootScope, $firebase, GetFile, GetContents, $filter) ->
		$scope.openItem = () ->
			params =
				owner: $rootScope.loginObj.user.username
				repo: $scope.repo
				path: $scope.file.path
				access_token: $rootScope.loginObj.user.accessToken

			if $scope.file.type isnt 'dir'
				$rootScope.file = GetFile.get params
				$rootScope.file.$promise.then ->
					$rootScope.aceModel = $filter('base64')($rootScope.file.content)
				# $rootScope.file = $filter('base64')($rootScope.file.content)

			else
				params =
					owner: $rootScope.loginObj.user.username
					repo: $scope.repo
					path: $scope.file.path
					access_token: $rootScope.loginObj.user.accessToken
				$scope.contents = GetContents.get params
	link: ($scope,$element, attrs) ->
	
		if $scope.file.type is 'dir'
			$element.append '<ul folder="file.path" repo="repo" contents="contents"></ul>'
			$compile($element.contents())($scope)
]