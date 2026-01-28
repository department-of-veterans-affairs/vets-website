/**
 * E2E test for keyboard only navigation on 995 form.
 */
import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import mockPrefill from '../fixtures/mocks/prefill.json';
import mockInProgress from '../fixtures/mocks/in-progress-forms.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import {
  ADD_ISSUE_URL,
  CONTACT_INFO_URL,
  // EVIDENCE_ADDITIONAL_URL,
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
  EVIDENCE_URLS,
  NOV_2025_REDESIGN_TOGGLE,
  TOGGLE_KEY,
} from '../../constants';
import { CONTESTABLE_ISSUES_PATH } from '../../../shared/constants';
import { CONTESTABLE_ISSUES_API, ITF_API } from '../../constants/apis';
import * as h from './995.cypress.helpers';
import * as helpers from '../../../shared/tests/cypress.helpers';
import mockData from '../fixtures/data/pre-api-comprehensive-test.json';
import {
  fixDecisionDates,
  tabToContinue,
} from '../../../shared/tests/cypress.helpers';
import cypressSetup from '../../../shared/tests/cypress.setup';

describe('Supplemental Claim keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cypressSetup();

    cy.wrap(mockData.data).as('testData');

    cy.intercept('GET', ' /v0/in_progress_forms/20-0995', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.intercept('GET', ITF_API, helpers.fetchItf());
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: NOV_2025_REDESIGN_TOGGLE,
            value: true,
          },
          {
            name: TOGGLE_KEY,
            value: true,
          },
        ],
      },
    }).as('features');

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
      tabToContinue();

      // *** Homelessness page
      h.verifyUrl(h.HOMELESSNESS_PATH);
      cy.tabToElement('[name="root_housingRisk"]');
      cy.chooseRadio('Y');
      tabToContinue();

      // *** Living situation page
      h.verifyUrl(h.LIVING_SITUATION_PATH);
      cy.setCheckboxFromData(h.LIVING_SITUATION_SHELTER_CHECKBOX, true);
      cy.setCheckboxFromData(h.LIVING_SITUATION_OTHER_CHECKBOX, true);
      cy.tabToContinueForm(h.POINT_OF_CONTACT_NAME_INPUT);

      // ** Other Housing Risk page
      h.verifyUrl(h.OTHER_HOUSING_RISK_PATH);
      cy.tabToElement(h.OTHER_HOUSING_RISK_INPUT);
      cy.realType('Testing content');
      tabToContinue();

      // ** Point of contact page
      h.verifyUrl(h.HOUSING_CONTACT_PATH);
      cy.tabToElement(h.POINT_OF_CONTACT_NAME_INPUT);
      cy.realType('Ted Mosby');
      cy.tabToElement(h.POINT_OF_CONTACT_PHONE_INPUT);
      cy.realType('2105550123');
      tabToContinue();

      // *** Contact info page
      h.verifyUrl(CONTACT_INFO_URL);
      tabToContinue();

      // *** Primary phone page
      h.verifyUrl(h.PRIMARY_PHONE_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for focus on header
      cy.tabToElement('[value="home"]');
      cy.chooseRadio('home'); // make sure we're choosing home (either is fine)
      tabToContinue();

      // *** Contestable issues page - select an existing issue
      h.verifyUrl(CONTESTABLE_ISSUES_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_contestedIssues_0"]'); // tinnitus
      cy.realPress('Space');

      // Add one issue
      cy.tabToElement('.add-new-issue');
      cy.realPress('Enter');
      h.verifyUrl(ADD_ISSUE_URL);

      const newIssue = data.additionalIssues[0];
      cy.tabToElement('[name="issue-name"]');
      cy.realType(newIssue.issue);

      // Simplified date because Cypress keyboard typing converts to key "codes"
      // and was confused by a double-digit number for the date
      const issueDate = ['2024', '1', '1'];
      cy.tabToElement('[name="decision-dateMonth"]');
      cy.realPress(issueDate[1]); // month
      cy.realPress('Tab');
      cy.realPress(issueDate[2]); // day
      cy.realPress('Tab');
      cy.realType(issueDate[0]); // year
      cy.tabToElement('button:not(.usa-button--outline)');
      cy.realPress('Enter');
      h.verifyUrl(CONTESTABLE_ISSUES_PATH);
      tabToContinue();

      // *** Issue summary page
      h.verifyUrl(h.ISSUES_SUMMARY_PATH);
      tabToContinue();

      // *** Opt-in page - seen when there are legacy or added issues
      h.verifyUrl(h.OPT_IN_PATH);
      tabToContinue();

      // *** Presumptive conditions page
      h.verifyUrl(h.NOTICE_5103_PATH);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('#checkbox-element'); // certify reviewed
      cy.realPress('Space');
      tabToContinue();

      // *** Facility types page
      h.verifyUrl(h.FACILITY_TYPES_PATH);
      cy.setCheckboxFromData(h.VA_EVIDENCE_CHECKBOX, true);
      cy.setCheckboxFromData(h.NON_VA_EVIDENCE_CHECKBOX, true);
      tabToContinue();

      // *** VA evidence request (y/n) question page
      h.verifyUrl(EVIDENCE_URLS.vaPromptSummary);
      cy.get('va-radio-option[value="Y"]').should('have.class', 'hydrated');
      cy.get('va-radio-option[value="Y"]')
        .find('input[type="radio"]')
        .click({ force: true });
      tabToContinue();

      // *** VA evidence location name page
      h.verifyUrl('supporting-evidence/0/va-medical-records-location');
      cy.get('va-text-input[name="root_vaTreatmentLocation"]')
        .shadow()
        .find('input')
        .focus()
        .type('Midwest Alabama VA Facility');
      tabToContinue();

      // *** VA evidence treatment before 2005 prompt page
      h.verifyUrl('supporting-evidence/0/va-medical-before-2005');
      cy.get('va-radio-option[value="Y"]').should('have.class', 'hydrated');
      cy.get('va-radio-option[value="Y"]')
        .find('input[type="radio"]')
        .click({ force: true });
      tabToContinue();

      // *** VA evidence treatment date page
      h.verifyUrl('supporting-evidence/0/va-medical-before-2005-date');
      h.selectShadowDropdownWithKeyboard(
        '.select-month',
        'root_treatmentMonthYearMonth',
        '3',
      );
      cy.tabToElement('.input-year')
        .shadow()
        .find('[name="root_treatmentMonthYearYear"]')
        .realType('2001');
      tabToContinue();

      // // *** VA evidence summary page
      h.verifyUrl(EVIDENCE_URLS.vaPromptSummary);
      cy.tabToElement('[name="root_hasVaEvidence"]').chooseRadio('N');
      tabToContinue();

      // // *** Private evidence request (y/n) question page
      h.verifyUrl(EVIDENCE_PRIVATE_PROMPT_URL);
      cy.get('va-radio-option[value="y"]').should('have.class', 'hydrated');
      cy.get('va-radio-option[value="y"]')
        .find('input[type="radio"]')
        .click({ force: true });
      tabToContinue();

      // *** Private evidence authorization page
      h.verifyUrl(EVIDENCE_PRIVATE_AUTHORIZATION_URL);
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

      // Limited consent
      cy.get('va-radio-option[value="Y"]').should('have.class', 'hydrated');
      cy.get('va-radio-option[value="Y"]')
        .find('input[type="radio"]')
        .click({ force: true });
      cy.get('[name="limited-consent-description')
        .shadow()
        .find('[name="limited-consent-description"]')
        .focus()
        .type('Some limited consent info');

      tabToContinue();

      // *** Private intro page
      tabToContinue();

      // *** Private evidence facility details page
      h.verifyUrl('supporting-evidence/0/private-medical-records-location');

      const facilityData = data.providerFacility[0];
      cy.tabToElement('[name="root_privateTreatmentLocation"]'); // provider or hospital
      cy.realType(facilityData.providerFacilityName);
      cy.realPress('Tab'); // skip country select
      h.selectShadowDropdownWithKeyboard(
        '[name="root_address_country"]',
        'root_address_country',
        'USA',
      );
      cy.realPress('Tab'); // street address
      cy.realType(facilityData.providerFacilityAddress.street);
      cy.realPress('Tab'); // skip street address line 2
      cy.realPress('Tab'); // city
      cy.realType(facilityData.providerFacilityAddress.city);
      cy.realPress('Tab'); // state select; but we type like normal
      cy.realType(facilityData.providerFacilityAddress.state);
      cy.realPress('Tab'); // postal code
      cy.realType(facilityData.providerFacilityAddress.postalCode);
      tabToContinue();

      // *** Private evidence issues page
      h.verifyUrl('supporting-evidence/0/private-medical-records-condition');
      cy.tabToElement('[name="root_issues_Headaches"]');
      cy.realPress('Space');
      tabToContinue();

      // *** Private evidence treatment dates page
      h.verifyUrl('supporting-evidence/0/private-medical-records-dates');
      cy.tabToElement('[name="root_treatmentStart"]');
      // cy.get('[name="root_treatmentStart"]')
      //   .shadow()
      //   .within(() => {
      //     cy.find('memorable-date-input')
      //       .eq(0)
      //       .shadow()
      //       .find('input')
      //       .realType('05');
      //   });
      // cy.fillVaMemorableDate('root_treatmentStart', '05-10-2020');

      // // Provider from date
      // const privateFromDate = facilityData.treatmentDateRange.from
      //   .split('-')
      //   .map(v => parseInt(v, 10).toString());
      // cy.tabToElement('[name="fromMonth"]');
      // cy.realType(privateFromDate[1]); // month
      // cy.realPress('Tab');
      // cy.realType(privateFromDate[2]); // day
      // cy.realPress('Tab');
      // cy.realType(privateFromDate[0]); // year

      // // Provider to date
      // const privateToDate = facilityData.treatmentDateRange.to
      //   .split('-')
      //   .map(v => parseInt(v, 10).toString());
      // cy.tabToElement('[name="toMonth"]');
      // cy.realType(privateToDate[1]); // month
      // cy.realPress('Tab');
      // cy.realType(privateToDate[2]); // day
      // cy.realPress('Tab');
      // cy.realType(privateToDate[0]); // year
      // tabToContinue();

      // // *** Upload evidence (y/n) - skipping since we can't test uploads
      // h.verifyUrl(EVIDENCE_ADDITIONAL_URL);
      // cy.tabToElement(h.ADDTL_EVIDENCE_RADIO); // No radio
      // cy.chooseRadio('N');
      // tabToContinue();

      // // *** Evidence summary
      // h.verifyUrl(h.EVIDENCE_SUMMARY_PATH);
      // tabToContinue();

      // // *** MST page
      // h.verifyUrl(h.MST_PATH);
      // cy.tabToElement(h.MST_RADIO); // No radio
      // cy.chooseRadio('Y');
      // tabToContinue();

      // // *** Add indicator page
      // h.verifyUrl(h.MST_OPTION_PATH);
      // cy.tabToElement(h.MST_OPTION_RADIO);
      // cy.chooseRadio('yes');
      // tabToContinue();

      // // *** Review & submit page
      // cy.url().should('include', h.REVIEW_PATH);
      // cy.tabToElement('va-checkbox');
      // cy.get(':focus').then($el => {
      //   // privacy checkbox is already checked because privacyAgreementAccepted
      //   // is accidentally used by both 4142 and SC review & submit checkbox
      //   if (!$el[0].checked) {
      //     cy.realPress('Space');
      //   }
      // });
      // cy.tabToSubmitForm();

      // // *** Confirmation page
      // // Check confirmation page print button
      // cy.url().should('include', 'confirmation');
      // cy.get('va-button[text="Print this page"]').should('exist');
    });
  });
});
