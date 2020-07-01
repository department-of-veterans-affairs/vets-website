import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import {
  testQuestionScenario,
  visitorPass,
  visitorScreening,
  staffPass,
  staffScreening,
} from './screener-test-question-scenarios';

// test scenarios for visitors and staff
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // visitor passing answers
  testQuestionScenario({ scenario: visitorPass, client });

  // visitor needs more screening
  testQuestionScenario({ scenario: visitorScreening, client });

  // staff passing answers
  testQuestionScenario({ scenario: staffPass, client });

  // staff needs more screening
  testQuestionScenario({ scenario: staffScreening, client });
});
