import {
  chooseCause,
  chooseConditionType,
  conditionsInfo,
  enterCauseNewDetails,
  finishSummaryNoMore,
  reviewAndExpand,
  startApplication,
} from './utils/conditionsPages';

import {
  clickContinue,
  expectCardText,
  expectPath,
} from './utils/cypressHelpers';

describe('Conditions — Happy Path (Pages 0 → 9)', () => {
  it('completes the happy path through summary and review', () => {
    startApplication();
    conditionsInfo();
    chooseConditionType(0);

    cy.get('#inputField').type('asthma');
    cy.get('[data-testid="autocomplete-list"]', { timeout: 5000 }).should(
      'contain.text',
      'asthma',
    );
    cy.contains('[role="option"]', /^asthma$/i).click();

    clickContinue();
    clickContinue();
    chooseCause(0);
    enterCauseNewDetails(0, 'Initial details');

    expectPath('/user-testing/conditions/conditions-mango-summary', '');
    expectCardText(0, { titleRe: /asthma/i });

    // Choose No for adding more conditions
    finishSummaryNoMore(/asthma/i);

    // Review & submit
    reviewAndExpand();

    cy.injectAxeThenAxeCheck();
  });
});
