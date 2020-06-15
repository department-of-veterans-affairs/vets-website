import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';

export default createE2eTest(client => {
  // handle example custom URL
  client
    .url(`${baseUrl}/covid19screen/123`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // handle example custom URL
  client
    .url(`${baseUrl}/covid19screen/abc`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');
});
