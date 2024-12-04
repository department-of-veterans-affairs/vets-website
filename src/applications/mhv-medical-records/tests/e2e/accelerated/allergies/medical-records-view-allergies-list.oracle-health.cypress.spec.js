import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesData from '../../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import Allergies from '../pages/Allergies';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingAllergies: true,
    });
    cy.visit('my-health/medical-records');
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
      expect(req.url).to.contain('use_oh_data_path=1');
      req.reply(allergiesData);
    }).as('allergies-list');
  });

  it('Visits Medical Records View Allergies List', () => {
    // check for MY Va Health links
    Allergies.checkLandingPageLinks();

    Allergies.goToAllergiesPage();

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
