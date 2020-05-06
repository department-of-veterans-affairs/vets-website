const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const ErrorMockData = require('../mockdata/error-response.json');
const Mock = require('platform/testing/e2e/mock-helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

function runRatedDisabilitiesTest(browser) {
  // Because error states for total rating and list are separate but contain identical classes,
  // a list of elements needs to be collected and their values checked individually.
  // Though the value checks are nested, they are still evaluated and pass correctly.
  browser.elements(
    'css selector',
    'h2.vads-u-margin-y--0.vads-u-font-size--lg',
    result => {
      browser.assert.equal(result.value.length, 2);
      const totalRatingErrorHeader = result.value[0];
      const listErrorHeader = result.value[1];
      browser.elementIdText(totalRatingErrorHeader.ELEMENT, el => {
        browser
          .expect(el.value)
          .to.equal(
            'We don’t have a combined disability rating on file for you',
          );
      });
      browser.elementIdText(listErrorHeader.ELEMENT, el => {
        browser
          .expect(el.value)
          .to.equal('We don’t have rated disabilities on file for you');
      });
    },
  );
  browser.assert.visible('.usa-alert-text');
  browser.elements('css selector', 'div.usa-alert-text > p', result => {
    browser.assert.equal(result.value.length, 2);
    const totalRatingErrorMessage = result.value[0];
    const listErrorMessage = result.value[1];
    browser.elementIdText(totalRatingErrorMessage.ELEMENT, el => {
      browser
        .expect(el.value)
        .to.contain('We can’t find a combined disability rating for you.');
    });
    browser.elementIdText(listErrorMessage.ELEMENT, el => {
      browser
        .expect(el.value)
        .to.contain('We can’t find any rated disabilities for you.');
    });
  });
}

function generateErrorData(token) {
  const routes = [];
  ErrorMockData.forEach(error => {
    routes.push(Mock(token, error));
  });
  return routes;
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();
    Promise.all(generateErrorData(token)).then(() => {
      Auth.logIn(
        token,
        browser,
        '/disability/view-disability-rating/rating',
        3,
      ).waitForElementVisible(
        'h2.vads-u-margin-y--0.vads-u-font-size--lg',
        Timeouts.verySlow,
      );
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
