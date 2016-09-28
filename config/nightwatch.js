/* eslint-disable camelcase, strict */
'use strict';

require('babel-core/register');

const glob = require('glob');

module.exports = {
  src_folders: ['./test'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './test/util/nightwatch-commands',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: false,
  test_workers: false,
  test_settings: {
    'default': {
      launch_url: 'localhost:3001',
      filter: './test/**/*.e2e.spec.js',
      selenium_host: 'localhost',
      selenium_port: 4444,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'logs/screenshots'
      },
      desiredCapabilities: {
        // browserName: 'firefox',
        browserName: 'phantomjs',
        javascriptEnabled: true,
        acceptSslCerts: true,
        'phantomjs.binary.path': require('phantomjs-prebuilt').path
        // 'phantomjs.cli.args' : ['--remote-debugger-port=9001', '--remote-debugger-autorun=yes']
      },
      globals: {
      },
      selenium: {
        start_process: true,
        server_path:
            glob.sync('./node_modules/selenium-standalone/.selenium/selenium-server/*.jar')[0],
        log_path: './logs/selenium',
        host: '127.0.0.1',
        port: 4444,
      }
    },

    accessibility: {
      filter: './test/accessibility/*.spec.js',
      globals: {
        asyncHookTimeout: 20000,
      },
      desiredCapabilities: {
        browserName: 'phantomjs',
        javascriptEnabled: true,
        acceptSslCerts: true,
        'phantomjs.binary.path': require('phantomjs-prebuilt').path
      }
    }
  }
};
