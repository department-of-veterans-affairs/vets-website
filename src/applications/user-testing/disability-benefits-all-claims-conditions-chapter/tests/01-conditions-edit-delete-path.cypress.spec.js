import {
  chooseCause,
  chooseConditionType,
  conditionsInfo,
  enterCauseNewDetails,
  startApplication,
} from './utils/conditionsPages';

import {
  chooseCauseByLabel,
  clickContinue,
  clickSaveAndContinue,
  clickEditOnCard,
  clickDeleteOnCard,
  confirmDelete,
  cancelDelete,
  expectCardText,
  expectPath,
  fillWorsenedDetails,
  openDeleteModalFromCard,
} from './utils/cypressHelpers';

describe('Conditions — Summary (Edit & Delete)', () => {
  it('edits condition 0 and shows a success alert on return', () => {
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
    enterCauseNewDetails(
      0,
      'Condition started in 2022 after training—no prior history.',
    );
    clickContinue();
    expectPath('/user-testing/conditions/conditions-mango-summary', '');
    cy.contains(/Review your conditions/i).should('exist');

    expectCardText(0, {
      titleRe: /asthma/i,
      descRe: /New condition/i,
    });

    clickEditOnCard(0);

    expectPath(
      '/user-testing/conditions/conditions-mango/0/new-condition',
      '?edit=true',
    );
    clickSaveAndContinue();

    expectPath(
      '/user-testing/conditions/conditions-mango/0/new-condition-date',
      '?edit=true',
    );
    clickSaveAndContinue();

    expectPath(
      '/user-testing/conditions/conditions-mango/0/cause',
      '?edit=true',
    );
    chooseCauseByLabel(/Worsened/i);
    clickSaveAndContinue();

    expectPath(
      '/user-testing/conditions/conditions-mango/0/cause-worsened',
      '?edit=true',
    );

    fillWorsenedDetails(
      'Got worse during field exercises and exposure.',
      'Before service: occasional mild symptoms. After service: frequent attacks requiring inhaler.',
    );

    clickSaveAndContinue();

    expectPath(
      '/user-testing/conditions/conditions-mango-summary',
      '?updated=condition-0',
    );

    // Success alert text (host is <va-alert>, content is in light DOM slot)
    cy.get('va-alert')
      .should('exist')
      .and('have.attr', 'status', 'success')
      .contains(/has been updated/i)
      .should('be.visible');

    cy.get('va-alert[status="success"]')
      .shadow()
      .find('button.va-alert-close')
      .click();

    cy.get('va-alert[status="success"]').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  it('deletes the only condition and returns to add a condition screen', () => {
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

    clickDeleteOnCard(0);
    confirmDelete();

    expectPath(
      '/user-testing/conditions/conditions-mango/0/condition',
      '?add=true&removedAllWarn=true',
    );

    // Warning alert text (host is <va-alert>, content is in light DOM slot)
    cy.get('va-alert')
      .should('exist')
      .and('have.attr', 'status', 'warning')
      .contains(/must add at least one/i)
      .should('be.visible');

    cy.injectAxeThenAxeCheck();
  });

  it('confirms delete and removes the card', () => {
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

    clickDeleteOnCard(0);
    // confirm delete inside modal
    cy.get('va-modal[visible]')
      .should('exist')
      .shadow()
      .contains('button', /^Yes, delete this condition$/i)
      .click();

    // If it's the only condition, you’re sent back to add condition page otherwise card disappears
    cy.location('pathname').then(p => {
      if (p.includes('/conditions-mango-summary')) {
        expectCardText(0, { titleRe: /asthma/i, shouldExist: false });
      } else {
        expect(p).to.match(/\/conditions-mango\/0\/condition$/);
      }
    });
    cy.injectAxeThenAxeCheck();
  });

  it('opens/closes the delete modal and stays on summary when cancelling', () => {
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

    openDeleteModalFromCard(0);
    cancelDelete();

    // Still on summary page with card present
    expectPath('/user-testing/conditions/conditions-mango-summary', '');
    expectCardText(0, { titleRe: /asthma/i });

    cy.injectAxeThenAxeCheck();
  });
});
