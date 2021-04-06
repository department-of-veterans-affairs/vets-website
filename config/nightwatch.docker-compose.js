/* eslint-disable camelcase, strict */
'use strict';

const fs = require('fs-extra');

require('@babel/register');

const selenium_logs = './logs/selenium';
const selenium_server_port = process.env.SELENIUM_PORT || 4444;

fs.ensureDirSync(selenium_logs);

module.exports = {
  src_folders: ['./src'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './src/platform/testing/e2e/nightwatch-commands',
  custom_assertions_path: './src/platform/testing/e2e/nightwatch-assertions',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',

  // TODO: Experiment with `test_workers: 4`
  // If set to true, runs the tests in parallel and determines the number of workers automatically.
  // If set to an object, can specify specify the number of workers as "auto" or a number.
  // Source: https://nightwatchjs.org/gettingstarted/configuration/#test-runner-settings
  test_workers: 'auto',

  test_settings: {
    default: {
      launch_url: `vets-website:${process.env.WEB_PORT || 3333}`,
      filter: '**/*.e2e.spec.js',
      selenium_host: 'selenium-chrome',
      selenium_port: selenium_server_port,
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
          args: [
            '--headless',
            '--no-sandbox',
            '--disable-gpu',
            '--window-size=1024,768',
          ],
        },
      },
      selenium: {
        start_process: false,
        log_path: selenium_logs,
        host: 'selenium-chrome',
        port: selenium_server_port,
      },
    },
    accessibility: {
      filter: './src/platform/site-wide/tests/sitemap/*.spec.js',
    },
    wcag2a: {
      globals: {
        rules: ['section508', 'wcag2a'],
      },
    },
  },
};
