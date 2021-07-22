import Timeouts from 'platform/testing/e2e/timeouts';
import testData from './schema/maximal-test.json';
import cemeteries from './fixtures/mocks/cemeteries.json';

describe('Pre-need test', () => {
  it('fills the form and navigates accordingly', () => {
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
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    cy.title().should(
      'contain',
      'Apply online for pre-need determination of eligibility in a VA National Cemetery | Veterans Affairs',
    );
    cy.get('.schemaform-title', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('.schemaform-start-button').click();

    cy.url().should('not.contain', '/introduction');

    cy.get('input[name="root_application_claimant_name_first"]', {
      timeout: Timeouts.normal,
    });
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(1)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.fillName(
      'root_application_claimant_name',
      testData.data.application.claimant.name,
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

    if (testData.data.application.claimant.relationshipToVet.type === 'other') {
      cy.get('input[name="root_application_claimant_relationship_other"]', {
        timeout: Timeouts.normal,
      });
      cy.fill(
        'input[name="root_application_claimant_relationship_other"]',
        testData.data.application.claimant.relationship.other,
      );
      cy.clickIf(
        '#root_application_claimant_relationship_view:isEntity',
        testData.data.application.claimant.relationship.isEntity,
      );
    }

    cy.injectAxeThenAxeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/applicant-information');

    cy.get('input[name="root_application_veteran_currentName_first"]', {
      timeout: Timeouts.normal,
    });
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(2)').should(
      'have.class',
      'progress-segment-complete',
    );

    cy.fillName(
      'root_application_veteran_currentName',
      testData.data.application.veteran.currentName,
    );
    cy.fill(
      'input[name="root_application_veteran_ssn"]',
      testData.data.application.veteran.ssn,
    );
    cy.fill(
      'input[name="root_application_veteran_militaryServiceNumber"]',
      testData.data.application.veteran.militaryServiceNumber,
    );
    cy.fillDate(
      'root_application_veteran_dateOfBirth',
      testData.data.application.veteran.dateOfBirth,
    );
    cy.fill(
      'input[name="root_application_veteran_placeOfBirth"]',
      testData.data.application.veteran.placeOfBirth,
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
    cy.get('root_application_veteran_militaryStatus').select(
      testData.data.application.veteran.militaryStatus,
    );
    cy.selectRadio(
      'root_application_veteran_isDeceased',
      testData.data.application.veteran.isDeceased,
    );
    cy.fillDate(
      'root_application_veteran_dateOfDeath',
      testData.data.application.veteran.dateOfDeath,
    );

    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/veteran-information');

    cy.get(
      'input[name="root_application_veteran_serviceRecords_0_serviceBranch"]',
      { timeout: Timeouts.verySlow },
    );
    testData.data.serviceRecords.forEach((tour, index) => {
      cy.fillDate(
        `root_application_veteran_serviceRecords_${index}_dateRange_from`,
        tour.dateRange.from,
      );
      cy.fillDate(
        `root_application_veteran_serviceRecords_${index}_dateRange_to`,
        tour.dateRange.to,
      );
      cy.click(
        `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
      );
      cy.fill(
        `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        'ALLIED FORCES',
      );
      // cy.sendKeys(
      //   `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
      //   client.Keys.DOWN_ARROW,
      // );
      // cy.sendKeys(
      //   `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
      //   client.Keys.ENTER,
      // );
      cy.fill(
        `input[name="root_application_veteran_serviceRecords_${index}_highestRank"]`,
        tour.highestRank,
      );
      cy.selectDropdown(
        `root_application_veteran_serviceRecords_${index}_dischargeType`,
        tour.dischargeType,
      );

      // Keep adding them until we're finished.
      if (index < testData.data.serviceRecords.length - 1) {
        cy.get('.usa-button-secondary.va-growable-add-btn').click();
      }
    });
  });
});
