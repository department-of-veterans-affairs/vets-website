import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../manifest.json';
import mockSubmission from './fixtures/mocks/mockSubmission.json';
import testData from './schema/maximal-test.json';

describe('Representative Entry Test', () => {
  before(function() {
    if (manifest.e2eTestsDisabled) this.skip();
  });
  it('fills the form and navigates accordingly', () => {
    cy.intercept('POST', '/v0/vso_appointments', mockSubmission);
    cy.login();

    cy.visit('/veteran-representative');
    cy.get('body').should('be.visible');
    cy.title().should('contain', 'Appoint VSO as representative');
    cy.get('.schemaform-title', { timeout: Timeouts.slow });
    cy.get('.usa-button-primary')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');

    cy.get('input[name="root_veteranFullName_first"]').should('be.visible');
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(1)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.fillName('root_veteranFullName', testData.data.veteranFullName);
    cy.fill('input[name="root_veteranSSN"]', testData.data.veteranSSN);
    cy.fill('input[name="root_vaFileNumber"]', testData.data.vaFileNumber);
    cy.fill(
      'input[name="root_insuranceNumber"]',
      testData.data.insuranceNumber,
    );
    cy.injectAxeThenAxeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/veteran-information');

    cy.get('input[name="root_claimantFullName_first"]').should('be.visible');
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(1)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.fillName('root_claimantFullName', testData.data.claimantFullName);
    cy.get('#root_relationship').select(testData.data.relationship);
    cy.get('#root_claimantAddress_country').select(
      testData.data.claimantAddress.country,
    );
    cy.fill(
      'input[name="root_claimantAddress_street"]',
      testData.data.claimantAddress.street,
    );
    cy.fill(
      'input[name="root_claimantAddress_street2"]',
      testData.data.claimantAddress.street2,
    );
    cy.fill(
      'input[name="root_claimantAddress_city"]',
      testData.data.claimantAddress.city,
    );
    cy.get('#root_claimantAddress_state').select(
      testData.data.claimantAddress.state,
    );
    cy.fill(
      'input[name="root_claimantAddress_postalCode"]',
      testData.data.claimantAddress.postalCode,
    );
    cy.fill('input[name="root_claimantEmail"]', testData.data.claimantEmail);
    cy.fill(
      'input[name="root_claimantDaytimePhone"]',
      testData.data.claimantDaytimePhone,
    );
    cy.fill(
      'input[name="root_claimantEveningPhone"]',
      testData.data.claimantEveningPhone,
    );
    cy.fillDate('root_appointmentDate', testData.data.appointmentDate);
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/claimant-information');

    cy.get('input[name="root_organizationName"]').should('be.visible');
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(2)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.fill(
      'input[name="root_organizationName"]',
      testData.data.organizationName,
    );
    cy.fill(
      'input[name="root_organizationEmail"]',
      testData.data.organizationEmail,
    );
    cy.fill(
      'input[name="root_organizationRepresentativeName"]',
      testData.data.organizationRepresentativeName,
    );
    cy.fill(
      'input[name="root_organizationRepresentativeTitle"]',
      testData.data.organizationRepresentativeTitle,
    );
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/veteran-service-organization');

    cy.get('h2').should(
      'contain',
      'Authorization for Representative’s Access to Records',
    );
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(3)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.get('input[type="checkbox"]').click();
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should(
      'not.contain',
      '/authorization-for-representative-access-to-records',
    );

    cy.get('h2').should('contain', 'Limitation of Consent');
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(4)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.get('input[type="checkbox"]').each(checkbox => {
      cy.wrap(checkbox).click();
    });
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/limitation-of-consent');

    cy.get('h2').should(
      'contain',
      'Authorization to Change Claimant’s Address',
    );
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(5)').should(
      'have.class',
      'progress-segment-complete',
    );
    cy.get('input[type="checkbox"]').click();
    cy.axeCheck();
    cy.get('.form-panel .usa-button-primary').click();
    cy.url().should('not.contain', '/authorization-to-change-claimant-address');

    cy.get('.usa-button-primary').should('be.visible');
    cy.get('.progress-bar-segmented div.progress-segment:nth-child(6)').should(
      'have.class',
      'progress-segment-complete',
    );

    cy.get('input[name="privacyAgreementAccepted"]').click();
    cy.get('.usa-button-primary').click();
    cy.url().should('not.contain', '/review-and-submit');

    cy.get('.confirmation-page-title');
    cy.axeCheck();
  });
});
