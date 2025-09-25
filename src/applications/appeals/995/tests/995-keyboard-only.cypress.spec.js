import manifest from '../manifest.json';
import formConfig from '../config/form';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import {
  ADD_ISSUE_PATH,
  CONTACT_INFO_PATH,
  EVIDENCE_ADDITIONAL_PATH,
  EVIDENCE_PRIVATE_AUTHORIZATION_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_PRIVATE_REQUEST_PATH,
  EVIDENCE_VA_REQUEST_PATH,
  LIMITED_CONSENT_DETAILS_PATH,
  LIMITED_CONSENT_PROMPT_PATH,
} from '../constants';
import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { CONTESTABLE_ISSUES_API, ITF_API } from '../constants/apis';
import * as h from './995.cypress.helpers';
import mockData from './fixtures/data/keyboard-test.json';
import { fixDecisionDates } from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

describe('Supplemental Claim keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cypressSetup();

    cy.wrap(mockData.data).as('testData');

    cy.intercept('GET', ' /v0/in_progress_forms/20-0995', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.intercept('GET', ITF_API, h.fetchItf());
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'sc_new_form', value: true }],
      },
    });

    cy.get('@testData').then(data => {
      cy.intercept('GET', `${CONTESTABLE_ISSUES_API}/compensation`, {
        data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      });

      cy.visit(manifest.rootUrl);
      cy.injectAxeThenAxeCheck();

      // *** Start page - type of claim
      h.verifyUrl('start');
      cy.tabToElement('input[value="compensation"]');
      cy.realPress('Space');
      cy.tabToElement('button[type="button"]');
      cy.realPress('Enter');

      // *** Intro page
      cy.tabToStartForm();
      cy.realPress('Enter');

      // *** Intent to file page
      h.verifyUrl(h.VETERAN_INFO_PATH);
      cy.injectAxeThenAxeCheck();
      cy.tabToElement('button'); // targets secondary button
      cy.realPress('Tab'); // tab to primary "continue" button
      cy.realPress('Enter');

      // *** Veteran information page
      h.verifyUrl(h.VETERAN_INFO_PATH);
      cy.tabToContinueForm();

      // Feature toggles are flaky in the Cypress env for some reason
      // Adding this here until we completely remove the SC new toggle (as this page depends on it)
      cy.url().then(url => {
        if (url.includes(h.HOMELESSNESS_PATH)) {
          // *** Homelessness page
          h.verifyUrl(h.HOMELESSNESS_PATH);
          cy.tabToElement('[name="root_housingRisk"]');
          cy.chooseRadio('N');
          cy.tabToContinueForm();
        }
      });

      // *** Contact info page
      h.verifyUrl(CONTACT_INFO_PATH);
      cy.tabToElement('button.usa-button-primary[id$="continueButton"]');
      cy.realPress('Space');

      // *** Primary phone page
      h.verifyUrl(h.PRIMARY_PHONE_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for focus on header
      cy.tabToElement('[value="home"]');
      cy.chooseRadio('home'); // make sure we're choosing home (either is fine)
      cy.tabToContinueForm();

      // *** Contestable issues page - select an existing issue
      h.verifyUrl(CONTESTABLE_ISSUES_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_contestedIssues_0"]'); // tinnitus
      cy.realPress('Space');

      // Add one issue
      cy.tabToElement('.add-new-issue');
      cy.realPress('Enter');
      h.verifyUrl(ADD_ISSUE_PATH);

      const newIssue = data.additionalIssues[0];
      cy.tabToElement('[name="issue-name"]');
      cy.realType(newIssue.issue);

      const issueDate = newIssue.decisionDate
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement('[name="decision-dateMonth"]');
      cy.realPress(issueDate[1]); // month
      cy.realPress('Tab');
      cy.realPress(issueDate[2]); // day
      cy.realPress('Tab');
      cy.realType(issueDate[0]); // year
      cy.tabToElement('button:not(.usa-button--outline)');
      cy.realPress('Enter');
      h.verifyUrl(CONTESTABLE_ISSUES_PATH);
      cy.tabToContinueForm();

      // *** Issue summary page
      h.verifyUrl(h.ISSUES_SUMMARY_PATH);
      cy.tabToContinueForm();

      // *** Opt-in page - seen when there are legacy or added issues
      h.verifyUrl(h.OPT_IN_PATH);
      cy.tabToContinueForm();

      // *** Presumptive conditions page
      h.verifyUrl(h.NOTICE_5103_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('#checkbox-element'); // certify reviewed
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // *** Facility types page
      h.verifyUrl(h.FACILITY_TYPES_PATH);
      cy.setCheckboxFromData(h.VA_EVIDENCE_CHECKBOX, true);
      cy.setCheckboxFromData(h.NON_VA_EVIDENCE_CHECKBOX, true);
      cy.tabToSubmitForm();

      // *** VA evidence request (y/n) question page
      h.verifyUrl(EVIDENCE_VA_REQUEST_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_view:hasVaEvidence"]'); // Yes radio
      cy.chooseRadio('Y');
      cy.tabToSubmitForm();

      // *** VA evidence location details page
      h.verifyUrl(h.EVIDENCE_VA_RECORDS_DETAILS_PATH);
      const locationData = data.locations[0];

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for focus on header
      cy.tabToElement(h.VA_EVIDENCE_FACILITY_NAME_INPUT); // name of VA location
      cy.realType(locationData.locationAndName);
      cy.tabToElement(h.VA_EVIDENCE_ISSUES_CHECKBOXES); // select first issue
      cy.realPress('Space');
      h.selectDropdownWithKeyboard('txdate', '1'); // fill out month
      cy.tabToElement(h.VA_EVIDENCE_TREATMENT_YEAR);
      cy.realType('2001'); // fill out year
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // *** Private evidence request (y/n) question page
      h.verifyUrl(EVIDENCE_PRIVATE_REQUEST_PATH);
      cy.tabToElement('[name="private"]'); // Yes radio
      cy.chooseRadio('y'); // make sure we're choosing yes
      cy.tabToSubmitForm();

      // *** Private evidence authorization page
      h.verifyUrl(EVIDENCE_PRIVATE_AUTHORIZATION_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);

      cy.tabToElement(h.PRIVACY_MODAL_TRIGGER_1_BUTTON);
      cy.realPress('Enter'); // Open modal

      // Verify modal is open
      cy.get(h.PRIVACY_MODAL_TITLE)
        .should('have.attr', 'visible')
        .and('not.equal', 'false');

      // Close modal with Escape key
      cy.realPress('Escape');

      // Verify focus returns to the first button that opened it
      cy.focused().then($focusedEl => {
        // Get the shadow host (the va-button element)
        const shadowHost = $focusedEl[0].getRootNode().host;
        expect(shadowHost.id).to.equal(h.PRIVACY_MODAL_TRIGGER_1_ID);
      });

      cy.setCheckboxFromData(h.PRIVACY_AGREEMENT_CHECKBOX, true);
      cy.tabToSubmitForm();

      // *** Limited consent prompt page
      h.verifyUrl(LIMITED_CONSENT_PROMPT_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement(h.LIMITED_CONSENT_RADIOS); // Yes radio
      cy.chooseRadio('Y');
      cy.tabToSubmitForm();

      // *** Limited consent details page
      h.verifyUrl(LIMITED_CONSENT_DETAILS_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement(h.LIMITED_CONSENT_TEXTAREA);
      cy.realType('Testing');
      cy.tabToSubmitForm();

      // *** Private evidence facility page
      h.verifyUrl(EVIDENCE_PRIVATE_PATH);

      const facilityData = data.providerFacility[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="name"]'); // provider or hospital
      cy.realType(facilityData.providerFacilityName);

      cy.realPress('Tab'); // skip country select
      cy.realPress('Tab'); // street address
      cy.realType(facilityData.providerFacilityAddress.street);
      cy.realPress('Tab'); // skip street address line 2
      cy.realPress('Tab'); // city
      cy.realType(facilityData.providerFacilityAddress.city);
      cy.realPress('Tab'); // state select; but we type like normal
      cy.realType(facilityData.providerFacilityAddress.state);
      cy.realPress('Tab'); // postal code
      cy.realType(facilityData.providerFacilityAddress.postalCode);

      cy.tabToElement('[name="issues"]'); // select first issue (ignore data)
      cy.realPress('Space');

      // Provider from date
      const privateFromDate = facilityData.treatmentDateRange.from
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement('[name="fromMonth"]');
      cy.realType(privateFromDate[1]); // month
      cy.realPress('Tab');
      cy.realType(privateFromDate[2]); // day
      cy.realPress('Tab');
      cy.realType(privateFromDate[0]); // year

      // Provider to date
      const privateToDate = facilityData.treatmentDateRange.to
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement('[name="toMonth"]');
      cy.realType(privateToDate[1]); // month
      cy.realPress('Tab');
      cy.realType(privateToDate[2]); // day
      cy.realPress('Tab');
      cy.realType(privateToDate[0]); // year
      cy.tabToSubmitForm();

      // *** Upload evidence (y/n) - skipping since we can't test uploads
      h.verifyUrl(EVIDENCE_ADDITIONAL_PATH);
      cy.tabToElement(h.ADDTL_EVIDENCE_RADIO); // No radio
      cy.chooseRadio('N');
      cy.tabToSubmitForm();

      // *** Evidence summary
      h.verifyUrl(h.EVIDENCE_SUMMARY_PATH);
      cy.tabToSubmitForm();

      // *** MST page
      h.verifyUrl(h.MST_PATH);
      cy.tabToElement(h.MST_RADIO); // No radio
      cy.chooseRadio('N');
      cy.tabToSubmitForm();

      // *** Review & submit page
      cy.url().should('include', h.REVIEW_PATH);
      cy.tabToElement('va-checkbox');
      cy.get(':focus').then($el => {
        // privacy checkbox is already checked because privacyAgreementAccepted
        // is accidentally used by both 4142 and SC review & submit checkbox
        if (!$el[0].checked) {
          cy.realPress('Space');
        }
      });
      cy.tabToSubmitForm();

      // *** Confirmation page
      // Check confirmation page print button
      cy.url().should('include', 'confirmation');
      cy.get('va-button[text="Print this page"]').should('exist');
    });
  });
});
