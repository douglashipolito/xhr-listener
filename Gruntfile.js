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

      sl_windows_7_ie : { configFile : 'test/karma/saucelabs/windows.7.ie.js' },
      sl_windows_8_ie : { configFile : 'test/karma/saucelabs/windows.8.ie.js' },
      sl_firefox : { configFile : 'test/karma/saucelabs/firefox.js' },
      sl_safari : { configFile : 'test/karma/saucelabs/safari.js' },
      sl_ios : { configFile : 'test/karma/saucelabs/ios.js' },
      sl_android : { configFile : 'test/karma/saucelabs/android.js' },
      sl_chrome: { configFile : 'test/karma/saucelabs/chrome.js' },

      unit: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true
      },

      dev: {
        configFile: 'karma.conf.js',
        singleRun: false
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

  //Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-autopolyfiller');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');

  //Generate doc
  grunt.registerTask('docs', ['jsdoc']);

  //Compile
  grunt.registerTask('compile', ['autopolyfiller', 'concat', 'jshint']);

  grunt.registerTask('test-saucelabs', [
    'karma:sl_windows_7_ie',
    'karma:sl_windows_8_ie',
    'karma:sl_firefox',
    'karma:sl_safari',
    'karma:sl_chrome',
    'karma:sl_ios',
    'karma:sl_android'
  ]);

  //Tests tasks
  var testSubTasks = ['compile'];

  if(typeof process.env.SAUCE_USERNAME  !== 'undefined'
  && typeof process.env.SAUCE_ACCESS_KEY !== 'undefined') {
    testSubTasks.push('test-saucelabs');
  } else {
    testSubTasks.push('karma:unit');
  }

  grunt.registerTask('test', testSubTasks);
  grunt.registerTask('test-dev', ['compile', 'karma:dev']);
  grunt.registerTask('test-ci', ['compile', 'test-saucelabs']);

  //Build tasks
  grunt.registerTask('build-dev', ['test-dev', 'uglify', 'docs']);
  grunt.registerTask('build-prod', ['test-ci', 'uglify']);

  //Default
  grunt.registerTask('default', ['build-dev']);

};
