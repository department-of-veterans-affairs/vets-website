import {
  chooseCause,
  chooseConditionType,
  conditionsInfo,
  enterCauseNewDetails,
  finishSummaryNoMore,
  reviewAndExpand,
  sideOfBodyThenDate,
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
    cy.get('#inputField').type('ankle sprain');
    cy.get('[data-testid="autocomplete-list"]', { timeout: 5000 }).should(
      'contain.text',
      'ankle sprain',
    );
    cy.contains('[role="option"]', /ankle/i).click();

    clickContinue();

    // Enter side of body and date
    sideOfBodyThenDate(0, '2022-06-15', 'LEFT');

    // Choose the cause:  New
    chooseCause(0);

    // Enter the date and description for the new condition
    enterCauseNewDetails(
      0,
      'Condition started in 2022 after training—no prior history.',
    );

    // Choose No for adding more conditions
    finishSummaryNoMore(/ankle/i);

    // Review & submit
    reviewAndExpand();
  });
});
