class MedicationsListPage {
  verifyTextInsideDropDownOnListPage = () => {
    cy.contains(
      'print your records instead of downloading. Downloading will save a copy of your records to the public computer.',
    );
  };
}
export default MedicationsListPage;
