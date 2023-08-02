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
}
export default MedicationsListPage;
