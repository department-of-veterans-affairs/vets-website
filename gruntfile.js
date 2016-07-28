module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      
      connect: {
        server: {
          options: {
            port: 9001,
            base: 'generated',
            livereload: true
          }
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
      metalsmith: {
        html: {
          options: {
            metadata: {
              title: 'Vets.gov',
              description: ''
            },
            plugins: {
              'metalsmith-markdown': {},
              'metalsmith-ignore': 'generated/css/*',
              'metalsmith-permalinks': {
                pattern: ':collection/:title'
              },
              'metalsmith-layouts': {
                engine: 'swig',
                directory: 'content/layouts'
              },
              'metalsmith-collections': {}
            }
          },
          src: './content/pages',
          dest: './generated'
        },
        sass: {
          options: {
            metadata: {
              title: 'Vets.gov',
              description: ''
            },
            plugins: {
              'metalsmith-sass': {
                outputStyle: 'expanded'
              }
            }
        },
        src: './sass',
        dest: './generated/css'
        },
        js: {
          options: {
            metadata: {
              title: 'Vets.gov',
              description: ''
            },
            plugins: {
              'metalsmith-concat-convention': {
                'extname': '.concat'
              }
            }
        },
        src: './public/js',
        dest: './generated/js'
        },
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
      },
      watch: {
        options: {
          livereload: true,
        },
        react: {
            files: ['src/**/*.jsx'],
            tasks: ['webpack'],
            options: {
                spawn: false,
            },
        },
        html: {
            files: ['content/**/*.md'],
            tasks: ['metalsmith'],
            options: {
                spawn: false,
            },
        },
        css: {
            files: ['sass/**/*.scss'],
            tasks: ['metalsmith:sass'],
            options: {
                spawn: false,
            }
        },
        js: {
            files: ['public/js/**/*.js'],
            tasks: ['metalsmith:js'],
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
      }
  });

grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-sass-lint');
grunt.loadNpmTasks('grunt-webpack');
grunt.loadNpmTasks('grunt-metalsmith');

grunt.registerTask('dev', ['metalsmith', 'webpack', 'connect', 'watch']);
grunt.registerTask('build', ['metalsmith', 'webpack', 'imagemin']);
grunt.registerTask('default', ['dev']);


};
