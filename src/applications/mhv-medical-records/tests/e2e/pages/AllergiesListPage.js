import defaultAllergies from '../fixtures/allergies.json';
import BaseListPage from './BaseListPage';

class AllergiesListPage extends BaseListPage {
  clickGotoAllergiesLink = (
    allergies = defaultAllergies,
    waitForAllergies = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergiesList');
    cy.get('[href="/my-health/medical-records/vaccines"]').should('be.visible');
    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('be.visible')
      .then(() => {
        cy.get('[data-testid="allergies-landing-page-link"]').click();
      });
    if (waitForAllergies) {
      cy.wait('@allergiesList');
    }
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
    cy.get('#showingRecords').should(
      'have.text',
      `Showing ${displayedStartNumber} to ${displayedEndNumber} of ${numRecords} records from newest to oldest`,
    );
    cy.focused().then($el => {
      cy.wrap($el).should(
        'contain',
        `Showing ${displayedStartNumber} to ${displayedEndNumber} of ${numRecords} records from newest to oldest`,
      );
    });
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
      .should('have.attr', 'href', '/my-health/medical-records');
  };

  selectSort = _sort => {
    cy.get('select').select(_sort);
  };

  verifyAllergyTitleByIndex = (index, title) => {
    cy.get('[data-testid="record-list-item"]')
      .eq(index)
      .should('contain', title);
  };
}
export default new AllergiesListPage();
