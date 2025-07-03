import manifest from '../manifest.json';
import formConfig from '../config/form';

describe('22-1919 Edu form', () => {
  beforeEach(function beforeEachHook() {
    if (Cypress.env('CI')) this.skip();
  });

  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });

    // Go to application, should go to Introduction page
    cy.visit(`${manifest.rootUrl}/introduction`);

    // Tab to and press 'Start your form without signing in' to go to the introduction page
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Conflicting interests certification for proprietary schools',
    );
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'search the SAA contact directory (opens in a new tab)',
    );
    cy.tabToElement('[class="schemaform-start-button"]');
    cy.realPress('Enter');

    // Certifying official details page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.certifyingOfficial
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your name and role');
    cy.tabToElement('input[name="root_certifyingOfficial_first"]');
    cy.typeInFocused('John');
    cy.tabToElement('input[name="root_certifyingOfficial_last"]');
    cy.typeInFocused('Doe');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_certifyingOfficial_role_levelcertifyingOfficialinput',
        'input#root_certifyingOfficial_role_levelownerinput',
        'input#root_certifyingOfficial_role_levelofficerinput',
        'input#root_certifyingOfficial_role_levelotherinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('certifyingOfficial');
    cy.tabToContinueForm();

    // About institution page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.aboutYourInstitution
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_aboutYourInstitutionYesinput',
        'input#root_aboutYourInstitutionNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Institution details page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_institutionDetails_facilityCode"]');
    cy.typeInFocused('25007120');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(600);
    cy.tabToContinueForm();

    // Proprietary profit classification page
    cy.url().should(
      'include',
      formConfig.chapters.proprietaryProfitChapter.pages.isProprietaryProfit
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space', 'Tab']);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_isProprietaryProfitYesinput',
        'input#root_isProprietaryProfitNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Affliated Individuals summary page
    cy.url().should(
      'include',
      formConfig.chapters.proprietaryProfitChapter.pages
        .affiliatedIndividualsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_isProfitConflictOfInterestYesinput',
        'input#root_isProfitConflictOfInterestNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Affliated Individuals association page
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space']);
    cy.tabToElement('input[name="root_first"]');
    cy.typeInFocused('Jane');
    cy.tabToElement('input[name="root_last"]');
    cy.typeInFocused('Doe');
    cy.tabToElement('input[name="root_title"]');
    cy.typeInFocused('Administrator');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_individualAssociationTypevaEmployeeinput',
        'input#root_individualAssociationTypesaaEmployeeinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('vaEmployee');
    cy.tabToContinueForm();

    // Affliated Individuals summary page
    cy.url().should(
      'include',
      formConfig.chapters.proprietaryProfitChapter.pages
        .affiliatedIndividualsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_isProfitConflictOfInterestYesinput',
        'input#root_isProfitConflictOfInterestNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Conflict of interest summary page
    cy.url().should(
      'include',
      formConfig.chapters.allProprietaryProfitChapter.pages
        .conflictOfInterestSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_allProprietaryConflictOfInterestYesinput',
        'input#root_allProprietaryConflictOfInterestNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Conflict of interest certifying official details page
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space']);
    cy.tabToElement('input[name="root_certifyingOfficial_first"]');
    cy.typeInFocused('Jacob');
    cy.tabToElement('input[name="root_certifyingOfficial_last"]');
    cy.typeInFocused('Doe');
    cy.tabToElement('input[name="root_certifyingOfficial_title"]');
    cy.typeInFocused('Principal');
    cy.tabToContinueForm();

    // Conflict of interest file number page
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space']);
    cy.tabToElement('input[name="root_fileNumber"]');
    cy.typeInFocused('1234567890');
    cy.tabToContinueForm();

    // Conflict of interest enrollment period page
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space']);
    cy.tabToElement('select[name="root_enrollmentPeriod_fromMonth"]');
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_enrollmentPeriod_fromDay"]');
    cy.realType('01');
    cy.tabToElement('input[name="root_enrollmentPeriod_fromYear"]');
    cy.realType('2020');
    cy.tabToElement('select[name="root_enrollmentPeriod_toMonth"]');
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_enrollmentPeriod_toDay"]');
    cy.realType('20');
    cy.tabToElement('input[name="root_enrollmentPeriod_toYear"]');
    cy.realType('2020');
    cy.tabToContinueForm();

    // Conflict of interest summary page
    cy.url().should(
      'include',
      formConfig.chapters.allProprietaryProfitChapter.pages
        .conflictOfInterestSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_allProprietaryConflictOfInterestYesinput',
        'input#root_allProprietaryConflictOfInterestNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Submission instructions

    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Review and sumbit page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('va-link[text="privacy policy"]').click();
    cy.realPress('Enter');
    // Certification Statement
    cy.tabToElement('input[name="veteran-signature"]');
    cy.realType('John Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();
    // Confirmation page
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/confirmation',
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'To submit your form, follow the steps below',
    );
    // Go back to review page and check that "Continue" button is present to allow re-submission
    cy.get('va-link[text="Back"]').click();
    cy.location('pathname').should('include', '/review-and-submit');
    cy.tabToElement('.usa-button-primary').click();
    cy.location('pathname').should('include', '/confirmation');
  });
});
