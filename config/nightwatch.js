"use strict";

require('babel-core/register');

const glob = require("glob");

/* eslint-disable */
module.exports = {
  "src_folders" : [ "./test" ],
  "output_folder" : "./logs/nigthwatch",
  "live_output" : true,
  "parallel_process_delay" : 10,
  "disable_colors": false,
  "test_workers" : false,

  "test_settings" : {
    "default" : {
      "launch_url": "localhost:8080",
      "filter" : "./test/**/*.e2e.spec.js",
      "selenium_host" : "localhost",
      "selenium_port" : 4444,
      "use_ssl" : false,
      "silent" : true,
      "output" : true,
      "screenshots" : {
        "enabled" : false,
        "on_failure" : true,
        "path" : ""
      },
      "desiredCapabilities" : {
        "browserName" : "phantomjs",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "phantomjs.binary.path" : "./node_modules/.bin/phantomjs"
      },
      "globals" : {
      },
      "selenium" : {
        "start_process" : true,
        "server_path" :
            glob.sync("./node_modules/selenium-standalone/.selenium/selenium-server/*.jar")[0],
        "log_path" : "./logs/selenium",
        "host" : "127.0.0.1",
        "port" : 4444,
      }
    }
  }
}
