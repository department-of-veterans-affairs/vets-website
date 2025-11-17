/* eslint-disable cypress/unsafe-to-chain-command */
import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

describe('22-10275 EDU Form', () => {
  const { data } = maximalData;
  const { authorizedOfficial } = data;
  const {
    principlesOfExcellencePointOfContact,
    schoolCertifyingOfficial,
  } = data.newCommitment;
  const { pointOfContact } = data.additionalLocations[0];

  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('should be keyboard-only navigable', () => {
    cy.intercept('GET', '/v0/gi/institutions/*', {
      data: {
        attributes: {
          name: "ST MARY'S COLLEGE OF MARYLAND",
          facilityCode: '11100520',
          type: 'PUBLIC',
          city: 'ST MARYS CITY',
          state: 'MD',
          zip: '20686',
          country: 'USA',
          address1: '18952 EAST FISHER ROAD',
          programTypes: ['IHL'],
        },
      },
    });

    cy.intercept('POST', '/v0/education_benefits_claims/10275', {});

    // Navigate to the Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Commit to the Principles of Excellence for educational institutions',
    );
    // Tab to and press 'Start your form without signing in'
    cy.repeatKey('Tab', 3);
    cy.realPress(['Enter']);

    // Agreement type page - Step 1
    cy.url().should(
      'include',
      formConfig.chapters.agreementTypeChapter.pages.agreementType.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Choose your agreement type');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_agreementTypenewCommitmentinput',
        'input#root_agreementTypewithdrawalinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(data.agreementType);
    cy.tabToContinueForm();

    // Institution details page - Step 2
    cy.url().should(
      'include',
      formConfig.chapters.newCommitmentChapter.pages
        .institutionDetailsFacilityNew.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Please enter your VA facility code');
    cy.realPress('Tab');
    cy.typeInFocused(data.institutionDetails.facilityCode);
    cy.tabToContinueForm();

    // Your information page - Step 3 (POC and SCO selected to skip pages 2 and 3)
    cy.url().should(
      'include',
      formConfig.chapters.associatedOfficialsChapter.pages.authorizedOfficialNew
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your information');
    cy.realPress('Tab');
    cy.typeInFocused(authorizedOfficial.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(authorizedOfficial.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(authorizedOfficial.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(authorizedOfficial.title);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_authorizedOfficial_view\\:phoneTypeusinput',
        'input#root_authorizedOfficial_view\\:phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(authorizedOfficial['view:phoneType']);
    cy.realPress('Tab');
    cy.typeInFocused(authorizedOfficial.usPhone);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(authorizedOfficial.email);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_authorizedOfficial_view\\:isPOCYesinput',
        'input#root_authorizedOfficial_view\\:isPOCNoinput',
      ],
      'ArrowDown',
    );
    // Set to 'Yes' to skip page 2
    cy.chooseRadio('Y');
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_authorizedOfficial_view\\:isSCOYesinput',
        'input#root_authorizedOfficial_view\\:isSCONoinput',
      ],
      'ArrowDown',
    );
    // Set to 'Yes' to skip page 3
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Additional location summary page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages
        .additionalLocationSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'You can add more locations to this agreement',
    );
    cy.clickFormBack();

    // Your information page - Step 3 (POC and SCO de-selected to visit all pages)
    cy.url().should(
      'include',
      formConfig.chapters.associatedOfficialsChapter.pages.authorizedOfficialNew
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Your information');
    cy.get('input#root_authorizedOfficial_view\\:isPOCYesinput').focus();
    // Set to 'No' to fill out page 2
    cy.chooseRadio('N');
    cy.realPress('Tab');
    // Set to 'No' to fill out page 3
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // Principles of Excellence point of contact page - Step 3 (SCO selected to skip page 3)
    cy.url().should(
      'include',
      formConfig.chapters.associatedOfficialsChapter.pages
        .principlesOfExcellenceNew.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Principles of Excellence point of contact',
    );
    cy.realPress('Tab');
    cy.typeInFocused(principlesOfExcellencePointOfContact.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(principlesOfExcellencePointOfContact.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(principlesOfExcellencePointOfContact.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(principlesOfExcellencePointOfContact.title);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_newCommitment_principlesOfExcellencePointOfContact_view\\:phoneTypeusinput',
        'input#root_newCommitment_principlesOfExcellencePointOfContact_view\\:phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(principlesOfExcellencePointOfContact['view:phoneType']);
    cy.realPress('Tab');
    cy.typeInFocused(principlesOfExcellencePointOfContact.usPhone);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(principlesOfExcellencePointOfContact.email);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_newCommitment_principlesOfExcellencePointOfContact_view\\:isSCOYesinput',
        'input#root_newCommitment_principlesOfExcellencePointOfContact_view\\:isSCONoinput',
      ],
      'ArrowDown',
    );
    // Set to 'Yes' to skip page 3
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Additional location summary page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages
        .additionalLocationSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'You can add more locations to this agreement',
    );
    cy.clickFormBack();

    // Your information page - Step 3 (POC and SCO de-selected to visit all pages)
    cy.url().should(
      'include',
      formConfig.chapters.principlesOfExcellenceCommitmentChapter.pages
        .poeCommitment.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Principles of Excellence point of contact',
    );
    cy.get(
      'input#root_newCommitment_principlesOfExcellencePointOfContact_view\\:isSCOYesinput',
    ).focus();
    // Set to 'No' to fill out page 3
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // School certifying official page - Step 3
    cy.url().should(
      'include',
      formConfig.chapters.associatedOfficialsChapter.pages
        .schoolCertifyingOfficialNew.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'School certifying official');
    cy.realPress('Tab');
    cy.typeInFocused(schoolCertifyingOfficial.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(schoolCertifyingOfficial.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(schoolCertifyingOfficial.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(schoolCertifyingOfficial.title);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_newCommitment_schoolCertifyingOfficial_view\\:phoneTypeusinput',
        'input#root_newCommitment_schoolCertifyingOfficial_view\\:phoneTypeintlinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(schoolCertifyingOfficial['view:phoneType']);
    cy.realPress('Tab');
    cy.typeInFocused(schoolCertifyingOfficial.usPhone);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(schoolCertifyingOfficial.email);
    cy.tabToContinueForm();

    // Additional location summary page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages
        .additionalLocationSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'You can add more locations to this agreement',
    );
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_addMoreLocationsYesinput',
        'input#root_addMoreLocationsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
    cy.tabToContinueForm();

    // Additional locations institution page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages.additionalLocation.path.replace(
        ':index',
        '0',
      ),
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      "Enter the VA facility code for the additional location you'd like to add",
    );
    cy.realPress('Tab');
    cy.typeInFocused(data.additionalLocations[0].facilityCode);
    cy.tabToContinueForm();

    // Additional locations previously entered point of contact page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages.pointOfContact.path.replace(
        ':index',
        '0',
      ),
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Use a previously entered point of contact',
    );
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#enteredPOCauthorizedOfficialinput',
        'input#enteredPOCscoinput',
        'input#enteredPOCpoeinput',
        'input#enteredPOCnoneinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('none');
    cy.tabToContinueForm();

    // Additional locations new point of contact page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages.pointOfContactForThisLocation.path.replace(
        ':index',
        '0',
      ),
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should(
      'contain.text',
      'Enter a point of contact for this location',
    );
    cy.realPress('Tab');
    cy.typeInFocused(pointOfContact.fullName.first);
    cy.realPress('Tab');
    cy.typeInFocused(pointOfContact.fullName.middle);
    cy.realPress('Tab');
    cy.typeInFocused(pointOfContact.fullName.last);
    cy.realPress('Tab');
    cy.typeInFocused(pointOfContact.email);
    cy.tabToContinueForm();

    // Additional locations new point of contact page - Step 4
    cy.url().should(
      'include',
      formConfig.chapters.additionalLocationsChapter.pages
        .additionalLocationSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Review your additional locations');
    cy.repeatKey('Tab', 3);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_addMoreLocationsYesinput',
        'input#root_addMoreLocationsNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('N');
    cy.tabToContinueForm();

    // The Principles of Excellence page - Step 5
    cy.url().should(
      'include',
      formConfig.chapters.principlesOfExcellenceCommitmentChapter.pages
        .poeCommitment.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'The Principles of Excellence');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToContinueForm();

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type(
        `${authorizedOfficial.fullName.first} ${
          authorizedOfficial.fullName.middle
        } ${authorizedOfficial.fullName.last}`,
      );
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.focused().should('contain.text', "You've submitted your new commitment");
  });
});
