module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'tiles/*.js', 'mockup/js/*.js', 'editor/js/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    mochaTest: {
      test: {
        src: ['tests/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>', '<%= mochaTest.files %>'],
      tasks: ['jshint', 'mochaTest']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);

};