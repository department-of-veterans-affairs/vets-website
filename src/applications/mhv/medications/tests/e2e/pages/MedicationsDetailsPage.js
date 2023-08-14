class MedicationsDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.contains(
      'print your records instead of downloading. Downloading will save a copy of your records to the public computer.',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.contains('What to know about downloading records').click({
      force: true,
    });
  };

  clickMedicationHistoryAndDetailsLink = prescriptionDetails => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${
        prescriptionDetails.data.attributes.prescriptionId
      }`,
      prescriptionDetails,
    ).as('prescription_details');
    cy.get('[data-testid ="medications-history-details-link"]')
      .first()
      .click({ force: true });
  };
}
export default MedicationsDetailsPage;
