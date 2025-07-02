import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';

describe('22-8794 EDU Form', () => {
  const { designatingOfficial } = maximalData.data;

  beforeEach(function() {
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
    cy.visit('/school-administrators/update-certifying-officials');
    cy.injectAxeThenAxeCheck();
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
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.title);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_designatingOfficial_phoneTypeusinput',
        'input#root_designatingOfficial_phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(designatingOfficial.phoneType);
    cy.realPress('Tab');
    cy.typeInFocused(designatingOfficial.phoneNumber);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(designatingOfficial.emailAddress);
    cy.tabToContinueForm();

    // Institution details page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
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
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionDetailsFacility.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.institutionDetails.facilityCode);
    cy.tabToContinueForm();

    // Primary certifying official page
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.title);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_primaryOfficialDetails_phoneTypeusinput',
        'input#root_primaryOfficialDetails_phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.primaryOfficialDetails.phoneType);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.phoneNumber);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(maximalData.data.primaryOfficialDetails.emailAddress);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialTraining
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      "Go to this page to find out what's required",
    );
    cy.repeatKey('Tab', 4);
    cy.focused().should(
      'contain.text',
      'Get more information about covered institutions.',
    );
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.primaryOfficialChapter.pages
        .primaryOfficialBenefitStatus.path,
    );
    cy.injectAxeThenAxeCheck();
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
    cy.tabToContinueForm();

    // Additional certifying officials page
    cy.url().should(
      'include',
      formConfig.chapters.additionalOfficialChapter.pages
        .additionalOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    // Have to check radio buttons
    // cy.allyEvaluateRadioButtons(
    //   [
    //     'input#root:additionalOfficialSummaryYesinput',
    //     'input#root:additionalOfficialSummaryNoinput',
    //   ],
    //   'ArrowDown',
    // );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      `${
        formConfig.chapters.additionalOfficialChapter.pages
          .additionalOfficialSummary.path
      }/0`,
    );
    cy.injectAxeThenAxeCheck();
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
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_additionalOfficialDetails_phoneTypeusinput',
        'input#root_additionalOfficialDetails_phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.phoneType,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.phoneNumber,
    );
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialDetails.emailAddress,
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      `${
        formConfig.chapters.additionalOfficialChapter.pages
          .additionalOfficialSummary.path
      }-1/0`,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      "Go to this page to find out what's required",
    );
    cy.repeatKey('Tab', 4);
    cy.focused().should(
      'contain.text',
      'Get more information about covered institutions.',
    );
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.realPress('Space');
    cy.repeatKey(['Shift', 'Tab'], 4);
    cy.fillVaMemorableDate(
      'root_additionalOfficialTraining_trainingCompletionDate',
      maximalData.data['additional-certifying-official'][0]
        .additionalOfficialTraining.trainingCompletionDate,
      true,
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      `${
        formConfig.chapters.additionalOfficialChapter.pages
          .additionalOfficialSummary.path
      }-2/0`,
    );
    cy.injectAxeThenAxeCheck();
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
    cy.url().should(
      'include',
      formConfig.chapters.additionalOfficialChapter.pages
        .additionalOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
    // Have to check radio buttons
    // cy.allyEvaluateRadioButtons(
    //   [
    //     'input#root:additionalOfficialSummaryYesinput',
    //     'input#root:additionalOfficialSummaryNoinput',
    //   ],
    //   'ArrowDown',
    // );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Read-only certifying officials page
    cy.url().should(
      'include',
      formConfig.chapters.readOnlyCertifyingOfficialChapter.pages
        .readOnlyPrimaryOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    // Have to check radio buttons
    // cy.allyEvaluateRadioButtons(
    //   [
    //     'input#root:additionalOfficialSummaryYesinput',
    //     'input#root:additionalOfficialSummaryNoinput',
    //   ],
    //   'ArrowDown',
    // );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();
    cy.url().should('include', 'read-only-certifying-officials/0');
    cy.injectAxeThenAxeCheck();
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
    cy.url().should(
      'include',
      formConfig.chapters.readOnlyCertifyingOfficialChapter.pages
        .readOnlyPrimaryOfficialSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
    // Have to check radio buttons
    // cy.allyEvaluateRadioButtons(
    //   [
    //     'input#root:additionalOfficialSummaryYesinput',
    //     'input#root:additionalOfficialSummaryNoinput',
    //   ],
    //   'ArrowDown',
    // );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Remarks page
    cy.url().should(
      'include',
      formConfig.chapters.remarksChapter.pages.remarks.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.remarks);
    cy.tabToContinueForm();

    // Submission instructions page
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type(
        `${designatingOfficial.fullName.first} ${
          designatingOfficial.fullName.middle
        } ${designatingOfficial.fullName.last}`,
      );
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.url().should('include', '/confirmation');
  });
});
