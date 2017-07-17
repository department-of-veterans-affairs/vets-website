/* eslint-disable camelcase, strict */
'use strict';

require('babel-core/register');

module.exports = {
  src_folders: ['./test'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './test/util/nightwatch-commands',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',
  test_workers: false,
  globals_path: './config/nightwatch-globals-sauce.js',
  test_settings: {
    'default': {
      launch_url: 'http://ondemand.saucelabs.com:80',
      filter: './test/**/*.e2e.spec.js',
      selenium_host: 'ondemand.saucelabs.com',
      selenium_port: 80,
      username: 'vetsdotgov',
      access_key: process.env.SAUCE_ACCESS_KEY,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: false
      },
      desiredCapabilities: {
        recordVideo: true,
        recordScreenshots: true,
        recordLogs: true,
        captureHtml: true,
      },
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: '59.0'
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: '54.0'
      }
    },
    ie: {
      desiredCapabilities: {
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.103'
      }
    },
    edge: {
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: '15.15063'
      }
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        platform: 'macOS 10.12',
        version: '10.0'
      }
    },
    android: {
      desiredCapabilities: {
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait',
        browserName: 'Chrome',
        platformVersion: '6.0',
        platformName: 'Android',
      }
    },
    ios: {
      desiredCapabilities: {
        deviceName: 'iPhone Simulator',
        deviceOrientation: 'portrait',
        browserName: 'Safari',
        platformVersion: '10.3',
        platformName: 'iOS',
      }
    }
  }
};
