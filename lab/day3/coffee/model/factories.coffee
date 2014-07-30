App.factory "AngularGit", ($resource) ->
	$resource "https://api.github.com/repos/angular/angular.js/:category/:sha"

App.factory "GetRepos", ($resource) ->
	$resource "https://api.github.com/users/:username/repos",null, {'get': {method: 'get', isArray: true }}

# App.factory "GetCommits", ($resource) ->
# 	$resource "https://api.github.com/repos/:owner/:repo/commits",null, {'get': {method: 'get', isArray: true }}

App.factory "GitTrees", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/git/trees/:sha?recursive=1"

App.factory "GetContents", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path",null, {'get': {method: 'get', isArray: true }}

App.factory "GetFile", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path"

App.factory "UpdateFile", ($resource) ->
	$resource "https://api.github.com/repos/:owner/:repo/contents/:path"
	