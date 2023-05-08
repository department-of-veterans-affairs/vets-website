import formConfig from '../config/form';
import { CONTESTABLE_ISSUES_API, WIZARD_STATUS } from '../constants';

import { fixDecisionDates } from './hlr.cypress.helpers';
import mockV2Data from './fixtures/data/maximal-test-v2.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUserAvail from './fixtures/mocks/user_transition_availabilities.json';
import mockVamc from './fixtures/mocks/vamc-ehr.json';
import mockUser from './fixtures/mocks/user.json';

describe('Higher-Level Review keyboard only navigation', () => {
  after(() => {
    window.sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('keyboard navigates through a maximal form', () => {
    window.sessionStorage.removeItem(WIZARD_STATUS);

    cy.wrap(mockV2Data.data).as('testData');
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [],
      },
    });
    cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
    cy.intercept('GET', '/v0/user_transition_availabilities', mockUserAvail);
    cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);
    cy.intercept('GET', '/v0/profile/status', mockStatus);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);

    cy.login(mockUser);

    cy.get('@testData').then(data => {
      const { chapters } = formConfig;
      cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}compensation`, {
        data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      });
      cy.visit(
        '/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996/start',
      );
      cy.injectAxeThenAxeCheck();

      // Wizard
      cy.url().should('include', '/start');
      cy.tabToElement('va-radio-option');
      cy.realPress('Space');
      cy.tabToElement('.vads-c-action-link--green');
      cy.realPress('Enter');

      // Intro page
      cy.url().should('include', '/introduction');
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
      cy.tabToElement('input[type="checkbox"]');
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // Check confirmation page print button
      cy.url().should('include', 'confirmation');
      cy.get('button.screen-only').should('exist');
    });
  });
});
