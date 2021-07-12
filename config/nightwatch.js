/* eslint-disable camelcase, strict */
'use strict';

const chromedriver = require('chromedriver');

require('@babel/register');
require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  src_folders: ['./src'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './src/platform/testing/e2e/nightwatch-commands',
  custom_assertions_path: './src/platform/testing/e2e/nightwatch-assertions',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',

  webdriver: {
    start_process: true,
    server_path: process.env.CHROMEDRIVER_FILEPATH || chromedriver.path,
    port: 9515,
  },

  // If set to true, runs the tests in parallel and determines the number of workers automatically.
  // If set to an object, can specify specify the number of workers as "auto" or a number.
  // Source: https://nightwatchjs.org/gettingstarted/configuration/#test-runner-settings
  test_workers: { enabled: true, workers: 4 },

  test_settings: {
    default: {
      launch_url: `localhost:${process.env.WEB_PORT || 3333}`,
      filter: '**/*.e2e.spec.js',
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'logs/screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        chromeOptions: {
          args: ['--window-size=1024,768'],
        },
      },
    },
    accessibility: {
      filter: './src/platform/site-wide/tests/sitemap/*.spec.js',
    },
    headless: {
      desiredCapabilities: {
        chromeOptions: {
          args: ['--headless', '--window-size=1024,768'],
        },
      },
    },
    bestpractice: {
      globals: {
        rules: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
      },
    },
  },
};
