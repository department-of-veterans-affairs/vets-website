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
    AllergiesListPage.goToAllergies(allergiesData);
  });

  it('Visits allergies list and uses regular VistA endpoint', () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergiesData);
    }).as('vista-allergies-list');

    site.loadPage();

    cy.wait('@vista-allergies-list');

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
          .should('be.visible');
      }
    });
  });

  it('Navigates to allergy detail using VistA endpoint', () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies/*', req => {
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(allergiesData.entry[0]);
    }).as('vista-allergy-detail');

    site.loadPage();

    cy.get('body').then($body => {
      if ($body.find('[data-testid="record-list-item"]').length > 0) {
        cy.get('[data-testid="record-list-item"]')
          .first()
          .find('a')
          .click();

        cy.wait('@vista-allergy-detail');

        cy.injectAxeThenAxeCheck();

        cy.url().should('include', '/allergies/');
      }
    });
  });
});
