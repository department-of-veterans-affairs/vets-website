const commandLineArgs = require('command-line-args');
const Auth = require('../e2e-puppeteer/auth');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const Timeouts = require('../e2e/timeouts');
const {
  sitemapURLs,
} = require('../../site-wide/tests/sitemap/sitemap-helpers');
const createBaselineImage = require('./util/create-baseline-image');
const calculateDiff = require('./util/calculate-diff');
const chalk = require('chalk');
const Table = require('cli-table');
const url = require('url');
const path = require('path');

const iPhone = devices['iPhone 6'];
const BASE_DIR = path.resolve(__dirname, '../../../../');

const commands = {
  CREATE_BASELINE_IMAGES: 'baseline',
  CALCULATE_DIFFS: 'diff',
  MOBILE: true,
};

const { command, mobile } = commandLineArgs([
  { name: 'command', type: String },
  { name: 'config', type: String, alias: 'c' },
  { name: 'mobile', type: Boolean },
]);
// parse the response from the testing function into something that cli-tables can print
function tableFormatter(outputObj) {
  return [
    url.parse(outputObj.route).pathname,
    `${outputObj.misMatchPercentage}%`,
    outputObj.diffFileName.replace(BASE_DIR, ''),
  ];
}

// Converts the array of routes/URL's and returns a super-long promise chain.
async function createRouteHandlerChain(page, routes, routeHandler) {
  const table = new Table({
    head: ['Route', '%Miss', 'Diff Location'],
    colWidths: [50, 8, 100],
  });
  const results = [];
  for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    /* eslint-disable no-await-in-loop, no-console */
    try {
      await page.goto(route, {
        timeout: 0,
      });
      await page.waitFor('body');
      const output = await routeHandler(page, route);
      if (output) {
        results.push(output);
      }
    } catch (e) {
      console.error(e);
      console.log(chalk.red(`Couldn't screenshot ${route}`));
    }
    /* eslint-enable */
    // await page.goto('about:blank')
  }
  table.push(...results.map(tableFormatter));
  /* eslint-disable  no-console */
  console.log(table.toString());
  /* eslint-enable */
}

// A wrapper around the login helper to return a promise
async function login(page) {
  const token = Auth.getUserToken();
  await Auth.logIn(token, page, '/', 1);
  await page.waitForSelector('body', { timeout: Timeouts.normal });
}

// Checks command flags to determine the "routeHandler" function that will perform a task after the browser navigates to each route.
function getRouteHandler() {
  switch (command) {
    case commands.CREATE_BASELINE_IMAGES:
      return createBaselineImage;
    case commands.CALCULATE_DIFFS:
    default:
      return calculateDiff;
  }
}

// Returns a function that will be executed as a Nightwatch test case.
async function beginApplication(browser) {
  const routeHandler = getRouteHandler();
  // Before starting any routes, log the user in to prevent load errors.
  const page = await browser.newPage();
  if (mobile === commands.MOBILE) {
    page.emulate(iPhone);
  }
  await login(page);
  // Parse the sitemap XML file into an array of URL's
  const sitemap = await sitemapURLs();
  const routes = sitemap.urls;
  await createRouteHandlerChain(page, routes, routeHandler);
  await page.close();
}

// The entry point for everything.
async function setup() {
  // check if mobile test or not
  const browser = await puppeteer.launch({ headless: true });
  try {
    await beginApplication(browser);
  } catch (e) {
  /* eslint-disable */
    console.error(e, e.stack);
  /* eslint-enable */
  }
  await browser.close();
}

try {
  setup();
} catch (e) {
  /* eslint-disable */
  console.log(e);

}
