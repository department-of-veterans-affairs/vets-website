/* eslint-disable camelcase, strict */
'use strict';

require('babel-core/register');

const selenium_server_port = process.env.SELENIUM_PORT || 4444;

module.exports = {
  src_folders: ['./test'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './test/util/nightwatch-commands',
  custom_assertions_path: './test/util/nightwatch-assertions',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',
  test_workers: false,
  test_settings: {
    'default': {
      launch_url: `vets-website:${process.env.WEB_PORT || 3333}`,
      filter: './test/**/*.e2e.spec.js',
      selenium_host: 'selenium-hub',
      selenium_port: selenium_server_port,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'logs/screenshots'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        chromeOptions: {
          args: ['--window-size=1024,768']
        }
      },
      selenium: {
        start_process: false,
        log_path: './logs/selenium',
        host: 'selenium-hub',
        port: selenium_server_port,
      },
      test_workers: {
        enabled: false,
        workers: parseInt(process.env.CONCURRENCY || 1, 10)
      },
    },
    accessibility: {
      filter: './test/accessibility/*.spec.js'
    },
    wcag2a: {
      globals: {
        rules: ['section508', 'wcag2a']
      }
    }
  }
};
