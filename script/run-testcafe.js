"use strict"; // eslint-disable-line

const createTestCafe = require('testcafe');

const testServer = require('../src/platform/testing/e2e/test-server');
const ENVIRONMENTS = require('../src/site/constants/environments');

/* eslint-disable no-console */

(async () => {
  let server;
  let testcafe;

  try {
    server = testServer(ENVIRONMENTS.VAGOVPROD, 'localhost', 3001);
    testcafe = await createTestCafe();
    const runner = testcafe.createRunner();

    const failedCount = await runner
      .src(['src/**/*.testcafe.spec.js'])
      .browsers(['chrome'])
      .run();

    console.log(`Tests failed: ${failedCount}`);
  } catch (e) {
    console.log(`Error caught: ${e}`);
  } finally {
    if (server) server.close();
    if (testcafe) testcafe.close();
  }
})();

/* eslint-enable no-console */
