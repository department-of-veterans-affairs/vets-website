import {
  chooseCause,
  chooseConditionType,
  conditionsInfo,
  enterCauseNewDetails,
  finishSummaryNoMore,
  reviewAndExpand,
  startApplication,
} from './utils/conditionsPages';

import { clickContinue } from './utils/cypressHelpers';

describe('Conditions — Happy Path (Pages 0 → 9)', () => {
  it('completes the happy path through summary and review', () => {
    // Click start application without signing in
    startApplication();

    // Information page
    conditionsInfo();

    // Choose a type of condition to add:  New or Rated Disability
    chooseConditionType(0);

    // Enter a condition with laterality
    cy.get('#inputField').type('asthma');
    cy.get('[data-testid="autocomplete-list"]', { timeout: 5000 }).should(
      'contain.text',
      'asthma',
    );
    cy.contains('[role="option"]', /asthma/i).click();

    clickContinue();
    clickContinue();

    // Choose the cause:  New
    chooseCause(0);

    // Enter the date and description for the new condition
    enterCauseNewDetails(
      0,
      'Condition started in 2022 after training—no prior history.',
    );

    // Choose No for adding more conditions
    finishSummaryNoMore(/asthma/i);

    // Review & submit
    reviewAndExpand();

    cy.injectAxeThenAxeCheck();
  });
});
