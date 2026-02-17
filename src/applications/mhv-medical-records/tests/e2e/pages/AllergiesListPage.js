import defaultAllergies from '../fixtures/allergies.json';
import BaseListPage from './BaseListPage';

class AllergiesListPage extends BaseListPage {
  goToAllergies = (allergies = defaultAllergies) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies*',
      allergies,
    ).as('allergiesList');
    cy.visit('my-health/medical-records/allergies');
    // cy.findByTestId('allergies-landing-page-link').click();
    cy.wait('@allergiesList');
    // Wait for page to load
    cy.get('h1').should('be.visible').and('be.focused');
  };

  loadVAPaginationNextAllergies = () => {
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });
  };

  verifyPaginationAllergiesDisplayed = (
    displayedStartNumber,
    displayedEndNumber,
    numRecords,
  ) => {
    cy.findByText(
      `Showing ${displayedStartNumber} to ${displayedEndNumber} of ${numRecords} records from`,
    );
  };

  verifyBreadcrumbs = breadcrumbsText => {
    cy.get('[data-testid="breadcrumbs"]').contains(`${breadcrumbsText}`, {
      matchCase: false,
    });
  };

  verifySecondaryNav = () => {
    cy.get('[data-testid="mhv-sec-nav-item"]')
      .eq(4)
      .find('a')
      .contains('Records')
      .should('be.visible');
    cy.get('[data-testid="mhv-sec-nav-item"]')
      .eq(4)
      .find('a')
      .should('have.attr', 'href', '/my-health/medical-records/');
  };
}
export default new AllergiesListPage();
