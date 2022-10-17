import path from 'path';

import formConfig from '../config/form';
import { fixDecisionDates } from './nod.cypress.helpers';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUser from './fixtures/mocks/user.json';

describe.skip('Notice of Disagreement keyboard only navigation', () => {
  before(() => {
    cy.fixture(path.join(__dirname, 'fixtures/data/minimal-test.json')).as(
      'testData',
    );
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.login(mockUser);
  });

  it('navigates through a maximal form', () => {
    cy.get('@testData').then(({ data }) => {
      const { chapters } = formConfig;
      cy.intercept('GET', 'v0/notice_of_disagreements/contestable_issues', {
        data: fixDecisionDates(data.contestableIssues),
      });
      cy.visit(
        '/decision-reviews/board-appeal/request-board-appeal-form-10182',
      );
      cy.injectAxeThenAxeCheck();

      // Intro page
      cy.tabToStartForm();

      // Veteran details
      cy.url().should(
        'include',
        chapters.infoPages.pages.veteranInformation.path,
      );
      cy.tabToContinueForm();

      // Homelessness radios
      cy.url().should('include', chapters.infoPages.pages.homeless.path);
      cy.tabToElement('[name="root_homeless"]');
      cy.chooseRadio('N');
      cy.tabToContinueForm();

      // Contact info
      cy.url().should(
        'include',
        chapters.infoPages.pages.confirmContactInformation.path,
      );
      cy.tabToContinueForm();

      // Filing deadlines
      cy.url().should(
        'include',
        chapters.conditions.pages.filingDeadlines.path,
      );
      cy.tabToContinueForm();

      // Issues for review (sorted by random decision date) - only selecting one,
      // or more complex code is needed to find if the next checkbox is before or
      // after the first
      cy.url().should(
        'include',
        chapters.conditions.pages.contestableIssues.path,
      );
      cy.tabToInputWithLabel('tinnitus');
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
      cy.tabToElement('#root_otherEntry');
      cy.typeInFocused('Few words');
      cy.tabToContinueForm();

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
      cy.tabToElement('[name="privacyAgreementAccepted"]');
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // Check confirmation page print button
      cy.url().should('include', 'confirmation');
      cy.get('button.screen-only').should('exist');
    });
  });
});
