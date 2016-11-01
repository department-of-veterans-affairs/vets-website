/* eslint-disable */
module.exports = {
  "src_folders" : ["./test/e2e/tests"],
  "output_folder" : "./reports",
  "live_output" : true,
  "parallel_process_delay" : 10,
  "disable_colors": false,
  "test_workers" : false,

  "test_settings" : {
    "default" : {
      "launch_url": "localhost:3001",
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
      "desiredCapabilities": {
        "name" : "test-example",
        "browserName": "firefox"
      },
      "globals" : {
        "myGlobal" : "some_sauce_global"
      },
      "selenium" : {
        "start_process" : false
      }
    },
    "travis" : {
      "launch_url": "https://ondemand.saucelabs.com",
      "selenium_host" : "ondemand.saucelabs.com",
      "selenium_port" : 443,
      "username" : process.env.SAUCE_USERNAME,
      "access_key" : process.env.SAUCE_ACCESS_KEY, 
      "use_ssl" : true,
      "silent" : true,
      "output" : true,
      "screenshots" : {
        "enabled" : false,
        "on_failure" : true,
        "path" : ""
      },
      "globals": {
        "waitForConditionTimeout": 10000
      },
      "desiredCapabilities": {
        "name" : "test-example",
        "browserName": "firefox",
        "build": `build-${process.env.TRAVIS_JOB_NUMBER}`,
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
      },
      "selenium" : {
        "start_process" : false
      }
    }
  }
}
