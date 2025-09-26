import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import allergies from '../fixtures/allergies/sample-lighthouse.json';
import Allergies from '../pages/Allergies';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: false,
      isAcceleratingAllergies: false,
    });

    // set up intercepts
    Allergies.setIntercepts({ allergiesData: allergies });
  });

  it('Allergies is disabled', () => {
    site.loadPage();

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
