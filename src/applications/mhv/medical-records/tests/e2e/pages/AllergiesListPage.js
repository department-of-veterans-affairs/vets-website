import defaultAllergies from '../fixtures/allergies.json';

class AllergiesListPage {
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
    cy.get('[href="/my-health/medical-records/allergies"]')
      .should('be.visible')
      .then(() => {
        cy.get('[href="/my-health/medical-records/allergies"]').click();
      });
    //
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
  };

  // cy.get('#showingRecords').should(
  //   'have.text',
  //   'Showing 11 to 14 of 14 records from newest to oldest',
  // );
}
export default new AllergiesListPage();
