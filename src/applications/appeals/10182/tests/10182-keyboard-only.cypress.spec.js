import formConfig from '../config/form';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { CONTESTABLE_ISSUES_API } from '../constants';
import mockData from './fixtures/data/maximal-test.json';

import { CONTACT_INFO_PATH } from '../../shared/constants';
import { fixDecisionDates } from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

// Skipping for now
describe.skip('Notice of Disagreement keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cypressSetup();

    cy.wrap(mockData.data).as('testData');

    cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
    cy.intercept('POST', `v0/${formConfig.submitUrl}`, mockSubmit);
    cy.intercept('POST', `v1/${formConfig.submitUrl}`, mockSubmit);

    cy.get('@testData').then(data => {
      const { chapters } = formConfig;

      cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}`, {
        data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      });
      cy.visit(
        '/decision-reviews/board-appeal/request-board-appeal-form-10182',
      );
      cy.injectAxeThenAxeCheck();

      // Intro page
      // TODO: tabToStartForm Cypress function needs to be updated to only
      // target action links
      cy.tabToElement('.vads-c-action-link--green');
      cy.realPress('Enter');

      // Veteran details
      cy.url().should(
        'include',
        chapters.infoPages.pages.veteranInformation.path,
      );
      cy.tabToContinueForm();

      // Homelessness radios
      cy.url().should('include', chapters.infoPages.pages.homeless.path);
      cy.tabToElement('input[name="root_homeless"]');
      cy.chooseRadio('N');
      cy.tabToContinueForm();

      // Contact info
      cy.url().should('include', CONTACT_INFO_PATH);
      // cy.tabToContinueForm();
      cy.tabToElement('button.usa-button-primary[id$="continueButton"]');
      cy.realPress('Space');

      // Filing deadlines
      cy.url().should(
        'include',
        chapters.conditions.pages.filingDeadlines.path,
      );
      cy.tabToContinueForm();

      // Request extension
      cy.url().should(
        'include',
        chapters.conditions.pages.extensionRequest.path,
      );
      cy.tabToElement('[name="root_requestingExtension"]');
      cy.chooseRadio(data.requestingExtension ? 'Y' : 'N');
      cy.tabToContinueForm();

      // Request reason
      cy.url().should(
        'include',
        chapters.conditions.pages.extensionReason.path,
      );
      cy.tabToElement('textarea');
      cy.realType(data.extensionReason);
      cy.tabToContinueForm();

      // Denial of VHA benefits
      cy.url().should(
        'include',
        chapters.conditions.pages.appealingVhaDenial.path,
      );
      cy.tabToElement('[name="root_appealingVHADenial"]');
      cy.chooseRadio(data.appealingVHADenial ? 'Y' : 'N');
      cy.tabToContinueForm();

      // Issues for review (sorted by random decision date) - only selecting one,
      // or more complex code is needed to find if the next checkbox is before or
      // after the first
      cy.url().should(
        'include',
        chapters.conditions.pages.contestableIssues.path,
      );
      cy.tabToElement('[name="root_contestedIssues_1"]'); // tinnitus
      cy.realPress('Space');
      cy.tabToContinueForm();

      // area of disagreement for tinnitus
      cy.url().should(
        'include',
        chapters.conditions.pages.areaOfDisagreementFollowUp.path.replace(
          ':index',
          '',
        ),
      );
      cy.tabToInputWithLabel('service connection');
      cy.realPress('Space');
      // input typing is flaky
      // cy.tabToElement('input[name="otherEntry"]');
      // cy.typeInFocused('Few words');
      // cy.tabToContinueForm();
      cy.tabToElement('button.usa-button-primary[id$="continueButton"]');
      cy.realPress('Space');

      // Issue summary
      cy.url().should('include', chapters.conditions.pages.issueSummary.path);
      cy.tabToContinueForm();

      // Board review option
      cy.url().should(
        'include',
        chapters.boardReview.pages.boardReviewOption.path,
      );
      cy.tabToElement('[name="root_boardReviewOption"]');
      cy.chooseRadio('hearing');
      cy.tabToContinueForm();

      // Hearing type
      cy.url().should('include', chapters.boardReview.pages.hearingType.path);
      cy.tabToElement('[name="root_hearingTypePreference"]');
      cy.chooseRadio('video_conference');
      cy.tabToContinueForm();

      // Review & submit page
      cy.url().should('include', 'review-and-submit');
      cy.tabToElement('va-checkbox');
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // Check confirmation page print button
      cy.url().should('include', 'confirmation');
      cy.get('va-button.screen-only').should('exist');
    });
  });
});
