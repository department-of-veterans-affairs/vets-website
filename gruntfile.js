module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      
      connect: {
        server: {
          options: {
            port: 9001,
            base: 'public',
            livereload: true
          }
        }
      },
      concat: {   
        js: {
          src: [
              'js/jquery-1.11.0.min.js', // Load JQuery
              'js/foundation.min.js', // Load JQuery
              'js/*.js'  // This specific file
          ],
          dest: 'public/js/production.js',
        },
        css: {
          src: [
              'styles/css/vendor/*.css', // All JS in the libs folder
              'styles/css/style.css'  // This specific file
          ],
          dest: 'public/css/production.css',
        }
      },
      uglify: {
        build: {
          src: 'public/js/production.js',
          dest: 'public/js/production.min.js'
        }
      },
      imagemin: {
          dynamic: {
              files: [{
                  expand: true,
                  cwd: 'images/',
                  src: ['**/*.{png,jpg,gif}'],
                  dest: 'public/images/'
              }]
          }
      },
      sass: {
          dist: {
              options: {
                  style: 'compressed'
              },
              files: {
                  'styles/css/style.css': 'styles/sass/style.scss'
              }
          } 
      },
      watch: {
        options: {
          livereload: true,
        },
        scripts: {
            files: ['js/*.js'],
            tasks: ['concat:js', 'uglify'],
            options: {
                spawn: false,
            },
        },
        css: {
            files: ['styles/sass/**/*.scss'],
            tasks: ['sass', 'concat:css'],
            options: {
                spawn: false,
            }
        } 
      }

  });

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-sass');

grunt.registerTask('dev', ['sass' ,'concat', 'uglify', 'connect', 'watch']);
grunt.registerTask('build', ['sass' ,'concat', 'uglify', 'imagemin']);
grunt.registerTask('default', ['dev']);


};