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