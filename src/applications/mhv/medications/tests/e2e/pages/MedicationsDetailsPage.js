import rxTracking from '../fixtures/prescription-tracking-details.json';

class MedicationsDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.contains(
      'If you print this page, it won’t include your allergies and reactions to medications.',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.contains('What to know before you print or download').click({
      force: true,
    });
  };

  verifyRefillPrescriptionsText = () => {
    cy.contains('Refill prescription');
  };

  verifyPrescriptionsNumber = PrescriptionsNumber => {
    cy.get('p[data-testid="prescription-number"]').should(
      'have.text',
      PrescriptionsNumber,
    );
  };

  verifyPrescriptionsName = prescriptionName => {
    cy.get('[data-testid="prescription-name"]').should(
      'contain',
      prescriptionName,
    );
  };

  verifyPrescriptionNameIsFocusedAfterLoading = () => {
    cy.get('[data-testid="prescription-name"]').should('have.focus');
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

  // verifyPrescriptionsExpirationDate = () => {
  //   cy.get('[data-testid="expiration-date"]').should(
  //     'have.text',
  //     'April 13, 2024',
  //   );
  // };
  verifyPrescriptionsExpirationDate = expDate => {
    cy.get('[data-testid="expiration-date"]').should('have.text', expDate);
  };

  verifyPrescriptionsOrderedDate = () => {
    cy.get('[datat-testid="ordered-date"]').should(
      'have.text',
      'April 13, 2023',
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
    cy.get('a[data-testid ="medications-history-details-link"]')
      .first()
      .click({ force: true });
  };

  clickMedicationDetailsLink = prescriptionDetails => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${
        prescriptionDetails.data.attributes.prescriptionId
      }`,
      prescriptionDetails,
    ).as('prescriptionDetails');
    cy.get(
      `#card-header-${
        prescriptionDetails.data.attributes.prescriptionId
      } > [data-testid="medications-history-details-link"]`,
    ).should('be.visible');
    cy.get(
      `#card-header-${
        prescriptionDetails.data.attributes.prescriptionId
      } > [data-testid="medications-history-details-link"]`,
    ).click({ waitForAnimations: true });
  };

  clickMedicationsLandingPageBreadcrumbsOnListPage = () => {
    cy.get('[data-testid="rx-breadcrumb"] > :nth-child(1) > a').should(
      'be.visible',
    );
    cy.get('[data-testid="rx-breadcrumb"] > :nth-child(1) > a').click({
      force: true,
    });
  };

  clickMedicationsListPageBreadcrumbsOnDetailsPage = () => {
    cy.get('[data-testid="rx-breadcrumb"] > :nth-child(2) > a').should('exist');
    cy.get('[data-testid="rx-breadcrumb"] > :nth-child(2) > a').click({
      waitForAnimations: true,
    });
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

  verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('have.text', 'Download this page as a PDF')
      .should('be.enabled');
  };

  verifyRefillButtonEnabledOnMedicationsDetailsPage = () => {
    cy.get('[data-testid="refill-request-button"]').should('be.enabled');
  };

  clickWhatDoesThisStatusMeanDropDown = () => {
    cy.get('[data-testid="status-dropdown"]').should('exist');
    cy.get('[data-testid="status-dropdown"]').click({
      waitForAnimations: true,
    });
  };

  verifyNonVAStatusDropDownDefinition = () => {
    cy.get('[data-testid="nonVA-status-definition"] > :nth-child(1)').should(
      'contain',
      'this isn’t a prescription you filled through a VA pharmacy.',
    );
  };

  verifyActiveStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="active-status-definition"]',
    ).should('contain', 'This is a current prescription.');
  };

  verifyOnHoldStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="onHold-status-definition"]',
    ).should('contain', 'We put a hold on this prescription.');
  };

  verifyParkedStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="parked-status-dropdown"]',
    ).should(
      'contain',
      'we won’t send any shipments until you request to fill or refill it.',
    );
  };

  verifyDiscontinuedStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="discontinued-status-definition"]',
    ).should('contain', 'You can’t refill this prescription.');
  };

  verifyExpiredStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="expired-status-definition"]',
    ).should('contain', 'This prescription is too old to refill.');
  };

  verifyTransferredStatusDropDownDefinition = () => {
    cy.get('[data-testid="status-dropdown"] > p').should(
      'contain',
      'We moved this prescription to our My VA Health portal.',
    );
  };

  verifyUnknownStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="unknown-status-definition"]',
    ).should('contain', 'There’s a problem with our system');
  };

  verifySubmittedStatusDropDownDefinition = () => {
    cy.get(
      '[data-testid="status-dropdown"] > [data-testid="submitted-status-definition"]',
    ).should(
      'contain',
      'We got your request to fill or refill this prescription.',
    );
  };

  verifyPrescriptionTrackingInformation = () => {
    cy.get('[data-testid="track-package"]').should('be.visible');
    // cy.get('[data-testid="tracking-number"]')
    //   .should('contain', `${rxTracking.data.attributes.trackingList[0][0].tracking[0].trackingNumber}`);
    cy.get('[data-testid="rx-name"]').should(
      'contain',
      `${rxTracking.data.attributes.prescriptionName}`,
    );
  };

  clickReviewImageDropDownOnDetailsPage = () => {
    cy.get('[data-testid="review-rx-image"]').should('exist');
    cy.get('[data-testid="review-rx-image"]').click({
      waitForAnimations: true,
    });
  };

  verifyMedicationImageVisibleOnDetailsPage = () => {
    cy.get('[data-testid="review-rx-image"] > img').should('be.visible');
  };
}
export default MedicationsDetailsPage;
