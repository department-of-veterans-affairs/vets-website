import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import {
  testQuestionScenario,
  visitorPass,
  visitorScreening,
  staffPass,
  staffScreening,
  fullTestRouteOptions,
  routeOptions,
} from './question-scenario-helper';

// test scenarios for visitors and staff
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  routeOptions.forEach(routeOption => {
    client
      .url(`${baseUrl}/covid19screen${routeOption.route}`)
      .pause(1000)
      .waitForElementVisible('body', normal)
      .assert.containsText(
        '.covid-screener div[class*=vads-l-grid-container]',
        `${routeOption.expectedText}`,
        routeOption.title,
      );
  });

  fullTestRouteOptions.forEach(routeOption => {
    client.url(`${baseUrl}/covid19screen${routeOption}`);

    // visitor passing answers
    testQuestionScenario({
      scenario: visitorPass,
      routeOption,
      client,
    });

    // visitor needs more screening
    testQuestionScenario({
      scenario: visitorScreening,
      routeOption,
      client,
    });

    // staff passing answers
    testQuestionScenario({
      scenario: staffPass,
      routeOption,
      client,
    });

    // staff needs more screening
    testQuestionScenario({
      scenario: staffScreening,
      routeOption,
      client,
    });
  });
});
