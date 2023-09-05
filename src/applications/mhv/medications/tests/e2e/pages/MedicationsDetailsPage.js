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

  verifyPrescriptionsNumber = PrescriptionsNumber => {
    cy.get('[data-testid="prescription-number"]').should(
      'have.text',
      PrescriptionsNumber,
    );
  };

  verifyPrescriptionsName = prescriptionDetails => {
    cy.get('[data-testid="prescription-name"]').should(
      'contain',
      prescriptionDetails,
    );
  };

  verifyPrescriptionsStatus = PrescriptionsStatus => {
    cy.get('[data-testid="status"]').should('have.text', PrescriptionsStatus);
  };

  verifyPrescriptionsRefillsRemaining = PrescriptionsRefillsRemaining => {
    cy.get('[data-testid="refills-left"]').should(
      'have.text',
      PrescriptionsRefillsRemaining,
    );
  };

  verifyPrescriptionsexpirationDate = () => {
    cy.get('[data-testid="expiration-date"]').should(
      'have.text',
      'April 14, 2024',
    );
  };

  verifyPrescriptionsorderedDate = () => {
    cy.get('[datat-testid="ordered-date"]').should(
      'have.text',
      'April 14, 2023',
    );
  };

  verifyPrescriptionsfacilityName = PrescriptionsfacilityName => {
    cy.get('[data-testid="facility-name"]').should(
      'have.text',
      PrescriptionsfacilityName,
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

  clickMedicationsBreadcrumbsOnDetailsPage = () => {
    cy.get('#va-breadcrumbs-list-2 > li:nth-child(1) > a').click({
      force: true,
    });
  };
}
export default MedicationsDetailsPage;
