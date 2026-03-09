/* eslint-disable cypress/unsafe-to-chain-command */
import formConfig from '../config/form';
import user from './fixtures/mocks/user.json';
import prefilledForm from './fixtures/mocks/prefilled-form.json';
import sip from './fixtures/mocks/sip-put.json';
import manifest from '../manifest.json';

describe('22-10272 EDU Form', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('should be keyboard-only navigable', () => {
    // Authenticated endpoints for login, prefill, andn sip
    cy.intercept('GET', '/v0/user', user);
    cy.intercept('GET', '/v0/in_progress_forms/22-10272', prefilledForm);
    cy.intercept('PUT', '/v0/in_progress_forms/22-10272', sip);
    cy.login(user);
    // Default endpoints to intercept
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
    // Submit endpoint
    cy.intercept('POST', '/v0/education_benefits_claims/10272', {});

    // Navigate to the Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Request licensing or certification test prep course fees reimbursement online',
    );
    // Tab to and press 'Start your request for reimbursement'
    cy.repeatKey('Tab', 6);
    cy.realPress(['Enter']);

    // Your education benefits information - Step 1 (has previously applied selected to visit benefits history page)
    cy.url().should(
      'include',
      formConfig.chapters.educationBenefitsChapter.pages.hasPreviouslyApplied
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your VA education benefits');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_hasPreviouslyAppliedYesinput',
        'input#root_hasPreviouslyAppliedNoinput',
      ],
      'ArrowDown',
    );
    // Set to 'Yes' to visit benefits history page
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Your VA education benefits history page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.educationBenefitsChapter.pages
        .educationBenefitsHistory.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your VA education benefits history');
    cy.clickFormBack();

    // Your education benefits information - Step 1 (has previously applied de-selected to visit eligibility warning page)
    cy.url().should(
      'include',
      formConfig.chapters.educationBenefitsChapter.pages.hasPreviouslyApplied
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your VA education benefits');
    cy.get('input#root_hasPreviouslyAppliedNoinput').focus();
    // Set to 'No' to visit eligibility warning page
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // You VA education benefits history eligibility warning page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.educationBenefitsChapter.pages
        .educationBenefitsEligibility.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your VA education benefits history');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Apply for VA education benefits using Form 22-1990',
    );
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Apply for VA education benefits as a dependent using Form 22-5490',
    );
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'Apply to use transferred education benefits using Form 22-1990e',
    );
    cy.realPress('Tab');
    cy.focused().should('contain.text', 'Exit request for reimbursement');
    cy.tabToContinueForm();

    // Your personal information - Step 2
    cy.url().should('include', 'personal-information');
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Confirm the personal information we have on file for you',
    );
    cy.repeatKey('Tab', 6);
    cy.realPress(['Enter']);

    // Your VA payee number page - Step 2
    cy.url().should(
      'include',
      formConfig.chapters.personalInformationChapter.pages.payeeNumber.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your VA payee number');
    cy.realPress('Tab');
    cy.get(':focus')
      .first()
      .type('M2', { delay: 250 });
    cy.tabToContinueForm();

    // Your personal information contact information page - Step 2
    cy.url().should('include', 'contact-information');
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Confirm the contact information we have on file for you',
    );
    cy.repeatKey('Tab', 7);
    cy.realPress(['Enter']);

    // Licensing and certification details test name page - Step 3
    cy.url().should(
      'include',
      formConfig.chapters.licensingAndCertificationChapter.pages.testName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      "Tell us about the licensing or certification test you're preparing for",
    );
    cy.realPress('Tab');
    cy.typeInFocused('Test Name');
    cy.tabToContinueForm();

    // Licensing and certification details org details page - Step 3
    cy.url().should(
      'include',
      formConfig.chapters.licensingAndCertificationChapter.pages
        .organizationInfo.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'The name and mailing address of organization awarding license or certification',
    );
    cy.realPress('Tab');
    cy.typeInFocused('Org Name');
    cy.realPress('Tab');
    cy.typeInFocused('Org Street');
    cy.realPress('Tab');
    cy.typeInFocused('Bldg 4');
    cy.realPress('Tab');
    cy.typeInFocused('Unit 8');
    cy.realPress('Tab');
    cy.typeInFocused('Org City');
    cy.selectVaSelect('root_organizationAddress_state', 'AL');
    cy.realPress('Tab');
    cy.typeInFocused('12345');
    cy.tabToContinueForm();

    // Prep course details test name page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.prepCourseChapter.pages.prepCourseName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'The name of the prep course');
    cy.realPress('Tab');
    cy.typeInFocused('Prep Course');
    cy.tabToContinueForm();

    // Prep course details org details page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.prepCourseChapter.pages.prepCourseAddress.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'The name and mailing address of the organization giving the prep course',
    );
    cy.realPress('Tab');
    cy.typeInFocused('Prep Org');
    cy.realPress('Tab');
    cy.typeInFocused('Prep Street');
    cy.repeatKey('Tab', 3);
    cy.typeInFocused('Prep City');
    cy.selectVaSelect('root_prepCourseOrganizationAddress_state', 'MI');
    cy.realPress('Tab');
    cy.typeInFocused('23456');
    cy.tabToContinueForm();

    // Prep course details online page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.prepCourseChapter.pages.prepCourseOnline.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', "How you'll take the prep course");
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_prepCourseTakenOnlineYesinput',
        'input#root_prepCourseTakenOnlineNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Prep course details period page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.prepCourseChapter.pages.prepCoursePeriod.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Provide the start and end dates of your prep course',
    );
    cy.realPress('Tab');
    cy.fillVaMemorableDate('root_prepCourseStartDate', '2025-08-01', false);
    cy.fillVaMemorableDate('root_prepCourseEndDate', '2026-01-01', false);
    cy.tabToContinueForm();

    // Prep course details cost page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.prepCourseChapter.pages.prepCourseCost.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Enter the cost of the prep course including any fees',
    );
    cy.realPress('Tab');
    cy.typeInFocused('250.75');
    cy.tabToContinueForm();

    // Remarks - Step 5
    cy.url().should(
      'include',
      formConfig.chapters.remarksChapter.pages.remarks.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Enter your remarks');
    cy.realPress('Tab');
    cy.typeInFocused('Here are some remarks');
    cy.tabToContinueForm();

    // Submission instructions - Step 6
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'How to submit your form');
    cy.tabToContinueForm();

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type('Rita Ann Jackson');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.focused().should('contain.text', 'Complete all submission steps');
  });
});
