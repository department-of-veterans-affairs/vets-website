import formConfig from '../config/form';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { CONTESTABLE_ISSUES_API, ITF_API } from '../constants/apis';
import { fetchItf } from './995.cypress.helpers';
import mockData from './fixtures/data/keyboard-test.json';

import { CONTACT_INFO_PATH } from '../../shared/constants';
import { fixDecisionDates } from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

describe('Supplemental Claim keyboard only navigation', () => {
  it('navigates through a maximal form', () => {
    cypressSetup();

    cy.wrap(mockData.data).as('testData');

    cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.intercept('GET', ITF_API, fetchItf());

    cy.get('@testData').then(data => {
      const { chapters } = formConfig;

      cy.intercept('GET', `${CONTESTABLE_ISSUES_API}/compensation`, {
        data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      });
      cy.visit(
        '/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995',
      );
      cy.injectAxeThenAxeCheck();

      // *** Subtask
      cy.url().should('include', '/start');
      cy.tabToElement('input[value="compensation"]');
      cy.realPress('Space');

      cy.tabToElement('button[type="button"]');
      cy.realPress('Enter');

      // *** Intro page
      // TODO: tabToStartForm Cypress function needs to be updated to only
      // target action links
      cy.tabToElement('.vads-c-action-link--green');
      cy.realPress('Enter');

      // *** Intent to file has been submitted
      cy.url().should('include', chapters.infoPages.pages.veteranInfo.path);
      cy.injectAxeThenAxeCheck();
      // Can continue on to the rest of the form
      cy.tabToElement('button'); // targets secondary button
      cy.realPress('Tab'); // tab to primary "continue" button
      cy.realPress('Enter');

      // *** Veteran details
      cy.url().should('include', chapters.infoPages.pages.veteranInfo.path);
      cy.tabToContinueForm();

      // *** Contact info
      cy.url().should('include', CONTACT_INFO_PATH);
      cy.tabToElement('button.usa-button-primary[id$="continueButton"]');
      cy.realPress('Space');

      // *** Primary phone radios
      cy.url().should(
        'include',
        chapters.infoPages.pages.choosePrimaryPhone.path,
      );
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for focus on header
      cy.tabToElement('[value="home"]');
      cy.chooseRadio('home'); // make sure we're choosing home (either is fine)
      cy.tabToContinueForm();

      // *** Issues for review (sorted by random decision date) - only selecting
      // one, or more complex code is needed to find if the next checkbox is
      // before or after the first
      cy.url().should('include', chapters.issues.pages.contestableIssues.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_contestedIssues_0"]'); // tinnitus
      cy.realPress('Space');

      // *** Adding one issue
      cy.tabToElement('a.add-new-issue');
      cy.realPress('Enter');
      cy.url().should('include', chapters.issues.pages.addIssue.path);

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

      // *** Back to issues page
      cy.url().should('include', chapters.issues.pages.contestableIssues.path);
      cy.tabToContinueForm();

      // *** Issue summary
      cy.url().should('include', chapters.issues.pages.issueSummary.path);
      cy.tabToContinueForm();

      // *** Opt-in - seen when there are legacy or added issues
      cy.url().should('include', chapters.issues.pages.optIn.path);
      cy.tabToContinueForm();

      // *** Presumptive conditions
      cy.url().should('include', chapters.evidence.pages.notice5103.path);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('#checkbox-element'); // certify reviewed
      cy.realPress('Space');
      cy.tabToSubmitForm();

      // *** VA evidence request (y/n) question
      cy.url().should(
        'include',
        chapters.evidence.pages.evidenceVaRecordsRequest.path,
      );
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('[name="root_view:hasVaEvidence"]'); // Yes radio
      cy.chooseRadio('Y'); // make sure we're choosing yes
      cy.tabToSubmitForm();

      // *** VA evidence location
      cy.url().should(
        'include',
        chapters.evidence.pages.evidenceVaRecords.path,
      );
      const locationData = data.locations[0];

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100); // wait for focus on header
      cy.tabToElement('[name="name"]'); // name of VA location
      cy.realType(locationData.locationAndName);
      cy.tabToElement('[name="issues"]'); // select first issue (ignore data)
      cy.realPress('Space');

      // VA from date
      // cy.typeInMemorableDate('from', vaFromDate);
      const vaFromDate = locationData.evidenceDates.from
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement('[name="fromMonth"]');
      cy.realPress(vaFromDate[1]); // month
      cy.realPress('Tab');
      cy.realPress(vaFromDate[2]); // day
      cy.realPress('Tab');
      cy.realType(vaFromDate[0]); // year

      // VA to date
      // cy.typeInMemorableDate('to', vaToDate);
      const vaToDate = locationData.evidenceDates.to
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement('[name="toMonth"]');
      cy.realPress(vaToDate[1]); // month
      cy.realPress('Tab');
      cy.realPress(vaToDate[2]); // day
      cy.realPress('Tab');
      cy.realType(vaToDate[0]); // year
      cy.tabToSubmitForm();

      // *** Private evidence request (y/n) question
      cy.url().should(
        'include',
        chapters.evidence.pages.evidencePrivateRecordsRequest.path,
      );
      cy.tabToElement('[name="private"]'); // Yes radio
      cy.chooseRadio('y'); // make sure we're choosing yes
      cy.tabToSubmitForm();

      // *** Private evidence authorization
      cy.url().should(
        'include',
        chapters.evidence.pages.evidencePrivateRecordsAuthorization.path,
      );
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.setCheckboxFromData('[name="privacy-agreement"]', true);
      cy.tabToSubmitForm();

      // *** Private evidence facility
      cy.url().should(
        'include',
        chapters.evidence.pages.evidencePrivateRecords.path,
      );
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

      // *** Provider limitations
      cy.url().should(
        'include',
        chapters.evidence.pages.evidencePrivateLimitation.path,
      );
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      cy.tabToElement('textarea');
      // Without this waitUntil, only the first letter is entered into the
      // textarea
      cy.waitUntil(() =>
        cy
          .realType(data.limitedConsent)
          .then(() =>
            cy.get(':focus').then($el => $el[0].value === data.limitedConsent),
          ),
      );
      cy.tabToSubmitForm();

      // *** Upload evidence (y/n) - skipping since we can't test uploads
      cy.url().should(
        'include',
        chapters.evidence.pages.evidenceWillUpload.path,
      );
      cy.tabToElement('[name="root_view:hasOtherEvidence"]'); // No radio
      cy.chooseRadio('N'); // make sure we're choosing no
      cy.tabToSubmitForm();

      // *** Evidence summary
      cy.url().should('include', chapters.evidence.pages.evidenceSummary.path);
      cy.tabToSubmitForm();

      // *** Review & submit page
      cy.url().should('include', 'review-and-submit');
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
