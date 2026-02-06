import mockSubmit from '../fixtures/mocks/application-submit.json';
import formConfig, { SUBMIT_URL } from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0976 keyboard only specs', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    cy.intercept('POST', SUBMIT_URL, mockSubmit);
  });

  it('it navigable with only the keyboard', () => {
    // Introduction Page
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.get('h1').contains(formConfig.title);
    cy.repeatKey('Tab', 3);
    cy.realPress(['Enter']);

    // Authorizing Official Page
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .authorizingOfficialName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains(
      'Please provide your institution’s authorizing official information',
    );
    cy.tabToElement('[name="root_authorizingOfficial_fullName_first"]');
    cy.typeInFocused('John');
    cy.tabToElement('[name="root_authorizingOfficial_fullName_last"]');
    cy.typeInFocused('Doe');
    cy.tabToContinueForm();

    // What to expect page
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .whatToExpect.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('What to expect');
    cy.tabToContinueForm();

    // Acknowledgement 1
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .acknowledgement1.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Institution Acknowledgements (1 of 5)');
    cy.tabToElement('[name="root_acknowledgement7"]');
    cy.typeInFocused('JD');
    cy.tabToContinueForm();

    // Acknowledgement 2
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .acknowledgement2.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Institution Acknowledgements (2 of 5)');
    cy.tabToElement('[name="root_acknowledgement8"]');
    cy.typeInFocused('JD');
    cy.tabToContinueForm();

    // Acknowledgement 3
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .acknowledgement3.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Institution Acknowledgements (3 of 5)');
    cy.tabToElement('[name="root_acknowledgement9"]');
    cy.typeInFocused('JD');
    cy.tabToContinueForm();

    // Acknowledgement 4
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .acknowledgement4.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Institution Acknowledgements (4 of 5)');
    cy.selectVaRadioOption('root_acknowledgement10a_financiallySound', 'Y');
    cy.tabToContinueForm();

    // Acknowledgement 5
    cy.url().should(
      'include',
      formConfig.chapters.authorizingOfficialAndAcknowledgements.pages
        .acknowledgement5.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_acknowledgement10b"]');
    cy.typeInFocused('JD');
    cy.tabToContinueForm();

    // Has facility code page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.hasVaFacilityCode.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Institution VA Facility Code');
    cy.selectVaRadioOption('root_hasVaFacilityCode', 'N');
    cy.tabToContinueForm();

    // Institution type
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.primaryInstitutionType.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.contains('Select a classification for this institution');
    cy.selectVaRadioOption('root_primaryInstitutionDetails_type', 'PUBLIC');
    cy.tabToContinueForm();

    // Institution name and address
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages
        .primaryInstitutionNameAndMailingAddress.path,
    );
    cy.contains('Enter institution name and mailing address');
    cy.tabToElement('[name="root_primaryInstitutionDetails_name"]');
    cy.typeInFocused('Fake Institution');
    cy.selectVaSelect(
      'root_primaryInstitutionDetails_mailingAddress_country',
      'USA',
    );
    cy.tabToElement(
      '[name="root_primaryInstitutionDetails_mailingAddress_street"]',
    );
    cy.typeInFocused('123 Miller Ln');
    cy.repeatKey('Tab', 3);
    cy.typeInFocused('Chicago');
    cy.repeatKey('Tab', 1);
    cy.selectVaSelect(
      'root_primaryInstitutionDetails_mailingAddress_state',
      'IL',
    );
    cy.realPress('Tab');
    cy.typeInFocused('54321');
    cy.tabToContinueForm();

    // Institution details review
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.primaryInstitutionReview
        .path,
    );
    cy.contains('Review your institution details');
    cy.contains('123 Miller Ln');
    cy.tabToContinueForm();

    // Additional locations
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages
        .additionalInstitutionsSummaryWithoutCode.path,
    );
    cy.contains(
      'You will need to list all additional locations associated with your institution.',
    );
    cy.selectVaRadioOption('root_view:hasAdditionalInstitutions', 'N');
    cy.tabToContinueForm();

    // Institution website
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.primaryInstitutionWebsite
        .path,
    );
    cy.contains('What is your institution’s web address?');
    cy.tabToElement('[name="root_website"]');
    cy.typeInFocused('http://example.com');
    cy.tabToContinueForm();

    // Application type
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.submissionReasons.path,
    );
    cy.contains('Application information');
    cy.repeatKey('Tab', 2);
    cy.realPress('Space');
    cy.tabToContinueForm();

    // IHL pafge
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.primaryInstitutionIHL.path,
    );
    cy.contains('Institution details');
    cy.selectVaRadioOption('root_institutionProfile_isIhl', 'Y');
    cy.tabToContinueForm();

    // Title 4pafge
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetails.pages.primaryInstitutionTitle4
        .path,
    );
    cy.contains('Institution details');
    cy.selectVaRadioOption(
      'root_institutionProfile_participatesInTitleIv',
      'Y',
    );
    cy.tabToContinueForm();

    // Program list-and-loop intro
    cy.url().should(
      'include',
      formConfig.chapters.programInformation.pages.programInformationIntro.path,
    );
    cy.contains('What you’ll need to have prepared for your program');
    cy.tabToContinueForm();

    // Program list-and-loop item
    cy.url().should(
      'include',
      '/program-information-details/0',
      formConfig.chapters.programInformation.pages.programInformationDetails
        .path,
    );
    cy.contains('Program information');
    cy.tabToElement('[name="root_programName"]');
    cy.typeInFocused('Test Program');
    cy.tabToElement('[name="root_totalProgramLength"]');
    cy.typeInFocused('1 semester');
    cy.tabToElement('[name="root_weeksPerTerm"]');
    cy.typeInFocused('16');
    cy.tabToElement('[name="root_entryRequirements"]');
    cy.typeInFocused('Bachelors');
    cy.tabToElement('[name="root_creditHours"]');
    cy.typeInFocused('16');
    cy.tabToContinueForm();

    // Program list-and-loop summary
    cy.url().should(
      'include',
      formConfig.chapters.programInformation.pages.programInformationIntro.path,
    );
    cy.contains('Review your programs');
    cy.contains('Test Program');
    cy.selectVaRadioOption('root_view:hasAdditionalPrograms', 'N');
    cy.tabToContinueForm();

    // Medical school
    cy.url().should(
      'include',
      formConfig.chapters.programInformation.pages.isMedicalSchool.path,
    );
    cy.contains('Medical School Information');
    cy.selectVaRadioOption('root_isMedicalSchool', 'N');
    cy.tabToContinueForm();

    // Contacts intro
    cy.url().should(
      'include',
      formConfig.chapters.institutionContacts.pages.contactsInstructions.path,
    );
    cy.contains('Provide Contacts for Your Institution');
    cy.tabToContinueForm();

    // Financial rep
    cy.url().should(
      'include',
      formConfig.chapters.institutionContacts.pages
        .institutionFinancialRepresentative.path,
    );
    cy.contains(
      'Please provide your institution’s financial representative information.',
    );
    cy.tabToElement('[name="root_financialRepresentative_fullName_first"]');
    cy.typeInFocused('Frank');
    cy.tabToElement('[name="root_financialRepresentative_fullName_last"]');
    cy.typeInFocused('Zappa');
    cy.tabToElement('[name="root_financialRepresentative_email"]');
    cy.typeInFocused('zappa@example.com');
    cy.tabToContinueForm();

    // Certifying official
    cy.url().should(
      'include',
      formConfig.chapters.institutionContacts.pages
        .institutionCertifyingOfficial.path,
    );
    cy.contains(
      'Please provide your institution’s Certifying Official information',
    );
    cy.tabToElement('[name="root_schoolCertifyingOfficial_fullName_first"]');
    cy.typeInFocused('Lizzy');
    cy.tabToElement('[name="root_schoolCertifyingOfficial_fullName_last"]');
    cy.typeInFocused('Zappa');
    cy.tabToElement('[name="root_schoolCertifyingOfficial_email"]');
    cy.typeInFocused('l_zappa@example.com');
    cy.tabToContinueForm();

    // Additional officials
    cy.url().should(
      'include',
      formConfig.chapters.institutionContacts.pages.officialsSummary.path,
    );
    cy.contains('Officials and faculty information');
    cy.selectVaRadioOption('root_view:hasAdditionalOfficials', 'N');
    cy.tabToContinueForm();

    // Submission instructions
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructions.pages.submissionInstructions
        .path,
    );
    cy.contains(
      'You’ll need to upload supporting documents regarding your institution’s financial health',
    );
    cy.tabToContinueForm();

    // Review page
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[id="inputField"]');
    cy.realType('John Doe');
    cy.realPress('Tab');
    cy.realPress('Space');
    cy.repeatKey('Tab', 2);
    cy.realPress('Space');

    // Confirmation page
    cy.url().should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
    cy.contains('You’ll need to download a copy of your completed form');
    cy.contains('Download a PDF of your completed form');
  });
});
