/* eslint-disable cypress/unsafe-to-chain-command */
import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

describe('22-0839 EDU Form', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            // name: 'form_0839_release',
            // value: true,
          },
        ],
      },
    });
    cy.intercept('POST', '/v0/education_benefits_claims/0839', {
      attributes: {
        confirmationNumber: '123123123',
      },
    });

    // Navigate to the Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Submit a Yellow Ribbon Program agreement request',
    );
    // Tab to and press 'Start your form without signing in'
    cy.repeatKey('Tab', 3);
    cy.realPress(['Enter']);

    // Authorized official page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.personalInformationChapter.pages.authorizedOfficial
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Provide your contact information and official title',
    );
    cy.tabToElement('input[name="root_authorizedOfficial_fullName_first"]');
    cy.typeInFocused(maximalData.data.authorizedOfficial.fullName.first);
    cy.tabToElement('input[name="root_authorizedOfficial_fullName_last"]');
    cy.typeInFocused(maximalData.data.authorizedOfficial.fullName.last);
    cy.tabToElement('input[name="root_authorizedOfficial_title"]');
    cy.typeInFocused(maximalData.data.authorizedOfficial.title);
    cy.get('va-telephone-input')
      .shadow()
      .find('va-text-input')
      .shadow()
      .find('input')
      .clear()
      .type(maximalData.data.authorizedOfficial.phoneNumber, { force: true });
    cy.tabToContinueForm();

    // Agreement type page - Step 2
    cy.url().should(
      'include',
      formConfig.chapters.agreementTypeChapter.pages.agreementType.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Yellow Ribbon agreement type');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_agreementTypestartNewOpenEndedAgreementinput',
        'input#root_agreementTypemodifyExistingAgreementinput',
        'input#root_agreementTypewithdrawFromYellowRibbonPrograminput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.agreementType);
    cy.tabToContinueForm();

    // Acknowledgements page - Step 3
    cy.url().should(
      'include',
      formConfig.chapters.acknowledgementsChapter.pages.acknowledgements.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Initial each statement to acknowledge the Yellow Ribbon Program terms',
    );
    cy.tabToElement('input[name="root_statement1Initial"]');
    cy.typeInFocused('JD');
    cy.tabToElement('input[name="root_statement2Initial"]');
    cy.typeInFocused('JD');
    cy.tabToElement('input[name="root_statement3Initial"]');
    cy.typeInFocused('JD');
    cy.tabToElement('input[name="root_statement4Initial"]');
    cy.typeInFocused('JD');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.tabToContinueForm();

    // Institution Details page Facility code - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionDetailsFacility.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      `Please enter your institution's facility code`,
    );
    cy.tabToElement('input[name="root_institutionDetails_facilityCode"]');
    cy.typeInFocused(maximalData.data.institutionDetails[0].facilityCode);
    cy.tabToContinueForm();

    // Additional Locations Summary- Step 5
    cy.url().should(
      'include',
      formConfig.chapters.additionalInstitutionDetailsChapter.pages
        .additionalInstitutionDetailsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    // cy.focused().should('contain.text', '');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_hasAdditionalInstitutionDetailsYesinput',
        'input#root_hasAdditionalInstitutionDetailsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Additional locations Details - Step 5
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      `Enter the VA facility code for the additional location you'd like to add`,
    );
    cy.tabToElement('input[name="root_facilityCode"]');
    cy.typeInFocused(maximalData.data.institutionDetails[1].facilityCode);
    cy.tabToContinueForm();

    // Additional Locations Summary- Step 5
    cy.url().should(
      'include',
      formConfig.chapters.additionalInstitutionDetailsChapter.pages
        .additionalInstitutionDetailsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_hasAdditionalInstitutionDetailsYesinput',
        'input#root_hasAdditionalInstitutionDetailsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Yellow Ribbon program contribution page Intro- Step 6
    cy.url().should(
      'include',
      formConfig.chapters.yellowRibbonProgramRequestChapter.pages
        .yellowRibbonProgramRequestIntro.path,
    );

    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Tell us about your Yellow Ribbon Program contributions (U.S. schools)',
    );
    cy.tabToContinueForm();

    // Yellow Ribbon program contribution academic year - Step 6
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Yellow Ribbon program contribution details - Step 6
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_maximumStudentsOptionunlimitedinput',
        'input#root_maximumStudentsOptionspecificinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('unlimited');
    cy.tabToElement('input[name="root_degreeLevel"]');
    cy.typeInFocused(
      maximalData.data.yellowRibbonProgramAgreementRequest[0].degreeLevel,
    );
    cy.tabToElement('input[name="root_collegeOrProfessionalSchool"]');
    cy.typeInFocused(
      maximalData.data.yellowRibbonProgramAgreementRequest[0].degreeProgram,
    );
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_maximumContributionAmountunlimitedinput',
        'input#root_maximumContributionAmountspecificinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('unlimited');
    cy.tabToContinueForm();

    // Yellow Ribbon program contribution page summary- Step 6
    cy.url().should(
      'include',
      formConfig.chapters.yellowRibbonProgramRequestChapter.pages
        .yellowRibbonProgramRequestSummary.path,
    );

    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Review your Yellow Ribbon Program contributions (U.S. schools)',
    );
    cy.repeatKey('Tab', 3);
    // cy.allyEvaluateRadioButtons(
    //   [
    //     'input#root_view:yellowRibbonProgramRequestSummaryYesinput',
    //     'input#root_view:yellowRibbonProgramRequestSummaryNoinput',
    //   ],
    //   'ArrowDown',
    // );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Points of Contact - Step 7
    cy.url().should(
      'include',
      formConfig.chapters.pointsOfContactChapter.pages.pointsOfContanct.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      `Provide contact information for the school's financial representative or Yellow Ribbon Program point of contact and school certifying official`,
    );
    cy.tabToElement('input[name="root_pointsOfContact_fullName_first"]');
    cy.typeInFocused(maximalData.data.pointOfContact.fullName.first);
    cy.tabToElement('input[name="root_pointsOfContact_fullName_last"]');
    cy.typeInFocused(maximalData.data.pointOfContact.fullName.last);
    cy.get('va-telephone-input')
      .shadow()
      .find('va-text-input')
      .shadow()
      .find('input')
      .clear()
      .type(maximalData.data.pointOfContact.phoneNumber, { force: true });
    cy.tabToElement('input[name="root_pointsOfContact_email"]');
    cy.typeInFocused(maximalData.data.pointOfContact.emailAddress);
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);

    cy.setCheckboxFromData(
      'input[name="root_pointsOfContact_roles_isYellowRibbonProgramPointOfContact"]',
      true,
    );
    cy.tabToContinueForm();

    // Additional Point of Contact - Step 7
    cy.url().should(
      'include',
      formConfig.chapters.pointsOfContactChapter.pages.additionalPointsOfContact
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Add school certifying official');
    cy.tabToElement(
      'input[name="root_additionalPointsOfContact_fullName_first"]',
    );
    cy.typeInFocused(maximalData.data.pointOfContactTwo.fullName.first);
    cy.tabToElement(
      'input[name="root_additionalPointsOfContact_fullName_last"]',
    );
    cy.typeInFocused(maximalData.data.pointOfContactTwo.fullName.last);
    cy.get('va-telephone-input')
      .shadow()
      .find('va-text-input')
      .shadow()
      .find('input')
      .clear()
      .type(maximalData.data.pointOfContactTwo.phoneNumber, { force: true });
    cy.tabToElement('input[name="root_additionalPointsOfContact_email"]');
    cy.typeInFocused(maximalData.data.pointOfContactTwo.emailAddress);
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

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type('Jane Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });
});
