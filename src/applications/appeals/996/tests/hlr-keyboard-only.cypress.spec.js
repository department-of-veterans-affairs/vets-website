/**
 * E2E test for keyboard only navigation on 996 form.
 */
import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import manifest from '../manifest.json';
import formConfig from '../config/form';
import { CONTESTABLE_ISSUES_API } from '../constants/apis';
import mockV2Data from './fixtures/data/maximal-test-v2.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import * as h from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

describe('Higher-Level Review keyboard only navigation', () => {
  after(() => {
    resetStoredSubTask();
  });

  it('keyboard navigates through a maximal form', () => {
    cypressSetup();

    resetStoredSubTask();

    cy.wrap(mockV2Data.data).as('testData');

    cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);

    cy.get('@testData').then(data => {
      const { chapters } = formConfig;

      cy.intercept('GET', `${CONTESTABLE_ISSUES_API}/compensation`, {
        data: h.fixDecisionDates(data.contestedIssues, { unselected: true }),
      }).as('getIssues');
      cy.visit(manifest.rootUrl);
      cy.injectAxeThenAxeCheck();

      // *** Subtask
      verifyUrl('/start');
      cy.tabToElement('input#compensationinput'); // ID of va-radio-option input
      cy.realPress('Space');

      cy.tabToElement('.subtask-navigation va-button');
      cy.realPress('Enter');

      // *** Intro page
      verifyUrl('/introduction');
      h.startAppKeyboard();

      // *** Veteran details
      verifyUrl(chapters.infoPages.pages.veteranInformation.path);
      cy.wait('@getIssues');
      h.tabToContinue();

      // *** Homelessness radios
      verifyUrl(chapters.infoPages.pages.homeless.path);
      cy.tabToElement('input#root_homelessYesinput');
      cy.chooseRadio(data.homeless ? 'Y' : 'N');
      h.tabToContinue();

      // *** Contact info
      verifyUrl(chapters.infoPages.pages.confirmContactInfo.path);
      h.tabToContinue();

      // *** Issues for review (sorted by random decision date) - only selecting one,
      // or more complex code is needed to find if the next checkbox is before or
      // after the first
      verifyUrl(chapters.issues.pages.contestableIssues.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_contestedIssues_0"]'); // Tinnitus
      cy.realPress('Space');
      h.tabToContinue();

      // *** Area of disagreement for tinnitus
      verifyUrl(
        chapters.issues.pages.areaOfDisagreementFollowUp.path.replace(
          ':index',
          '',
        ),
      );
      cy.tabToInputWithLabel('service connection');
      cy.realPress('Space');
      cy.tabToElement('[name="otherEntry"]');
      // Need to specifically find input within va-text-input element
      cy.get(':focus')
        .find('input')
        .type('Few words', { delay: 0 });
      h.tabToContinue();

      // *** Authorization
      verifyUrl(chapters.issues.pages.authorization.path);
      h.tabToContinue();

      // *** Issue summary
      verifyUrl(chapters.issues.pages.issueSummary.path);
      h.tabToContinue();

      // *** Informal conference choice
      verifyUrl(chapters.informalConference.pages.requestConference.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for H3 focus before tabbing to radios
      cy.tabToElement('input[name="informalConferenceChoice"]');
      cy.chooseRadio('yes');
      h.tabToContinue();

      // *** Informal conference option
      verifyUrl(chapters.informalConference.pages.conferenceContact.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for H3 focus before tabbing to radios
      cy.tabToElement('input[name="informalConference"]');
      cy.chooseRadio('rep');
      h.tabToContinue();

      // *** Rep name & contact info
      verifyUrl(chapters.informalConference.pages.representativeInfoV2.path);
      const rep = data.informalConferenceRep;
      const repPrefix = 'input[name="root_informalConferenceRep_';
      cy.typeInIfDataExists(`${repPrefix}firstName"]`, rep.firstName);
      cy.typeInIfDataExists(`${repPrefix}lastName"]`, rep.lastName);
      cy.typeInIfDataExists(`${repPrefix}phone"]`, rep.phone);
      cy.typeInIfDataExists(`${repPrefix}extension"]`, rep.extension);
      cy.typeInIfDataExists(`${repPrefix}email"]`, rep.email);
      h.tabToContinue();

      // *** Informal conference time
      verifyUrl(chapters.informalConference.pages.conferenceTimeRep.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_informalConferenceTime"]');
      cy.chooseRadio(data.informalConferenceTime);
      h.tabToContinue();

      // *** Review & submit page
      cy.url().should('include', 'review-and-submit');
      cy.tabToElement('va-checkbox');
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // *** Confirmation page
      // Check confirmation page print button
      cy.url().should('include', 'confirmation');
      cy.get('va-button[text="Print this page"]').should('exist');
    });
  });
});
