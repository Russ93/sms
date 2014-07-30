module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")

		sass:
			dist:
				options:
					outputStyle: "compressed"
				files:
					"www-root/css/main.css": "sass/*.sass"
		coffee:
			compile:
				options:
					join: true
				files:
					"www-root/js/app.js" : ['coffee/app.coffee', 'coffee/{,*/}*.coffee']

		connect:
			server:
				options:
					port: 9001
					base: "www-root"

		watch:
			css:
				files: "sass/*.sass"
				tasks: ["sass"]
				options:
					livereload: true
			coffee:
				files: "coffee/{,*/}*.coffee"
				tasks: ["coffee"]
				options:
					livereload: true

		bowerInstall:
			taget:
				src:["www-root/index.html"]

	grunt.loadNpmTasks "grunt-sass"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-concat"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-bower-install"
	grunt.registerTask "default", [
		"sass"
		"coffee"
		"bowerInstall"
		"connect"
		"watch"
	]
	return