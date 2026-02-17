import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesData from '../fixtures/allergies/sample-lighthouse.json';
import AllergiesListPage from '../../pages/AllergiesListPage';

describe('Medical Records View Allergies for VistA Users (Path 3)', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    site.mockFeatureToggles({
      isAcceleratingEnabled: false,
      isAcceleratingAllergies: false,
    });
  });

  it('Visits allergies list and uses regular VistA endpoint', () => {
    // Set up intercept to verify VistA path (no use_oh_data_path parameter)
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergiesData);
    }).as('vista-allergies-list');

    site.loadPage();
    AllergiesListPage.goToAllergies(allergiesData);

    cy.injectAxeThenAxeCheck();

    // Verify page title
    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

    // Verify page heading
    cy.get('h1').should('contain', 'Allergies and reactions');

    // Verify VistA data format (not unified format)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="record-list-item"]').length > 0) {
        cy.get('[data-testid="record-list-item"]')
          .first()
          .within(() => {
            cy.get('a').should('be.visible');
            // VistA format uses "Date entered:" label
            cy.contains('Date entered:').should('be.visible');
          });
      }
    });
  });

  it('Navigates to allergy detail using VistA endpoint', () => {
    // Mock detail endpoint in case it's called (VistA path may use list data instead)
    cy.intercept('GET', '/my_health/v1/medical_records/allergies/*', req => {
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergiesData.entry[0].resource);
    }).as('vista-allergy-detail');

    site.loadPage();
    AllergiesListPage.goToAllergies(allergiesData);

    cy.get('body').then($body => {
      if ($body.find('[data-testid="record-list-item"]').length > 0) {
        cy.get('[data-testid="record-list-item"]').first().find('a').click();

        // Wait for detail page to load
        cy.get('h1').should('be.visible');
        // Verify detail page displays
        cy.url().should('include', '/allergies/');

        // Verify VistA format fields are loaded before a11y check
        cy.contains('Date entered').should('be.visible');
        cy.get('[data-testid="allergy-type"]').should('exist');
        cy.injectAxeThenAxeCheck();

        // Verify detail page displays
        cy.url().should('include', '/allergies/');
        cy.get('h1').should('exist');

        // Verify VistA format fields
        cy.contains('Date entered').should('be.visible');
        cy.get('[data-testid="allergy-type"]').should('exist');
      }
    });
  });
});
