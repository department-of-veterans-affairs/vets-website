class MedicationsDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.contains(
      'If you print this page, it won’t include your allergies and reactions to medications.',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.contains('What to know before you download').click({
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
    cy.get('[data-testid="status"]').should(
      'have.text',
      PrescriptionsStatus.charAt(0).toUpperCase() +
        PrescriptionsStatus.slice(1),
    );
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
    cy.contains('About Medications')
      .should('be.visible')
      .click({ force: true });
  };

  clickPrintOrDownloadThisPageDropDownOnDetailsPage = () => {
    cy.get('[data-testid="print-records-button"] > span').click({
      force: true,
    });
  };

  verifyPrintButtonEnabledOnDetailsPage = () => {
    cy.get('[data-testid="print-button"]')
      .should('contain', 'Print')
      .and('be.enabled');
  };
}
export default MedicationsDetailsPage;
