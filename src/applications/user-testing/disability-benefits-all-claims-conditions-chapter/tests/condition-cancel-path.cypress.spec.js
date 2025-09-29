import {
  chooseConditionTypeRadioBtn,
  clickContinue,
  expectPath,
} from './utils/cypressHelpers';
import {
  addCondition,
  chooseCauseByLabel,
  chooseConditionType,
  conditionsInfo,
  enterCauseNewDetails,
  enterNewCondition,
  sideOfBodyThenDate,
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
  });

  it('Back navigates to the intro (Page 1)', () => {
    bootstrapToAddCondition();

    cy.contains('button', /^Back$/i).click();
    expectPath('/user-testing/conditions/conditions-mango-intro', '');
    cy.contains('h3', /Add your disabilities and conditions/i).should(
      'be.visible',
    );
  });

  it('selects a condition type and can continue', () => {
    bootstrapToAddCondition();

    chooseConditionTypeRadioBtn(0); // "A condition I haven't claimed before"
    clickContinue();

    // We expect to land on add condition page with index 0
    expectPath(
      '/user-testing/conditions/conditions-mango/0/new-condition',
      '?add=true',
    );
  });

  it('requires Yes/No before continuing on summary', () => {
    startApplication();
    conditionsInfo();
    chooseConditionType(0);
    enterNewCondition(0, 'asthma');
    sideOfBodyThenDate(0, '2022-06-15');
    chooseCauseByLabel(/New condition|caused by an injury/i);
    enterCauseNewDetails(
      0,
      'Condition started in 2022 after training—no prior history.',
    );

    expectPath('/user-testing/conditions/conditions-mango-summary', '');
    cy.contains('button', /^Continue$/i).click();

    cy.get('va-radio[name="root_view:hasConditions"]').should(
      'have.attr',
      'aria-invalid',
      'true',
    );
  });
});
