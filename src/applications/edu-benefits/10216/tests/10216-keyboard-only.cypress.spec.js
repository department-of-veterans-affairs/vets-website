import manifest from '../manifest.json';

import formConfig from '../config/form';
import testData from './fixtures/data/test-data.json';
import { SUBMIT_URL } from '../config/constants';

describe('22-10216 Edu form', () => {
  beforeEach(function beforeEachHook() {
    if (Cypress.env('CI')) this.skip();
  });
  function getDateDetails(date) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = date?.getDate();
    const monthIndex = date?.getMonth();
    const monthName = monthNames[monthIndex];
    const year = date?.getFullYear();
    return {
      day,
      month: monthName,
      year,
    };
  }

  const date = new Date();
  const details = getDateDetails(date);
  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });

    cy.intercept('POST', SUBMIT_URL, testData);

    // Go to application, should go to Introduction page
    cy.visit(`${manifest.rootUrl}/introduction`);

    // Tab to and press 'Start your 35% exemption request' to start form
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 4);
    cy.realPress('Space');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Education Liaison Representative');
    cy.tabToElement('[class="schemaform-start-button"]');
    cy.realPress('Enter');

    // // Institution details page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.certifyingOfficial
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_certifyingOfficial_first"]');
    cy.typeInFocused('John');
    cy.tabToElement('input[name="root_certifyingOfficial_last"]');
    cy.typeInFocused('Doe');
    cy.tabToElement('input[name="root_certifyingOfficial_title"]');
    cy.typeInFocused('Director');
    cy.tabToContinueForm();

    // cy.typeInFocused(
    //   'DEPARTMENT OF VETERANS AFFAIRS-OFFICE OF INFORMATION AND TECHNOLOGY',
    // );
    cy.tabToElement('input[name="root_institutionDetails_facilityCode"]');
    cy.typeInFocused('10B35423');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.tabToElement(
      'select[name="root_institutionDetails_termStartDateMonth"]',
    );
    // cy.chooseSelectOptionByTyping('April');
    cy.realType(`${details.month}`);
    cy.tabToElement('input[name="root_institutionDetails_termStartDateDay"]');
    cy.realType(`${details.day}`);
    cy.tabToElement('input[name="root_institutionDetails_termStartDateYear"]');
    cy.realType(`${details.year}`);
    cy.tabToContinueForm();

    // Continue past accredited warning
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.additionalErrorChapter
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Student ratio calculation page
    cy.url().should(
      'include',
      formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc.path,
    );
    cy.injectAxeThenAxeCheck();

    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_beneficiaryStudent"]',
    );
    cy.typeInFocused(25);
    cy.tabToElement('input[name="root_studentRatioCalcChapter_numOfStudent"]');
    cy.typeInFocused(100);

    cy.tabToElement(
      'select[name="root_studentRatioCalcChapter_dateOfCalculationMonth"]',
    );
    // cy.chooseSelectOptionByTyping('April');
    cy.realType(`${details.month}`);
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationDay"]',
    );
    cy.realType(`${details.day}`);
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationYear"]',
    );
    cy.realType(`${details.year}`);
    cy.tabToContinueForm();

    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // // Review and sumbit page

    cy.url().should('include', 'review-and-submit');
    cy.get('[id="inputField"]').type('John Doe');
    cy.get('[id="checkbox-element"]').check({ force: true });
    cy.injectAxeThenAxeCheck();
    // Certification Statement
    cy.tabToElement('input[name="veteran-signature"]');
    cy.realType('John Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.realPress('Space');
    cy.tabToSubmitForm();
    // Confirmation page
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/confirmation',
    );
    cy.injectAxeThenAxeCheck();
    // Go back to review page and check that "Continue" button is present to allow re-submission
    cy.get('va-link[text="Back"]').click();
    cy.location('pathname').should('include', '/review-and-submit');
    cy.tabToElement('.usa-button-primary').click();
    cy.location('pathname').should('include', '/confirmation');
  });
});
