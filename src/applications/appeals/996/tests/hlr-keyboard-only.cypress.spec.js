import path from 'path';

import formConfig from '../config/form';
import { CONTESTABLE_ISSUES_API, WIZARD_STATUS } from '../constants';

import {
  mockContestableIssues,
  // getRandomDate,
  fixDecisionDates,
} from './hlr.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUser from './fixtures/mocks/user.json';

describe('Notice of Disagreement keyboard only navigation', () => {
  before(() => {
    window.sessionStorage.removeItem(WIZARD_STATUS);

    cy.fixture(path.join(__dirname, 'fixtures/data/maximal-test-v2.json')).as(
      'testData',
    );
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [],
      },
    });
    cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
    cy.intercept('GET', '/v0/profile/status', mockStatus);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);

    cy.intercept(
      'GET',
      `/v1${CONTESTABLE_ISSUES_API}compensation`,
      mockContestableIssues,
    );

    cy.login(mockUser);
  });
  after(() => {
    window.sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('navigates through a maximal form', () => {
    cy.get('@testData').then(({ data }) => {
      const { chapters } = formConfig;
      cy.intercept('GET', 'v1/notice_of_disagreements/contestable_issues', {
        data: fixDecisionDates(data.contestableIssues),
      });
      cy.visit(
        '/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996',
      );
      cy.injectAxeThenAxeCheck();

      // Wizard
      cy.tabToElement('input[name="higher-level-review-option"]');
      cy.chooseRadio('compensation');
      cy.tabToStartForm();

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
      cy.chooseRadio(data.homeless ? 'Y' : 'N');
      cy.tabToContinueForm();

      // Contact info
      cy.url().should(
        'include',
        chapters.infoPages.pages.confirmContactInformation.path,
      );
      cy.tabToContinueForm();

      // Issues for review (sorted by random decision date) - only selecting one,
      // or more complex code is needed to find if the next checkbox is before or
      // after the first
      cy.url().should(
        'include',
        chapters.conditions.pages.contestableIssues.path,
      );
      cy.tabToInputWithLabel('Tinnitus');
      cy.realPress('Space');
      cy.tabToContinueForm();

      // Area of disagreement for tinnitus
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

      // Informal conference option
      cy.url().should(
        'include',
        chapters.informalConference.pages.requestConference.path,
      );
      cy.tabToElement('[name="root_informalConference"]');
      cy.chooseRadio(data.informalConference);
      cy.tabToContinueForm();

      // Rep name & contact info
      cy.url().should(
        'include',
        chapters.informalConference.pages.representativeInfoV2.path,
      );
      const rep = data.informalConferenceRep;
      const repPrefix = '#root_informalConferenceRep_';
      cy.typeInIfDataExists(`${repPrefix}firstName`, rep.firstName);
      cy.typeInIfDataExists(`${repPrefix}lastName`, rep.lastName);
      cy.typeInIfDataExists(`${repPrefix}phone`, rep.phone);
      cy.typeInIfDataExists(`${repPrefix}extension`, rep.extension);
      cy.typeInIfDataExists(`${repPrefix}email`, rep.email);
      cy.tabToContinueForm();

      // Informal conference time
      cy.url().should(
        'include',
        chapters.informalConference.pages.conferenceTime.path,
      );
      cy.tabToElement('[name="root_informalConferenceTime"]');
      cy.chooseRadio(data.informalConferenceTime);
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
