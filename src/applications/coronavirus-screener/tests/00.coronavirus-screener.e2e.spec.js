import { normal, slow } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import { production } from '../manifest.json';

export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // answering question brings up next question
  client
    .pause(1000) // needed for click to work
    .click('div[id=question-isStaff] > button[value=no]')
    .waitForElementVisible('div[id=question-fever]', slow)
    .assert.visible('div[id=question-fever]')

    .pause(1000) // needed for click to work
    .click('div[id=question-fever] > button[value=no]')
    .waitForElementVisible('div[id=question-cough]', slow)
    .assert.visible('div[id=question-cough]')

    .pause(1000) // needed for click to work
    .click('div[id=question-cough] > button[value=no]')
    .waitForElementVisible('div[id=question-flu]', slow)
    .assert.visible('div[id=question-flu]')

    .pause(1000) // needed for click to work
    .click('div[id=question-flu] > button[value=no]')
    .waitForElementVisible('div[id=question-congestion]', slow)
    .assert.visible('div[id=question-congestion]');

  client.end();
});

// module.exports['@disabled'] = !production || __BUILDTYPE__ !== 'production';
