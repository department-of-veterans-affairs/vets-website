import manifest from '../manifest.json';
// import maximalData from '../fixtures/data/maximal.json';
import formConfig from '../config/form';

describe('22-10216 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    // Go to application, should go to about page
    cy.visit(`${manifest.rootUrl}`);
    cy.injectAxeThenAxeCheck();
    // // Tab to and press 'Go to the online tool' to go to the introduction page

    cy.tabToElement('[text="Go to the online tool"]');
    cy.realPress('Enter');

    // Tab to and press 'Start your 35% exemption request' to start form

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
    cy.typeInFocused('AVEDA INSTITUTE MARYLAND');
    cy.tabToElement('input[name="root_institutionDetails_facilityCode"]');
    cy.typeInFocused(25007120);
    cy.tabToElement(
      'select[name="root_institutionDetails_termStartDateMonth"]',
    );
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_institutionDetails_termStartDateDay"]');
    cy.realType('1');
    cy.tabToElement('input[name="root_institutionDetails_termStartDateYear"]');
    cy.realType('1990');
    cy.tabToContinueForm();

    // Continue past accredited warning
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
    cy.realType('December');
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationDay"]',
    );
    cy.realType('18');
    cy.tabToElement(
      'input[name="root_studentRatioCalcChapter_dateOfCalculationYear"]',
    );
    cy.realType('2000');
    cy.tabToContinueForm();

    cy.tabToContinueForm();

    // // Review and sumbit page

    cy.url().should('include', 'review-and-submit');
    cy.tabToSubmitForm();

    // // Confirmation page
    cy.location('pathname').should('include', '/confirmation');
  });
});
