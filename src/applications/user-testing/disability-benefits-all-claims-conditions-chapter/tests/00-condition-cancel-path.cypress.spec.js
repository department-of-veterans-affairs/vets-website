import {
  chooseConditionTypeRadioBtn,
  clickContinue,
  expectPath,
} from './utils/cypressHelpers';

import {
  addCondition,
  chooseCause,
  conditionsInfo,
  enterCauseNewDetails,
  startApplication,
} from './utils/conditionsPages';

describe('Conditions — Page 2: Add a condition', () => {
  const bootstrapToAddCondition = () => {
    startApplication();
    conditionsInfo();
    clickContinue();
    addCondition(0);
  };

  it('blocks Continue when nothing is selected (required validation)', () => {
    bootstrapToAddCondition();

    clickContinue(); // try without selecting an option

    // required validation on the radio group
    cy.get('va-radio[name="root_ratedDisability"]').should(
      'have.attr',
      'aria-invalid',
      'true',
    );

    // still on Page 2
    expectPath(
      '/user-testing/conditions/conditions-mango/0/condition',
      '?add=true',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('opens Cancel modal and stays on page when choosing "No, continue..."', () => {
    bootstrapToAddCondition();

    // Open the modal
    cy.get('va-button[data-action="cancel"]')
      .should('exist')
      .shadow()
      .find('button')
      .should('be.visible')
      .click();

    cy.get('va-modal[visible]').should('exist');

    // Click "No, continue..."
    cy.get('va-modal[visible]')
      .shadow()
      .contains('button', /No, continue adding this condition/i)
      .should('be.visible')
      .click();

    // Modal remains but no [visible] attribute, and inner dialog is gone
    cy.get('va-modal').should('exist');
    cy.get('va-modal')
      .shadow()
      .find('.usa-modal')
      .should('not.exist');
    cy.get('va-modal')
      .shadow()
      .find('.usa-modal')
      .should('not.exist');

    // Still on condition info page
    expectPath(
      '/user-testing/conditions/conditions-mango/0/condition',
      '?add=true',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('opens Cancel modal and leaves page when choosing "Yes, cancel"', () => {
    bootstrapToAddCondition();

    cy.get('va-button[data-action="cancel"]')
      .shadow()
      .find('button')
      .click();
    cy.get('va-modal[visible]').should('exist');

    cy.get('va-modal[visible]')
      .shadow()
      .contains('button', /^Yes, cancel$/i)
      .should('be.visible')
      .click();

    cy.location('pathname').should(
      'not.eq',
      '/user-testing/conditions/conditions-mango/0/condition',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('Back navigates to the intro (Page 1)', () => {
    bootstrapToAddCondition();

    cy.contains('button', /^Back$/i).click();
    expectPath('/user-testing/conditions/conditions-mango-intro', '');
    cy.contains('h3', /Add your disabilities and conditions/i).should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('selects a condition type and can continue', () => {
    bootstrapToAddCondition();

    chooseConditionTypeRadioBtn(0);
    clickContinue();

    expectPath(
      '/user-testing/conditions/conditions-mango/0/new-condition',
      '?add=true',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('requires Yes/No before continuing on summary', () => {
    bootstrapToAddCondition();
    chooseConditionTypeRadioBtn(0);
    clickContinue();

    const BASE = `/user-testing/conditions/conditions-mango/0`;
    expectPath(`${BASE}/new-condition`, '?add=true');

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
    clickContinue();

    cy.get('va-radio[name="root_view:hasConditions"]').should(
      'have.attr',
      'aria-invalid',
      'true',
    );
    cy.injectAxeThenAxeCheck();
  });
});
