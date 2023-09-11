import prescriptions from '../fixtures/prescriptions.json';

class MedicationsListPage {
  clickGotoMedicationsLink = () => {
    cy.intercept('GET', '/my-health/medications', prescriptions);
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
  };

  verifyTextInsideDropDownOnListPage = () => {
    cy.contains(
      'When you print or download medication records, we’ll include a list of allergies and reactions in your VA medical records.',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.contains('What to know about downloading records').click({
      force: true,
    });
  };

  clickPrintOrDownloadThisListDropDown = () => {
    cy.get('[data-testid="print-records-button"] > span').click({
      force: true,
    });
  };

  verifyPrintMedicationsListEnabledOnListPage = () => {
    cy.get('[class="menu-options menu-options-open"]').should(
      'contain',
      'Print list',
    );
    cy.contains('Print list').should('be.enabled');
  };

  verifyNavigationToListPageAfterClickingBreadcrumbMedications = () => {
    cy.get('[data-testid="list-page-title"]')
      .should('have.text', 'Medications')
      .should('be.visible');
  };

  verifyDownloadListAsPDFButtonOnListPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('contain', 'Download list as PDF')
      .should('be.visible');
  };
}
export default MedicationsListPage;
