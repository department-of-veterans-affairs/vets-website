import manifest from '../manifest.json';
import formConfig from '../config/form';

describe.skip('22-1919 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'form_1919_release',
            value: true,
          },
        ],
      },
    });
    cy.intercept('GET', '/v0/gi/institutions/*', {
      data: {
        attributes: {
          name: 'INSTITUTE OF TESTING',
          facilityCode: '10002000',
          type: 'FOR PROFIT',
          city: 'SAN FRANCISCO',
          state: 'CA',
          zip: '13579',
          country: 'USA',
          address1: '123 STREET WAY',
        },
      },
    });

    cy.intercept('GET', '/data/cms/vamc-ehr.json', {});

    cy.intercept('POST', '/v0/education_benefits_claims/1919', {
      attributes: {
        confirmationNumber: '123123123',
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
    cy.typeInFocused('10002000');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
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
    cy.tabToElement('input[name="root_affiliatedIndividuals_first"]');
    cy.typeInFocused('Jane');
    cy.tabToElement('input[name="root_affiliatedIndividuals_last"]');
    cy.typeInFocused('Doe');
    cy.tabToElement('input[name="root_affiliatedIndividuals_title"]');
    cy.typeInFocused('Administrator');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_affiliatedIndividuals_individualAssociationTypevaEmployeeinput',
        'input#root_affiliatedIndividuals_individualAssociationTypesaaEmployeeinput',
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
    cy.repeatKey('Tab', 2);
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
    cy.typeInFocused('123456789');
    cy.tabToContinueForm();

    // Conflict of interest enrollment period page
    cy.injectAxeThenAxeCheck();
    cy.realPress(['Tab', 'Space']);
    cy.tabToElement('select[name="root_enrollmentPeriodStartMonth"]');
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_enrollmentPeriodStartDay"]');
    cy.realType('01');
    cy.tabToElement('input[name="root_enrollmentPeriodStartYear"]');
    cy.realType('2020');
    cy.tabToElement('select[name="root_enrollmentPeriodEndMonth"]');
    // cy.chooseSelectOptionByTyping('April');
    cy.realType('April');
    cy.tabToElement('input[name="root_enrollmentPeriodEndDay"]');
    cy.realType('20');
    cy.tabToElement('input[name="root_enrollmentPeriodEndYear"]');
    cy.realType('2020');
    cy.tabToContinueForm();

    // Conflict of interest summary page
    cy.url().should(
      'include',
      formConfig.chapters.allProprietaryProfitChapter.pages
        .conflictOfInterestSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
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
    cy.tabToElement('va-link[text="privacy policy."]').click();
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
