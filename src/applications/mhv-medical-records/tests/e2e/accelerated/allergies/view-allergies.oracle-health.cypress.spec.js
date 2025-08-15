import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesData from '../fixtures/allergies/sample-lighthouse.json';
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
    Allergies.setIntercepts({ allergiesData });
  });

  it('Visits Medical Records View Allergies List', () => {
    site.loadPage();

    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

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
