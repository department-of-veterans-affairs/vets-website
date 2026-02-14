import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import prefilledForm from '../fixtures/mocks/prefilled-form.json';
import sip from '../fixtures/mocks/sip-put.json';
import formConfig, { SUBMIT_URL } from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0803 keyboard only specs', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    cy.login(user);
    cy.intercept('PUT', '/v0/in_progress_forms/22-0803', sip);
    cy.intercept('GET', '/v0/in_progress_forms/22-0803', prefilledForm);
    cy.intercept('POST', SUBMIT_URL, mockSubmit);
  });

  it('it navigable with only the keyboard', () => {
    // Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.get('h1').contains(formConfig.title);
    cy.repeatKey('Tab', 5);
    cy.realPress(['Enter']);

    // Previously Applied Page
    cy.url().should(
      'include',
      formConfig.chapters.benefitsInformationChapter.pages.previouslyApplied
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Your VA education benefits');
    cy.selectVaRadioOption('root_hasPreviouslyApplied', 'Y');
    cy.tabToContinueForm();

    // Select VA Benefit page
    cy.url().should(
      'include',
      formConfig.chapters.benefitsInformationChapter.pages.selectVABenefit.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Select a VA benefit program');
    cy.selectVaRadioOption('root_vaBenefitProgram', 'chapter33');
    cy.tabToContinueForm();

    // Personal Information Page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformationChapter.pages.personalInfoPage
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Personal information');
    cy.contains('MITCHELL G JENKINS');
    cy.contains('1863');
    cy.repeatKey('Tab', 6);
    cy.realPress('Space');

    // Contact Info Page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformationChapter.pages.confirmContactInfo
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Mailing address');
    cy.contains('123 Mailing Address St');
    cy.contains('Home phone number');
    cy.contains('Mobile phone number');
    cy.contains('Email address');
    cy.repeatKey('Tab', 7);
    cy.realPress('Space');

    // Test name and date page
    cy.url().should(
      'include',
      formConfig.chapters.testInformationChapter.pages.testNameAndDate.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Test name and date taken');
    cy.tabToElement('[name="root_testName"]');
    cy.typeInFocused('Fake Test');
    cy.fillVaMemorableDate('root_testDate', '2020-01-02', false);
    cy.tabToContinueForm();

    // Organization name and address page
    cy.url().should(
      'include',
      formConfig.chapters.testInformationChapter.pages.organizationInfo.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains(
      'Name and address of organization issuing the license or certification',
    );
    cy.tabToElement('[name="root_organizationName"]');
    cy.typeInFocused('Fake Org');
    cy.tabToElement('[name="root_organizationAddress_street"]');
    cy.typeInFocused('123 Miller Ln');
    cy.repeatKey('Tab', 3);
    cy.typeInFocused('Chicago');
    cy.repeatKey('Tab', 1);
    cy.selectVaSelect('root_organizationAddress_state', 'IL');
    cy.realPress('Tab');
    cy.typeInFocused('54321');
    cy.tabToContinueForm();

    // Test cost page
    cy.url().should(
      'include',
      formConfig.chapters.testInformationChapter.pages.testCost.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Test cost');
    cy.tabToElement('[name="root_testCost"]');
    cy.typeInFocused('123.45');
    cy.tabToContinueForm();

    // Remarks page
    cy.url().should(
      'include',
      formConfig.chapters.remarksChapter.pages.remarksPage.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Enter any remarks you would like to share');
    cy.tabToContinueForm();

    // Submission instructions page
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.contains('This form does not submit automatically');
    cy.contains('download your completed VA Form 22-0803');
    cy.tabToContinueForm();

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[id="inputField"]');
    cy.realType('MITCHELL G JENKINS');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.repeatKey('Tab', 3);
    cy.realPress('Space');

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
    cy.contains('Download and save your form');
    cy.contains('Gather relevant attachments');
    cy.contains(
      'Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office',
    );
  });
});
