import { normal, slow } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import {
  testQuestionScenario,
  visitorPassTravel,
  visitorScreeningTravel,
} from './screener-test-question-scenarios';

// custom travel question
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen/459`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // visitor travel passing answers
  testQuestionScenario({ scenario: visitorPassTravel, client });

  // visitor travel needs more screening
  testQuestionScenario({ scenario: visitorScreeningTravel, client });
});
