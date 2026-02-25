import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import Vaccines from './accelerated/pages/Vaccines';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';
import vaccinesData from './accelerated/fixtures/vaccines/sample-lighthouse.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles();
  });

  it('focuses correctly when deep-linking to a specific page', () => {
    Vaccines.setIntercepts({ vaccinesData });

    site.loadPage();
    Vaccines.goToVaccinesSpecificPage(2);

    cy.get('#showingRecords').should('be.focused');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('maintains correct focus while changing page via pagination', () => {
    Vaccines.setIntercepts({ vaccinesData });

    site.loadPage();
    Vaccines.goToVaccinesSpecificPage();

    // With no page specified, default is page 1 but focus should be on <h1>
    cy.get('h1').should('be.focused');

    // Wait for records to render before interacting with pagination
    cy.get('#showingRecords').should('be.visible');

    // Click next page using class selector (more stable than aria-label after component-library updates)
    cy.get('va-pagination')
      .should('be.visible')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });

    // After page change, focus should be on "Showing..."
    cy.get('#showingRecords').should('be.focused');

    // Click previous page
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__previous-page"]')
      .click({ waitForAnimations: true });

    // After page change back to page 1, focus should remain on "Showing..."
    cy.get('#showingRecords').should('be.focused');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
