import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('focuses correctly when deep-linking to a specific page', () => {
    VaccinesListPage.goToVaccinesPage(2);

    cy.get('#showingRecords').should('be.focused');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('maintains correct focus while changing page via pagination', () => {
    VaccinesListPage.goToVaccines();

    // With no page specified, default is page 1 but focus should be on <h1>
    cy.get('h1').should('be.focused');

    // Click page 2 in the pagination
    cy.get('va-pagination')
      .shadow()
      .find('a[aria-label="page 2, last page"]')
      .click();

    // After page change, focus should be on "Showing..."
    cy.get('#showingRecords').should('be.focused');

    // Click page 1 in the pagination
    cy.get('va-pagination')
      .shadow()
      .find('a[aria-label="page 1, first page"]')
      .click();

    // After page change back to page 1, focus should remain on "Showing..."
    cy.get('#showingRecords').should('be.focused');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
