module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    sass:
      dist:
        options:
          outputStyle: "compressed"

        files:
          "www-root/css/main.css": "main.sass"

    connect:
      server:
        options:
          port: 8000
          base: "www-root"

    watch:
      css:
        files: "**/*.sass"
        tasks: ["sass"]
        options:
          livereload: true

  grunt.loadNpmTasks "grunt-sass"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.registerTask "default", [
    "sass"
    "connect"
    "watch"
  ]
  return