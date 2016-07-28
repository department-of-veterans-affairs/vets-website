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
              'public/js/jquery-1.11.0.min.js', // Load JQuery
              'public/js/foundation.min.js', // Load Foundation
              'public/js/**/*.js'  // Load all other files
          ],
          dest: 'generated/js/main.js',    // TODO(crew): Decide on naming convention for this file later.
        }
      },
      imagemin: {
          dynamic: {
              files: [{
                  expand: true,
                  cwd: 'public/img/',
                  src: ['**/*.{png,jpg,gif}'],
                  dest: 'public/img/'
              }]
          }
      },
      sass: {
          dist: {
              options: {
                  style: 'compressed'
              },
              files: {
                  'generated/css/style.css': 'sass/style.scss',  // This is the VA common style
                  'generated/css/hca.css': 'sass/hca.scss'

              }
          } 
      },
      watch: {
        options: {
          livereload: true,
        },
        scripts: {
            files: ['src/**/*.jsx'],
            tasks: ['webpack'],
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
        },
        html: {
            files: ['content/**/*.md'],
            tasks: [ /* Jekyll-ish build task here */ ],
            options: {
                spawn: false,
            }
        } 
      },
      sasslint: {
          options: {
              configFile: 'config/.sass-lint.yml',
          },
          target: ['sass/**/\*.scss', '!sass/lib/**/\*.scss']
      },
      webpack: {
        rx: {
          // webpack options
          entry: './src/rx/client.js',
          output: {
              path: './generated',
              filename: 'js/bundle-rx.js'
          },
          module: {
            loaders: [
              {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                  presets: ['es2015'],
                  cacheDirectory: true  // Speed up compilation.
                }
              },
              {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                  presets: ['react', 'es2015'],
                  cacheDirectory: true  // Speed up compilation.
                }
              }
            ]
          },
          resolve: {
            extensions: ['', '.js', '.jsx']
          },
        },
      }
  });

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-sass-lint');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-webpack');

grunt.registerTask('dev', ['sass' ,'concat', 'uglify', 'connect', 'watch']);
grunt.registerTask('build', ['sass' ,'concat', 'uglify', 'imagemin']);
grunt.registerTask('default', ['dev']);


};