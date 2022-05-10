import formConfig from '../config/form';
import { fixDecisionDates } from './nod.cypress.helpers';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUser from './fixtures/mocks/user.json';
import mockData from './fixtures/data/maximal-test.json';

// Modified from Cypress docs
// https://glebbahmutov.com/cypress-examples/6.5.0/recipes/form-input-by-label.html#reusable-function
Cypress.Commands.add('tabToInputWithLabel', text => {
  cy.contains('label', text)
    .invoke('attr', 'for')
    .then(id => {
      cy.tabToElement(`#${id}`);
    });
});

describe.skip('Notice of Disagreement keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.intercept('GET', 'v0/notice_of_disagreements/contestable_issues', {
      data: fixDecisionDates(mockData.data.contestableIssues),
    });

    cy.login(mockUser);
    cy.visit('/decision-reviews/board-appeal/request-board-appeal-form-10182');
    cy.injectAxeThenAxeCheck();

    // Intro page
    cy.tabToElement('button[id$="continueButton"]');
    cy.realPress('Space');

    // Veteran details
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Homelessness radios
    cy.tabToElement('[name="root_homeless"]');
    cy.chooseRadio('N');
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Contact info
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Filing deadlines
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Issues for review (sorted by random decision date) - only selecting one,
    // or more complex code is needed to find if the next checkbox is before or
    // after the first
    cy.tabToInputWithLabel('tinnitus');
    cy.realPress('Space');
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // area of disagreement for tinnitus
    cy.tabToInputWithLabel('service connection');
    cy.realPress('Space');
    cy.tabToElement('#root_otherEntry');
    cy.typeInFocused('Few words');
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Issue summary
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Board review option
    cy.tabToElement('[name="root_boardReviewOption"]');
    cy.chooseRadio('hearing');
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Hearing type
    cy.tabToElement('[name="root_hearingTypePreference"]');
    cy.chooseRadio('video_conference');
    cy.tabToElement('button[type="submit"]');
    cy.realPress('Space');

    // Review & submit page
    cy.tabToElement('[name="privacyAgreementAccepted"]');
    cy.realPress('Space');

    // Form submit button is a button type?
    cy.tabToElement('button[id$="continueButton"].usa-button-primary');
    cy.realPress('Space');

    // Confirmation page print button
    cy.get('button.screen-only').should('exist');
  });
});
