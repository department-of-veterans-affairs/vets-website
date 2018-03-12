/* eslint-disable */

var chalk = require('chalk')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var MemoryInputFileSystem = require('enhanced-resolve/lib/MemoryInputFileSystem')
var MemoryOutputFileSystem = require('webpack/lib/MemoryOutputFileSystem')
var tty = require('tty')
var path = require('path')
var webpack = require('webpack')

var defaults = {
  host: 'localhost',
  port: 8081
};

function webpackPlugin(config) {
  var compiler = webpack(config)
  var files = {}
  var fs = new MemoryInputFileSystem(files)
  compiler.outputFileSystem = new MemoryOutputFileSystem(files)
  return function (files, metalsmith, done) {
    compiler.run(function (err, stats) {
      if (err) {
        done(err)
        return
      }
      var info = stats.toString({ chunkModules: false, colors: useColors() })
      if (stats.hasErrors()) {
        done(info)
        return
      }
      console.log(info)
      fs.readdirSync(config.output.path).forEach(function (file) {
        var filePath = path.join(config.output.path, file)
        var key = getMetalsmithKey(files, filePath) || filePath
        files[key] = {
          contents: fs.readFileSync(filePath)
        }
      })
      return done()
    })
  }
}

function useColors() {
  return tty.isatty(1 /* stdout */)
}

function getMetalsmithKey(files, p) {
  p = normalizePath(p)
  for (var key in files) {
    if (normalizePath(key) === p) return key
  }
  return null
}

function normalizePath(p) {
  return p.split(path.sep).filter(function (p) {
    return typeof p === 'string' && p.length > 0
  }).join('/')
}

function webpackDevServerPlugin(config, opts) {
  var server
  var options = Object.assign(defaults, opts)
  var compiler = webpack(Object.assign({}, config))

  function process(files, metalsmith, done) {

    // Prevent from starting webpack dev server multiple times
    if (server) {
      done()
      return
    }

    server = new WebpackDevServer(compiler, options)

    server.listen(options.port || 8081, options.host, function() {
      console.log(
        chalk.blue('[metalsmith-webpack-dev-server]: ') +
        chalk.green("Running webpack dev server at http://" + options.host + ":" + options.port)
      )
      done()
    })
  }

  return process
}

module.exports = {
  webpackPlugin,
  webpackDevServerPlugin
};

