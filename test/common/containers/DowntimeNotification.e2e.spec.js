const moment = require('moment');
const createMockEndpoint = require('../../e2e/mock-helpers');
const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts');
const FacilityHelpers = require('../../e2e/facility-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

const beforeNow = moment().subtract(1, 'minute').toISOString();
const withinHour = moment().add(1, 'hour').subtract(1, 'minute').toISOString();
const endTime = moment().add(6, 'hour').toISOString();

const selectors = {
  app: '.facility-locator',
  downtimeNotification: '#downtime-notification',
  statusDown: '[data-status="down"]',
  statusDownApproachingModal: '[data-status="downtimeApproaching"] #downtime-approaching-modal',
  statusDownApproachingAlertBanner: '[data-status="downtimeApproaching"] .usa-alert'
};

function mock(data) {
  return createMockEndpoint(null, { path: '/v0/maintenance_windows', verb: 'get', value: { data }  });
}

function mockNoDowntime() {
  return mock([]);
}

function mockDowntimeApproaching() {
  return mock([{
    id: '139',
    type: 'maintenance_windows',
    attributes: {
      externalService: 'arcgis',
      description: 'My description',
      startTime: withinHour,
      endTime
    }
  }]);
}

function mockDowntime() {
  return mock([{
    id: '139',
    type: 'maintenance_windows',
    attributes: {
      externalService: 'arcgis',
      description: 'My description',
      startTime: beforeNow,
      endTime
    }
  }]);
}

function refresh(browser) {
  return () => {
    return new Promise(resolve => browser.refresh().waitForElementVisible('body', Timeouts.normal, resolve));
  };
}

function runTests(browser, callbacks) {
  return mockNoDowntime()
    .then(refresh(browser))
    .then(callbacks.ok)
    .then(mockDowntimeApproaching)
    .then(refresh(browser))
    .then(callbacks.downtimeApproaching)
    .then(mockDowntime)
    .then(refresh(browser))
    .then(callbacks.down);
}

function testUnauthorized(browser) {
  return {
    ok() {
      return new Promise(resolve => browser.waitForElementVisible(selectors.app, Timeouts.slow, resolve));
    },
    downtimeApproaching() {
      return new Promise(resolve => browser.waitForElementVisible(selectors.statusDownApproachingAlertBanner, Timeouts.slow, resolve));
    },
    down() {
      return new Promise(resolve => browser.waitForElementVisible(selectors.statusDown, Timeouts.slow, resolve));
    }
  };
}

function testAuthorized(browser) {
  return {
    ok() {
      return new Promise(resolve => {
        const token = LoginHelpers.getUserToken();
        LoginHelpers.logIn(token, browser, '/facilities', 3).waitForElementVisible('body', Timeouts.slow).waitForElementVisible(selectors.app, Timeouts.slow, resolve);
      });
    },
    downtimeApproaching() {
      return new Promise(resolve => browser.waitForElementVisible(selectors.statusDownApproachingModal, Timeouts.slow, resolve));
    },
    down() {
      return new Promise(resolve => browser.waitForElementVisible(selectors.statusDown, Timeouts.slow, resolve));
    }
  };
}

function begin(browser) {
  browser.url(`${E2eHelpers.baseUrl}/facilities/`);
  E2eHelpers.overrideSmoothScrolling(browser);
  FacilityHelpers.initApplicationMock();

  browser.perform(done => {
    runTests(browser, testUnauthorized(browser))
      .then(() => runTests(browser, testAuthorized(browser)))
      .then(() => browser.closeWindow())
      .then(done, (err) => {
        browser.verify.ok(false, err);
        done();
      });
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
