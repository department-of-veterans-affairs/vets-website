import manifest from '../manifest.json';
// import maximalData from '../fixtures/data/maximal.json';
import formConfig from '../config/form';

describe('22-10215 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    // Go to application, should go to intro page
    cy.visit(`${manifest.rootUrl}`);
    cy.injectAxeThenAxeCheck();
    // Tab to and press 'Start your application'

    // cy.tabToElement('[href="/education/apply-for-education-benefits/application/10215/institution-details"]');
    cy.repeatKey('Tab', 25);
    cy.realPress('Enter');

    // Institution details page
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
    cy.tabToElement(
      'select[name="root_institutionDetails_dateOfCalculationsMonth"]',
    );
    cy.realType('October');
    cy.tabToElement(
      'input[name="root_institutionDetails_dateOfCalculationsDay"]',
    );
    cy.realType('1');
    cy.tabToElement(
      'input[name="root_institutionDetails_dateOfCalculationsYear"]',
    );
    cy.realType('2000');

    cy.tabToContinueForm();

    // Prepare calculations page
    cy.url().should(
      'include',
      formConfig.chapters.programsChapter.pages.programsIntro.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Calculations page
    cy.url().should(
      'include',
      formConfig.chapters.programsChapter.pages.programsIntro.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_programName"]');
    cy.typeInFocused('EXAMPLE PROGRAM');
    cy.tabToElement('input[name="root_studentsEnrolled"]');
    cy.typeInFocused(100);
    cy.tabToElement('input[name="root_supportedStudents"]');
    cy.typeInFocused(50);
    cy.tabToElement('input[name="root_fte_supported"]');
    cy.typeInFocused(25);
    cy.tabToElement('input[name="root_fte_nonSupported"]');
    cy.typeInFocused(25);

    cy.tabToContinueForm();

    // Calculation summary page
    cy.url().should(
      'include',
      formConfig.chapters.programsChapter.pages.programsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_view:programsSummary"]');
    cy.chooseRadio('N');

    cy.tabToContinueForm();

    // Review and sumbit page

    cy.url().should('include', 'review-and-submit');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.location('pathname').should('include', '/confirmation');
  });
});
