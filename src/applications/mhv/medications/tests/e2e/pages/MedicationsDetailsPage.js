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
    cy.get('.vads-u-margin-top--2 > :nth-child(4)').should(
      'have.text',
      PrescriptionsNumber,
    );
  };

  verifyPrescriptionsName = prescriptionName => {
    cy.get('.page-title > div').should('have.text', prescriptionName);
  };

  verifyPrescriptionsStatus = PrescriptionsStatus => {
    cy.get('.vads-u-margin-top--2 > :nth-child(6)').should(
      'have.text',
      PrescriptionsStatus,
    );
  };

  verifyPrescriptionsquantity = Prescriptionsquantity => {
    cy.get('.vads-u-margin-y--3 > :nth-child(7)').should(
      'have.text',
      Prescriptionsquantity,
    );
  };

  verifyPrescriptionsexpirationDate = () => {
    cy.get('.vads-u-margin-top--2 > :nth-child(13)').should(
      'have.text',
      'April 14, 2024',
    );
  };

  verifyPrescriptionsorderedDate = () => {
    cy.get('.vads-u-margin-top--2 > :nth-child(11)').should(
      'have.text',
      'April 14, 2023',
    );
  };

  verifyPrescriptionsfacilityName = PrescriptionsfacilityName => {
    cy.get('.vads-u-margin-top--2 > :nth-child(17)').should(
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
