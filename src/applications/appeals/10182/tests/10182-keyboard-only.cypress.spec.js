/**
 * E2E test for keyboard only navigation on 10182 form.
 */
import manifest from '../manifest.json';
import formConfig from '../config/form';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import { CONTESTABLE_ISSUES_API, SUBMIT_URL } from '../constants/apis';
import mockData from './fixtures/data/maximal-test.json';
import { CONTACT_INFO_PATH } from '../../shared/constants';
import * as h from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

describe('Notice of Disagreement keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cypressSetup();

    cy.wrap(mockData.data).as('testData');

    cy.intercept('PUT', '/v0/in_progress_forms/10182', mockInProgress);
    cy.intercept('POST', SUBMIT_URL, mockSubmit);

    cy.get('@testData').then(data => {
      const { chapters } = formConfig;

      cy.intercept('GET', CONTESTABLE_ISSUES_API, {
        data: h.fixDecisionDates(data.contestedIssues, { unselected: true }),
      });

      cy.visit(
        '/decision-reviews/board-appeal/request-board-appeal-form-10182',
      );

      cy.injectAxeThenAxeCheck();

      // *** Intro page
      h.startAppKeyboard();

      // *** Veteran details
      verifyUrl(chapters.infoPages.pages.veteranInformation.path);
      h.tabToContinue();

      // *** Homelessness radios
      verifyUrl(chapters.infoPages.pages.homeless.path);
      cy.tabToElement('input[name="root_homeless"]');
      cy.chooseRadio('N');
      h.tabToContinue();

      // *** Contact info
      verifyUrl(CONTACT_INFO_PATH);
      h.tabToContinue();

      // *** Filing deadlines
      verifyUrl(chapters.issues.pages.filingDeadlines.path);
      h.tabToContinue();

      // *** Request extension
      verifyUrl(chapters.issues.pages.extensionRequest.path);
      cy.tabToElement('[name="root_requestingExtension"]');
      cy.chooseRadio(data.requestingExtension ? 'Y' : 'N');
      h.tabToContinue();

      // *** Request reason
      verifyUrl(chapters.issues.pages.extensionReason.path);
      cy.tabToElement('textarea');
      cy.realType(data.extensionReason);
      h.tabToContinue();

      // *** Denial of VHA benefits
      verifyUrl(chapters.issues.pages.appealingVhaDenial.path);
      cy.tabToElement('[name="root_appealingVHADenial"]');
      cy.chooseRadio(data.appealingVHADenial ? 'Y' : 'N');
      h.tabToContinue();

      // *** Issues for review (sorted by random decision date) - only selecting
      // one, or more complex code is needed to find if the next checkbox is
      // before or after the first
      verifyUrl(chapters.issues.pages.contestableIssues.path);
      cy.tabToElement('[name="root_contestedIssues_1"]'); // tinnitus
      cy.realPress('Space');
      h.tabToContinue();

      // *** Area of disagreement for tinnitus
      verifyUrl(
        chapters.issues.pages.areaOfDisagreementFollowUp.path.replace(
          ':index',
          '',
        ),
      );
      cy.tabToElement('[name="serviceConnection"]');
      cy.realPress('Space');
      h.tabToContinue();

      // *** Issue summary
      verifyUrl(chapters.issues.pages.issueSummary.path);
      h.tabToContinue();

      // *** Board review option
      verifyUrl(chapters.boardReview.pages.boardReviewOption.path);
      cy.tabToElement('[name="root_boardReviewOption"]');
      cy.chooseRadio('hearing');
      h.tabToContinue();

      // *** Hearing type
      verifyUrl(chapters.boardReview.pages.hearingType.path);
      cy.tabToElement('[name="root_hearingTypePreference"]');
      cy.chooseRadio('video_conference');
      h.tabToContinue();

      // *** Review & submit page
      verifyUrl('review-and-submit');
      cy.tabToElement('va-checkbox');
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // *** Confirmation page
      // Check confirmation page print button
      verifyUrl('confirmation');
      cy.get('va-button[text="Print this page"]').should('exist');
    });
  });
});
