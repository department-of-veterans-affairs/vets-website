import manifest from '../manifest.json';
// import maximalData from '../fixtures/data/maximal.json';
import formConfig from '../config/form';

describe('22-10216 Edu form', () => {
  beforeEach(function beforeEachHook() {
    if (Cypress.env('CI')) this.skip();
  });
  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    cy.intercept('POST', '/v0/in_progress_forms/22-10216', {
      data: {
        id: '39',
        type: 'education_benefits_claim',
        attributes: {
          form:
            '{"studentRatioCalcChapter":{"beneficiaryStudent":2,"numOfStudent":3,"dateOfCalculation":"2020-01-06","VABeneficiaryStudentsPercentage":"66.7%"},"institutionDetails":{"institutionName":"test","facilityCode":"90987890","termStartDate":"2020-01-02"}}',
          regionalOffice:
            'VA Regional Office\nP.O. Box 4616\nBuffalo, NY 14240-4616',
          confirmationNumber: 'V-EBC-39',
        },
      },
    });
    // Go to application, should go to about page
    cy.visit(`${manifest.rootUrl}`);
    cy.injectAxeThenAxeCheck();
    // // Tab to and press 'Go to the online tool' to go to the introduction page

    cy.tabToElement('[text="Go to the online tool"]');
    cy.realPress('Enter');

    // Tab to and press 'Start your 35% exemption request' to start form

    cy.injectAxeThenAxeCheck();
    cy.tabToElement('va-accordion-item[header="VA education service help"]');
    cy.realPress('Space');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Education Liaison Representative');
    cy.tabToElement('[text="Start your 35% exemption request"]');
    cy.realPress('Enter');

    // // Institution details page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_institutionDetails_institutionName"]');
    cy.typeInFocused(
      'DEPARTMENT OF VETERANS AFFAIRS-OFFICE OF INFORMATION AND TECHNOLOGY',
    );
    cy.tabToElement('input[name="root_institutionDetails_facilityCode"]');
    cy.typeInFocused('10B35423');
    cy.tabToElement(
      'select[name="root_institutionDetails_termStartDateMonth"]',
    );
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_institutionDetails_termStartDateDay"]');
    cy.realType('1');
    cy.tabToElement('input[name="root_institutionDetails_termStartDateYear"]');
    cy.realType('2024');
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

    cy.tabToElement('va-additional-info');
    cy.realPress('Space');

    cy.tabToElement(
      'select[name="root_studentRatioCalcChapter_dateOfCalculationMonth"]',
    );
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationDay"]',
    );
    cy.realType('18');
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationYear"]',
    );
    cy.realType('2024');
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
    cy.injectAxeThenAxeCheck();
    cy.tabToSubmitForm();

    // // Confirmation page
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/confirmation',
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[data-testid="print-page"]');
    cy.realPress('Enter');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[text="Go to VA Form 22-10215 now"]');
    cy.realPress('Enter');
    cy.url().should(
      'include',
      '/education/apply-for-education-benefits/application/10215',
    );
  });
});
