module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/polyfills.js',
          'src/intro.js',
          'src/main.js',
          'src/outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
        runnerPort: 9876,
        browsers: ['PhantomJS'],
        reporters: ['mocha']
      },

      continuous: {
        singleRun: true
      },

      unit: {
        browsers: ['PhantomJS', 'Chrome']
      }
    },

    jshint: {
      files: ['dist/xhr-listener.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['Gruntfile.js', '<%= concat.dist.src %>', 'test/**/*.js'],
      tasks: ['concat', 'jshint', 'karma:unit']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['jshint', 'karma:unit']);
  grunt.registerTask('default', ['concat', 'jshint', 'karma:continuous', 'uglify']);

};
