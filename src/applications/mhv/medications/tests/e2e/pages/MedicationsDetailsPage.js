import rxTracking from '../fixtures/prescription-tracking-details.json';
import expiredRx from '../fixtures/expired-prescription-details.json';

class MedicationsDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.get('[data-testid="dropdown-info"]').should(
      'contain',
      'we’ll include a list of allergies and reactions',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.get('[data-testid="before-download"]').should('be.visible');
    cy.get('[data-testid="before-download"]').click({
      waitForAnimations: true,
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
      `[data-testid="rx-card-info"] > #card-header-${
        prescriptionDetails.data.attributes.prescriptionId
      } > [data-testid="medications-history-details-link"]`,
    ).should('be.visible');
    cy.get(
      `#card-header-${
        prescriptionDetails.data.attributes.prescriptionId
      } > [data-testid="medications-history-details-link"]`,
    )
      .first()
      .click({ waitForAnimations: true });
  };

  clickMedicationsLandingPageBreadcrumbsOnListPage = () => {
    cy.get('[data-testid="rx-breadcrumb"]').should('be.visible');
    cy.get('[href="/my-health/medications/about"]').click({
      waitForAnimations: true,
    });
  };

  clickMedicationsListPageBreadcrumbsOnDetailsPage = () => {
    cy.get('[data-testid="rx-breadcrumb"]').should('be.visible');
    cy.get('[href="/my-health/medications/1"]').click({
      waitForAnimations: true,
    });
    // cy.get('[data-testid="rx-breadcrumb"] > :nth-child(2) > a').should('exist');
    // cy.get('[data-testid="rx-breadcrumb"]').click({
    //   waitForAnimations: true,
    // });
  };

  clickMedicationsListPageTwoBreadcrumbsOnDetailsPage = () => {
    cy.get('[data-testid="rx-breadcrumb"]').should('be.visible');
    cy.get('[href="/my-health/medications/2"]').click({
      waitForAnimations: true,
    });
    // cy.get('[data-testid="rx-breadcrumb"] > :nth-child(2) > a').should('exist');
    // cy.get('[data-testid="rx-breadcrumb"]').click({
    //   waitForAnimations: true,
    // });
  };

  clickPrintOrDownloadThisPageDropDownOnDetailsPage = () => {
    cy.get('[data-testid="print-records-button"] > span').click({
      force: true,
    });
  };

  verifyPrintButtonEnabledOnDetailsPage = () => {
    cy.get('[data-testid="print-records-button"]')
      .should('contain', 'Print or download')
      .and('be.enabled');
  };

  verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('have.text', 'Download a PDF of this page')
      .should('be.enabled');
  };

  verifyRefillButtonEnabledOnMedicationsDetailsPage = () => {
    cy.get('[data-testid="refill-request-button"]').should('be.enabled');
  };

  clickWhatDoesThisStatusMeanDropDown = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00013264681',
      expiredRx,
    );
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
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00013264681',
    );
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
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00113002239',
      rxTracking,
    ).as('rxImage');
    cy.get('[data-testid="track-package"]').should('be.visible');
    // cy.get('[data-testid="tracking-number"]')
    //   .should('contain', `${rxTracking.data.attributes.trackingList[0][0].tracking[0].trackingNumber}`);
    cy.get('[data-testid="rx-name"]').should(
      'contain',
      `${rxTracking.data.attributes.prescriptionName}`,
    );
  };

  clickReviewImageDropDownOnDetailsPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00113002239',
      rxTracking,
    ).as('rxImage');
    cy.get('[data-testid="review-rx-image"]').should('exist');
    cy.get('[data-testid="review-rx-image"]').click({
      waitForAnimations: true,
    });
  };

  verifyMedicationImageVisibleOnDetailsPage = () => {
    cy.get('[data-testid="review-rx-image"] > img').should('be.visible');
  };

  verifyRefillHistoryHeaderOnDetailsPage = () => {
    cy.get('[data-testid="refill-History"]').should(
      'contain',
      'Refill history',
    );
  };

  verifyFirstRefillHeaderTextOnDetailsPage = () => {
    cy.get('[data-testid="refill"]')
      .first()
      .should('contain', 'Refill 1');
  };

  verifyFillDateFieldOnDetailsPage = () => {
    cy.get('[data-testid="fill-date"]').should(
      'contain',
      'Filled by pharmacy on',
    );
  };

  verifyShippedOnDateFieldOnDetailsPage = () => {
    cy.get('[data-testid="shipped-date"]').should('contain', 'Shipped on');
  };

  verifyImageOfMedicationFieldOnDetailsPage = () => {
    cy.get('[data-testid="med-image"]').should(
      'contain',
      'Image of the medication or supply',
    );
  };

  verifyRxFilledByPharmacyDateOnDetailsPage = dispensedDate => {
    cy.get('[data-testid="dispensedDate"]')
      .first()
      .should('contain', dispensedDate);
  };

  verifyRxShippedOnDateOnDetailsPage = shippedDate => {
    cy.get('[data-testid="shipped-on"]')
      .first()
      .should('contain', shippedDate);
  };

  verifyNoImageFieldMessageOnDetailsPage = () => {
    cy.get('[data-testid="no-image"]').should('contain', 'No image available');
  };

  verifyCmopNdcNumberIsNull = prescriptionDetails => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${
        prescriptionDetails.data.attributes.prescriptionId
      }`,
      prescriptionDetails,
    ).as('prescriptionDetails');
    cy.get('@prescriptionDetails')
      .its('response')
      .then(res => {
        expect(res.body.data.attributes).to.include({
          cmopNdcNumber: null,
        });
      });
  };

  verifyNonVaMedicationStatusOnDetailsPage = prescriptionDetails => {
    cy.get('[data-testid="rx-status"]').should(
      'have.text',
      `${prescriptionDetails.data.attributes.dispStatus}`,
    );
  };

  verifyPrescriptionSourceForNonVAMedicationOnDetailsPage = prescriptionDetails => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${
        prescriptionDetails.data.attributes.prescriptionId
      }`,
      prescriptionDetails,
    ).as('prescriptionDetails');
    cy.get('@prescriptionDetails')
      .its('response')
      .then(res => {
        expect(res.body.data.attributes).to.include({
          prescriptionSource: 'NV',
        });
      });
  };

  // verifyNonVAMedicationDisplayMessageOnDetailsPage = (prescriptionDetails) => {
  //   if (prescriptionDetails.data.attributes.dispStatus = "Active: Non-VA") {
  //     cy.get('[data-testid="non-VA-prescription"]').should(
  //       'contain',
  //       'This isn’t a prescription that you filled through a VA pharmacy.',
  //     );
  //   };
  // };
}
export default MedicationsDetailsPage;
