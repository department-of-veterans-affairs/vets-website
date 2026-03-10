import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import prefilledForm from '../fixtures/mocks/prefilled-form.json';
import sip from '../fixtures/mocks/sip-put.json';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10278 keyboard only specs', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
    cy.intercept('PUT', '/v0/in_progress_forms/22-10278', sip);
    cy.intercept('GET', '/v0/in_progress_forms/22-10278', prefilledForm);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.login(user);
  });

  it('is navigable with only the keyboard', () => {
    // Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.get('h1').contains(formConfig.title);
    cy.tabToElement('a[href="#start"]');
    cy.realPress('Enter');

    // Personal Information Page (authenticated - prefilled from profile)
    cy.url().should('include', 'personal-information');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('.usa-button-primary');
    cy.realPress('Space');

    // Contact Information Page
    cy.url().should('include', 'contact-information');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('.usa-button-primary');
    cy.realPress('Space');

    // Type of Third Party page
    cy.url().should(
      'include',
      formConfig.chapters.disclosureChapter.pages.discloseInformation.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Disclose your personal information to a third party');
    cy.selectVaRadioOption('root_discloseInformation_authorize', 'person');
    cy.tabToContinueForm();

    // Third Party Person Name page
    cy.url().should(
      'include',
      formConfig.chapters.thirdPartyContactInformation.pages
        .thirdPartyPersonName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Name of person');
    cy.tabToElement('[name="root_thirdPartyPersonName_fullName_first"]');
    cy.typeInFocused('Third');
    cy.tabToElement('[name="root_thirdPartyPersonName_fullName_last"]');
    cy.typeInFocused('Party');
    cy.tabToContinueForm();

    // Third Party Person Address page
    cy.url().should(
      'include',
      formConfig.chapters.thirdPartyContactInformation.pages
        .thirdPartyPersonAddress.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Address of person');
    cy.selectVaSelect('root_thirdPartyPersonAddress_address_country', 'USA');
    cy.tabToElement('[name="root_thirdPartyPersonAddress_address_street"]');
    cy.typeInFocused('1234 Test Ave');
    cy.repeatKey('Tab', 3);
    cy.typeInFocused('Anaheim');
    cy.repeatKey('Tab', 1);
    cy.selectVaSelect('root_thirdPartyPersonAddress_address_state', 'CA');
    cy.realPress('Tab');
    cy.typeInFocused('24680');
    cy.tabToContinueForm();

    // Information to Disclose page
    cy.url().should(
      'include',
      formConfig.chapters.informationToDiscloseChapter.pages
        .informationToDisclose.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Disclose personal information pertaining to your VA record');
    cy.tabToElement('va-checkbox');
    cy.realPress('Space');
    cy.tabToContinueForm();

    // Length of Release page
    cy.url().should(
      'include',
      formConfig.chapters.lengthOfReleaseChapter.pages.lengthOfRelease.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Length for the release of personal information');
    cy.selectVaRadioOption('root_lengthOfRelease_duration', 'ongoing');
    cy.tabToContinueForm();

    // Security Setup page
    cy.url().should(
      'include',
      formConfig.chapters.securitySetupChapter.pages.securitySetup.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Select a security setup option');
    cy.selectVaRadioOption('root_securityQuestion_question', 'pin');
    cy.tabToContinueForm();

    // Security Pin/Password page
    cy.url().should(
      'include',
      formConfig.chapters.securitySetupChapter.pages.securitySetupPinPassword
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Enter a pin or password');
    cy.tabToElement('[name="root_securityAnswerText"]');
    cy.typeInFocused('mypassword');
    cy.tabToContinueForm();

    // Review and Submit page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[id="inputField"]');
    cy.realType('John Doe');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.repeatKey('Tab', 3);
    cy.realPress('Space');

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
    cy.contains('Your submission is in progress');
  });
});
