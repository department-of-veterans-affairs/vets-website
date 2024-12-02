import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import allergies from '../../fixtures/allergies/sample-lighthouse.json';

describe('Medical Records View Vitals -- Accelerated Disabled', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: false,
      isAcceleratingAllergies: false,
    });

    // set up intercepts
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply({
        retrievedDate: 1732224967218,
        lastRefreshDate: null,
        facilityExtractStatusList: [
          {
            extract: 'Allergy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ImagingStudy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'VPR',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ChemistryHematology',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
        ],
      });
    });
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      // check the correct param was used
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergies);
    }).as('allergies-list');
  });

  it('Visits View Vitals List', () => {
    cy.visit('my-health/medical-records');

    // check for MY Va Health links
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="notes-landing-page-link"]').should('be.visible');
    cy.get('[data-testid="vaccines-landing-page-link"]').should('be.visible');
    cy.get('[data-testid="conditions-landing-page-link"]').should('be.visible');

    cy.get('[data-testid="allergies-landing-page-link"]').should('be.visible');

    cy.get('[data-testid="vitals-landing-page-link"]').should('be.visible');

    // Axe check
    cy.injectAxeThenAxeCheck();
  });
});
