module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          hostname: '127.0.0.1',
          port: 9001,
          base: '.',
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
              if(req.method === 'POST') {

                if(req.url === '/data/post_test') {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(grunt.file.read('data/test.json'));
                } else {
                  return next();
                }

              } else if(req.url === '/data/error_test') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end();
              } else {
                return next();
              }
            });

            return middlewares;
          }
        }
      }
    },

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

    jasmine: {
      unit: {
        src: 'dist/xhr-listener.js',
        options: {
          specs: 'test/spec/*.js',
          host: 'http://127.0.0.1:9001'
        }
      },

      continuous: {
        src: 'dist/xhr-listener.js',
        options: {
          specs: 'test/spec/*.js',
          host: 'http://127.0.0.1:9001'
        }
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
          'src/polyfills.js': ['src/main.js']
        }
      }
    },

    jsdoc : {
        dist : {
            src: ['src/main.js', 'test/*.js'],
            options: {
                destination: 'docs'
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
      tasks: ['concat', 'jshint', 'jasmine']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autopolyfiller');
  grunt.loadNpmTasks('grunt-jsdoc');

  //Generate doc
  grunt.registerTask('docs', ['jsdoc']);

  //Compile
  grunt.registerTask('compile', ['autopolyfiller', 'concat', 'jshint']);

  //Tests tasks
  grunt.registerTask('test', ['compile', 'connect', 'jasmine:unit']);
  grunt.registerTask('test-ci', ['compile', 'connect', 'jasmine:continuous']);

  //Build tasks
  grunt.registerTask('build-dev', ['test', 'uglify', 'docs']);
  grunt.registerTask('build-prod', ['test-ci', 'uglify']);

  //Default
  grunt.registerTask('default', ['build-dev']);

};
