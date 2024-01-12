// import defaultCondition from '../fixtures/Condition.json';

class ConditionDetailsPage {
  verifyConditionStatus = status => {
    cy.get('[data-testid="condition-status"]').should('be.visible');
    cy.get('[data-testid="condition-status"]').contains(status);
  };

  verifyProvider = provider => {
    cy.get('[data-testid="condition-provider"]').should('be.visible');
    cy.get('[data-testid="condition-provider"]').contains(provider);
  };

  verifyLocation = location => {
    cy.get('[data-testid="condition-location"]').should('be.visible');
    cy.get('[data-testid="condition-location"]').contains(location);
  };

  verifySnomed = snomed => {
    cy.get('[data-testid="condition-snomed"]').should('be.visible');
    cy.get('[data-testid="condition-snomed"]').contains(snomed);
  };

  verifyProviderNotes = providerNotes => {
    // cy.get('[data-testid="item-list-string"]').should('be.visible');
    cy.get('[data-testid="item-list-string"]').contains(providerNotes);
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
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

  clickDownloadPDFFile = () => {
    // should display a download pdf file button "Download list as a pdf file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new ConditionDetailsPage();
