import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesData from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import Allergies from '../pages/Allergies';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    // Test Path 2: Oracle Health users with acceleration disabled
    // This verifies that Cerner patients get the v1 OH endpoint with use_oh_data_path=1
    // when the v2 acceleration flags are turned off
    site.mockFeatureToggles({
      isAcceleratingEnabled: false,
      isAcceleratingAllergies: false,
    });
    Allergies.setIntercepts({ allergiesData, useOhData: true });
  });

  it('Visits Medical Records View Allergies List', () => {
    site.loadPage();

    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

    cy.get('body').should('be.visible');

    // Wait for list to load, then click first allergy
    cy.get('[data-testid="record-list-item"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .find('a')
      .click();

    cy.url().should('include', '/allergies/');
  });
});
