module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    sass:
      dist:
        options:
          outputStyle: "compressed"
        files:
          "www-root/css/main.css": "sass/*.sass"
    # coffee:
    #   app: 
    #     src: ["coffee/*.coffee"]
    #     dest: "www-root/js"

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
      js:
        files: "www-root/app/**/*.js"
        tasks: ["concat"]
        options:
          livereload: true

    bowerInstall:
      taget:
        src:["www-root/index.html"]

    concat:
      build:
        src: "www-root/app/**/*.js"
        dest: "www-root/js/app.js"

  grunt.loadNpmTasks "grunt-sass"
  # grunt.loadNpmTasks "grunt-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-bower-install"
  grunt.registerTask "default", [
    "sass"
    "concat"
    "bowerInstall"
    "connect"
    "watch"
  ]
  return