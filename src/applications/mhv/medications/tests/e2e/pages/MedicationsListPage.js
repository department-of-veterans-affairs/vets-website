class MedicationsListPage {
  clickGotoMedicationsLink = () => {
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
  };

  verifyTextInsideDropDownOnListPage = () => {
    cy.contains(
      'print your records instead of downloading. Downloading will save a copy of your records to the public computer.',
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

  verifyPrintMedicationsListonListPage = () => {
    cy.get('[class="menu-options menu-options-open"]').should(
      'contain',
      'Print list',
    );
    cy.contains('Print list').should('be.enabled');
  };
}
export default MedicationsListPage;
