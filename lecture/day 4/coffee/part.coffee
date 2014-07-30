App.directive "commentsSection", [->
  restrict: "AE"
  templateUrl: "views/comments.html",
  scope:
  	postId: '@commentSection'
  controller: ($scope, $firebase) ->
  	$scope.comments = $firebase(new Firebase(URL+$scope.postId+"/comments"))
  	console.log($scope.comments)
  	$scope.saveComment = ->
  		$scope.comments.$add($scope.newComment)
  		$scope.newComment = {}
  		return
  	return
]