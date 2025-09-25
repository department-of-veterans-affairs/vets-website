import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesData from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import Allergies from '../pages/Allergies';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: false, // Disable acceleration to test OH path
      isAcceleratingAllergies: false,
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

    cy.get('body').should('be.visible');
    cy.get(
      '[data-testid="allergies-list"], [data-testid="no-records-message"], h1',
      { timeout: 10000 },
    ).should('exist');

    cy.get('body').then($body => {
      if ($body.find('[data-testid="record-list-item"]').length > 0) {
        cy.get('[data-testid="record-list-item"]')
          .first()
          .find('a')
          .should('be.visible')
          .click();

        cy.url().should('include', '/allergies/');
      } else {
        cy.get('h1').should('contain', 'Allergies');
      }
    });
  });
});
