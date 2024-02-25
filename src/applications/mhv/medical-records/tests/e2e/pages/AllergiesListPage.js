import defaultAllergies from '../fixtures/allergies.json';

class AllergiesListPage {
  clickGotoAllergiesLink = (
    allergies = defaultAllergies,
    waitForAllergies = false,
  ) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');
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

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click();
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyDownloadPDF = () => {
    // should display a download pdf file button "Download PDF of this page"
    cy.get('[data-testid="printButton-1"]').should('be.visible');
  };

  verifyDownloadTextFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-2"]').should('be.visible');
    // cy.get('[data-testid="printButton-2').click();
  };

  // cy.get('#showingRecords').should(
  //   'have.text',
  //   'Showing 11 to 14 of 14 records from newest to oldest',
  // );
}
export default new AllergiesListPage();
