/* eslint-disable cypress/unsafe-to-chain-command */
import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

describe('22-8794 EDU Form', () => {
  const { designatingOfficial } = maximalData.data;

  beforeEach(function () {
    if (Cypress.env('CI')) this.skip();
  });

  it('should be keyboard-only navigable', () => {
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

    // Navigate to the Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Update your institution’s list of certifying officials',
    );
    // Tab to and press 'Start your form without signing in'
    cy.repeatKey('Tab', 3);
    cy.realPress(['Enter']);

    // Designating official page
    cy.url().should(
      'include',
      formConfig.chapters.designatingOfficialChapter.pages.designatingOfficial
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your information');
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.title);
    cy.realPress('Tab');
    cy.repeatKey('Tab', 2);
    cy.focused().type('(703) 009-9081');
    cy.repeatKey('Tab', 1);
    cy.typeInFocused(designatingOfficial.emailAddress);
    cy.tabToContinueForm();

    // Institution details page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'VA facility code');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_institutionDetails_hasVaFacilityCodeYesinput',
        'input#root_institutionDetails_hasVaFacilityCodeNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Institution details page - Step 2 (already assigned facility code)
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionDetailsFacility.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Please enter your VA facility code');
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.institutionDetails.facilityCode);
    cy.tabToContinueForm();

    // Primary certifying official page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Tell us about your primary certifying official',
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.title);
    cy.repeatKey('Tab', 3);
    cy.focused().type('(703) 009-9081');
    cy.repeatKey('Tab', 1);
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.emailAddress);
    cy.tabToContinueForm();

    //   // Primary certifying official page - Step 2
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialTraining
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Section 305 training');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      "Go to this page to find out what's required",
    );
    cy.repeatKey('Tab', 4);
    cy.focused().should(
      'contain.text',
      'Get more information about covered institutions',
    );
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.setCheckboxFromData('input#checkbox-element', true);
    cy.tabToContinueForm();

    //   // Primary certifying official page - Step 3
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages
        .primaryOfficialBenefitStatus.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'VA benefit status');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_primaryOfficialBenefitStatus_hasVaEducationBenefitsYesinput',
        'input#root_primaryOfficialBenefitStatus_hasVaEducationBenefitsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.setCheckboxFromData('input#checkbox-element', true);
    cy.tabToContinueForm();

    //   // Additional certifying officials page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.additionalOfficialChapter.pages
        .additionalOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateRadioButtons(
      [
        'input[id="root_view:additionalOfficialSummaryYesinput"]',
        'input[id="root_view:additionalOfficialSummaryNoinput"]',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    //   // Additional certifying officials page - Step 2
    cy.url().should(
      'include',
      `${formConfig.chapters.additionalOfficialChapter.pages.additionalOfficialSummary.path}/0`,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Tell us about your certifying official',
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.fullName.first,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.fullName.middle,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.fullName.last,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.title,
    );
    cy.repeatKey('Tab', 3);
    cy.focused().type('(703) 009-9081');
    cy.repeatKey('Tab', 1);
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.emailAddress,
    );
    cy.tabToContinueForm();

    //   // Additional certifying officials page - Step 3
    cy.url().should(
      'include',
      `${formConfig.chapters.additionalOfficialChapter.pages.additionalOfficialSummary.path}-1/0`,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Section 305 training');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      "Go to this page to find out what's required",
    );
    cy.repeatKey('Tab', 4);
    cy.focused().should(
      'contain.text',
      'Get more information about covered institutions',
    );
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.setCheckboxFromData('input#checkbox-element', false);
    cy.repeatKey(['Shift', 'Tab'], 4);
    cy.fillVaMemorableDate(
      'root_additionalOfficialTraining_trainingCompletionDate',
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialTraining.trainingCompletionDate,
      true,
    );
    cy.tabToContinueForm();

    //   // Additional certifying officials page - Step 4
    cy.url().should(
      'include',
      `${formConfig.chapters.additionalOfficialChapter.pages.additionalOfficialSummary.path}-2/0`,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'VA benefit status');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_additionalOfficialBenefitStatus_hasVaEducationBenefitsYesinput',
        'input#root_additionalOfficialBenefitStatus_hasVaEducationBenefitsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Additional certifying officials page - Step 5 (summary)
    cy.url().should(
      'include',
      formConfig.chapters.additionalOfficialChapter.pages
        .additionalOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Review your additional certifying official',
    );
    cy.repeatKey('Tab', 3);
    cy.allyEvaluateRadioButtons(
      [
        'input[id="root_view:additionalOfficialSummaryYesinput"]',
        'input[id="root_view:additionalOfficialSummaryNoinput"]',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    //   //   // Read-only certifying officials page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.readOnlyCertifyingOfficialChapter.pages
        .readOnlyPrimaryOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateRadioButtons(
      [
        'input[id="root_hasReadOnlyCertifyingOfficialYesinput"]',
        'input[id="root_hasReadOnlyCertifyingOfficialNoinput"]',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    //   // Read-only certifying officials page - Step 2
    cy.url().should('include', 'read-only-certifying-officials/0');
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Tell us about your read-only school certifying official',
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data.readOnlyCertifyingOfficials[0].fullName.first,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data.readOnlyCertifyingOfficials[0].fullName.middle,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data.readOnlyCertifyingOfficials[0].fullName.last,
    );
    cy.tabToContinueForm();

    //   //   // Read-only certifying officials page - Step 3 (summary)
    cy.url().should(
      'include',
      formConfig.chapters.readOnlyCertifyingOfficialChapter.pages
        .readOnlyPrimaryOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Review your read-only certifying official',
    );
    cy.repeatKey('Tab', 3);
    cy.allyEvaluateRadioButtons(
      [
        'input[id="root_hasReadOnlyCertifyingOfficialYesinput"]',
        'input[id="root_hasReadOnlyCertifyingOfficialNoinput"]',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    //     // Remarks page
    cy.url().should(
      'include',
      formConfig.chapters.remarksChapter.pages.remarks.path,
    );
    cy.realPress('Tab');
    cy.tabToContinueForm();

    // Submission instructions page
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'How to submit your form');
    cy.tabToContinueForm();

    //   //   // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type('John William Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    //     // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.focused().should(
      'contain.text',
      'To submit your form, follow the steps below',
    );
  });
});
