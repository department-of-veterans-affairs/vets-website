import MedicalRecordsSite from '../mr_site/MedicalRecordsSite';
import allergies from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';

describe('Medical Records View Allergies', () => {
  beforeEach(() => {
    const site = new MedicalRecordsSite();
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingAllergies: true,
    });

    // set up intercepts
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      // check the correct param was used
      expect(req.url).to.contain('use_oh_data_path=1');
      req.reply(allergies);
    }).as('allergiesList');
  });

  it('Visits Medical Records View Allergies List', () => {
    cy.visit('my-health/medical-records');

    // check for MY Va Health links
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="vitals-oh-landing-page-link"]').should('be.visible');

    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('be.visible')
      .click();

    cy.injectAxeThenAxeCheck();
    // // check the intercept that the correct param was used

    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

    // Select the one that says seafood
    cy.get('.no-print [data-testid="allergy-link-4-6Z8D6dAzABlkPZA"]')
      .should('be.visible')
      .click();

    // check the provider is listed
    cy.findByText('Recorded by').should('exist');
    cy.findByText('Dr. Marietta439 Schmeler639 MD').should('exist');

    // check the location is not listed
    cy.findByText('Location').should('not.exist');
  });
});
