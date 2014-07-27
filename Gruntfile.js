module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/intro.js',
          'src/polyfills.js',
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
      continuous: {
        configFile: 'karma.config-ci.js',
        singleRun: true
      },

      unit: {
        configFile: 'karma.conf.js',
      }
    },

    autopolyfiller: {
      custom_browsers: {
        options: {
          browsers: [
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9'
          ]
        },

        files: {
            'src/polyfills.js': [
            'src/main.js'
          ]
        }
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
  grunt.loadNpmTasks('grunt-autopolyfiller');

  //Tests tasks
  grunt.registerTask('test', ['jshint', 'karma:unit']);
  grunt.registerTask('test-ci', ['jshint', 'karma:continuous']);

  //Build tasks
  grunt.registerTask('compile', ['autopolyfiller', 'concat', 'jshint']);
  grunt.registerTask('build-dev', ['compile', 'test', 'uglify']);
  grunt.registerTask('build-prod', ['compile', 'test-ci', 'uglify']);

  //Default
  grunt.registerTask('default', ['build-dev']);

};
