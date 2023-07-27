import Timeouts from 'platform/testing/e2e/timeouts';
import testData from './schema/minimal-test.json';
import cemeteries from './fixtures/mocks/cemeteries.json';

const applicantInfoErrors = [
  '#root_application_claimant_name_first-error-message',
  '#root_application_claimant_name_last-error-message',
  '#root_application_claimant_ssn-error-message',
  '#root_application_claimant_dateOfBirth-error-message',
  '#root_application_claimant_relationshipToVet-error-message',
];

describe('Pre-need form VA 40-10007 Required Fields', () => {
  it('fills the form triggering validation on required fields', () => {
    cy.intercept('POST', '/v0/preneeds/burial_forms', {
      data: {
        attributes: {
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16',
        },
      },
    });
    cy.intercept('POST', '/v0/preneeds/preneed_attachments', {
      data: {
        attributes: {
          attachmentId: '1',
          name: 'VA40-10007.pdf',
          confirmationCode: 'e2128ec4-b2fc-429c-bad2-e4b564a80d20',
        },
      },
    });
    cy.intercept('GET', '/v0/preneeds/cemeteries', cemeteries);

    cy.visit(
      '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility',
    );
    cy.get('body').should('be.visible');
    cy.title().should(
      'contain',
      'Apply online for pre-need determination of eligibility in a VA National Cemetery | Veterans Affairs',
    );
    cy.get('.schemaform-title', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('.schemaform-start-button')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');

    cy.get('input[name="root_application_claimant_name_first"]');

    // Applicant Information
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(1)')
      .should('have.class', 'progress-segment-complete');

    cy.get('.form-panel .usa-button-primary').click();

    applicantInfoErrors.map(id => cy.get(id).should('be.visible'));

    cy.fill(
      'input[name=root_application_claimant_name_first]',
      testData.data.application.claimant.name.first,
    );
    cy.fill(
      'input[name=root_application_claimant_name_last]',
      testData.data.application.claimant.name.last,
    );
    cy.fill(
      'input[name="root_application_claimant_ssn"]',
      testData.data.application.claimant.ssn,
    );
    cy.fillDate(
      'root_application_claimant_dateOfBirth',
      testData.data.application.claimant.dateOfBirth,
    );
    cy.selectRadio(
      'root_application_claimant_relationshipToVet',
      testData.data.application.claimant.relationshipToVet,
    );

    cy.injectAxeThenAxeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/applicant-information');

    // Veteran Information
    cy.get('input[name="root_application_veteran_currentName_first"]');
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(2)')
      .should('have.class', 'progress-segment-complete');

    cy.fill(
      'input[name=root_application_veteran_currentName_first]',
      testData.data.application.veteran.currentName.first,
    );
    cy.fill(
      'input[name=root_application_veteran_currentName_last]',
      testData.data.application.veteran.currentName.last,
    );
    cy.fill(
      'input[name="root_application_veteran_ssn"]',
      testData.data.application.veteran.ssn,
    );
    cy.get(
      'input[name="root_application_veteran_race_isSpanishHispanicLatino"]',
    ).click();
    cy.selectRadio(
      'root_application_veteran_gender',
      testData.data.application.veteran.gender,
    );
    cy.selectRadio(
      'root_application_veteran_maritalStatus',
      testData.data.application.veteran.maritalStatus,
    );
    cy.get('#root_application_veteran_militaryStatus').select(
      testData.data.application.veteran.militaryStatus,
    );
    cy.selectRadio(
      'root_application_veteran_isDeceased',
      testData.data.application.veteran.isDeceased,
    );

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/veteran-information');

    // Military History

    cy.get(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
    ).click();
    cy.fill(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
      testData.data.application.veteran.serviceRecords.serviceBranch,
    );
    cy.get(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
    ).trigger('keydown', { keyCode: 40 });
    cy.get(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
    ).trigger('keyup', { keyCode: 40 });
    cy.get(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
    ).trigger('keydown', { keyCode: 13 });
    cy.get(
      `input[name="root_application_veteran_serviceRecords_0_serviceBranch"]`,
    ).trigger('keyup', { keyCode: 13 });

    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(3)')
      .should('have.class', 'progress-segment-complete');

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/sponsor-military-history');

    // Previous Names page
    cy.get('label[for$="hasServiceNameYes"]').should('be.visible');
    cy.selectRadio('root_application_veteran_view:hasServiceName', 'Y');
    cy.fill(
      'input[name=root_application_veteran_serviceName_first]',
      testData.data.application.veteran.serviceName.first,
    );
    cy.fill(
      'input[name=root_application_veteran_serviceName_last]',
      testData.data.application.veteran.serviceName.last,
    );

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/sponsor-military-name');

    // Benefit Selection page
    cy.selectRadio(
      'root_application_hasCurrentlyBuried',
      testData.data.application.hasCurrentlyBuried,
    );
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.fill(
      'input[name=root_application_currentlyBuriedPersons_0_name_first]',
      testData.data.application.currentlyBuriedPersons.name.first,
    );
    cy.fill(
      'input[name=root_application_currentlyBuriedPersons_0_name_last]',
      testData.data.application.currentlyBuriedPersons.name.last,
    );
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/burial-benefits');

    // Supporting Documents page
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Claimant Contact Information page
    cy.get('select[name="root_application_claimant_address_country"]');
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(6)')
      .should('have.class', 'progress-segment-complete');
    cy.fillAddress(
      'root_application_claimant_address',
      testData.data.application.claimant.address,
    );
    cy.fill('input[name$="email"]', testData.data.application.claimant.email);
    cy.fill(
      'input[name$="phoneNumber"]',
      testData.data.application.claimant.phoneNumber,
    );
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/applicant-contact-information');

    // Veteran Contact Information page
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/sponsor-mailing-address');

    cy.get(
      'label[for="root_application_applicant_applicantRelationshipToClaimant_1"]',
    );
    cy.get('va-segmented-progress-bar')
      .shadow()
      .find('.progress-bar-segmented div.progress-segment:nth-child(6)')
      .should('have.class', 'progress-segment-complete');
    cy.selectRadio(
      'root_application_applicant_applicantRelationshipToClaimant',
      testData.data.application.applicant.applicantRelationshipToClaimant,
    );
    if (
      testData.data.application.applicant.applicantRelationshipToClaimant ===
      'Authorized Agent/Rep'
    ) {
      cy.fillName(
        'root_application_applicant_view:applicantInfo_name',
        testData.data.application.applicant['view:applicantInfo'].name,
      );
      cy.fillAddress(
        'root_application_applicant_view\\:applicantInfo_mailingAddress',
        testData.data.application.applicant['view:applicantInfo']
          .mailingAddress,
      );
      cy.fill(
        'input[name$="applicantPhoneNumber"]',
        testData.data.application.applicant['view:applicantInfo'][
          'view:contactInfo'
        ].applicantPhoneNumber,
      );

      cy.axeCheck();
      cy.get('.form-panel .usa-button-primary').click();
      cy.url().should('not.contain', '/preparer');

      cy.get('[name="privacyAgreementAccepted"]')
        .find('label[for="checkbox-element"]')
        .should('be.visible');

      cy.get('[name="privacyAgreementAccepted"]')
        .find('[type="checkbox"]')
        .check({
          force: true,
        });

      cy.axeCheck();
      cy.get('.form-progress-buttons .usa-button-primary').click();
      cy.url().should('not.contain', '/review-and-submit');

      cy.get('.js-test-location', { timeout: Timeouts.slow })
        .invoke('attr', 'data-location')
        .should('not.contain', '/review-and-submit');

      cy.get('.confirmation-page-title');
      cy.axeCheck();
    }
  });
});
