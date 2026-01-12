import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Allergies from '../pages/Allergies';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import allergiesData from '../fixtures/allergies/uhd.json';

describe('Medical Records Accelerated Allergies', () => {
  const site = new MedicalRecordsSite();
  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingAllergies: true,
    });
    Allergies.setIntercepts({ allergiesData });
  });

  afterEach(() => {});

  it('Displays accelerated loading indicator and fetches unified data', () => {
    site.loadPage();

    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

    // Alert removed from Allergies page — assert it does not render
    cy.get('body')
      .find('[data-testid="cerner-facilities-info-alert"]')
      .should('not.exist');

    // Verify unified allergy format is displayed
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    // Check for unified data format elements
    cy.get('[data-testid="record-list-item"] a').should('be.visible');
    cy.contains('Date entered:').should('be.visible');

    // Test detail navigation with unified data
    const ALLERGY_INDEX = 0;
    Allergies.selectAllergy({ index: ALLERGY_INDEX });

    // Verify detail page shows unified format
    cy.url().should('include', '/allergies/');
    Allergies.validateAllergyDetailPage();
  });

  it('Shows correct unified allergy data structure', () => {
    site.loadPage();
    Allergies.goToAllergiesPage();

    cy.injectAxeThenAxeCheck();

    // Verify the first allergy shows unified data format (Cashew nut - most recent, OH record)
    cy.get('[data-testid="record-list-item"]')
      .first()
      .within(() => {
        // Check unified format fields - OH record with provider
        cy.get('a').should('contain', 'Cashew nut');
        cy.contains('Date entered:').should('be.visible');
      });

    // Also verify a VistA record (TRAZODONE at index 8 - null date, sorted to end)
    cy.get('[data-testid="record-list-item"]')
      .eq(8)
      .within(() => {
        cy.get('a').should('contain', 'TRAZODONE');
        cy.contains('Date entered:').should('be.visible');
      });
  });
});
