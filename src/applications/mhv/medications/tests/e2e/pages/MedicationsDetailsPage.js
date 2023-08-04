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

  verifyRefillPrescriptionsText = () => {
    cy.contains('Refill prescription');
  };

  verifyPrescriptionsNumber = () => {
    cy.get('.vads-u-margin-top--2 > :nth-child(4)').should(
      'have.text',
      '3636930',
    );
  };

  verifyPrescriptionsStatus = () => {
    cy.get('.vads-u-margin-top--2 > :nth-child(6)').should(
      'have.text',
      'active',
    );
  };

  verifyWhatDoesThisStatusMeanText = () => {
    cy.contains('What does this status mean?');
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
