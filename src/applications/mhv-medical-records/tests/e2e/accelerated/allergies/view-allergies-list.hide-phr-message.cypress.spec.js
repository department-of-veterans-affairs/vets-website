import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergies from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import Allergies from '../pages/Allergies';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingAllergies: true,
    });

    // set up intercepts
    Allergies.setIntercepts({ allergiesData: allergies, useOhData: true });
  });

  it.skip('Hide all PHR messages', () => {
    site.loadPage();

    Allergies.goToAllergiesPage();

    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

    cy.injectAxeThenAxeCheck();

    cy.get('#new-records-indicator').should('not.exist');
  });
});
