import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import rxTracking from '../fixtures/prescription-tracking-details.json';
import expiredRx from '../fixtures/expired-prescription-details.json';
import medicationInformation from '../fixtures/patient-medications-information.json';
import noMedicationInformation from '../fixtures/missing-patient-medication-information.json';
import rxDetails from '../fixtures/active-submitted-prescription-details.json';
import { DATETIME_FORMATS } from '../../../util/constants';

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
    cy.get('[data-testid="ordered-date"]')
      .first()
      .should('have.text', 'April 14, 2023');
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
    cy.get('a[data-testid="medications-history-details-link"]')
      .first()
      .click({ force: true });
  };

  clickMedicationDetailsLink = (prescriptionDetails, cardNumber) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${
        prescriptionDetails.data.attributes.prescriptionId
      }`,
      prescriptionDetails,
    ).as('prescriptionDetails');
    cy.get(
      `[data-testid="medication-list"] > :nth-child(${cardNumber}) [data-testid="medications-history-details-link"]`,
    ).should('be.visible');
    cy.get(
      `[data-testid="medication-list"] > :nth-child(${cardNumber}) [data-testid="medications-history-details-link"]`,
    )
      .first()
      .click({ waitForAnimations: true });
  };

  clickMedicationsListPageBreadcrumbsOnDetailsPage = (_interceptedPage = 1) => {
    cy.get('[data-testid="rx-breadcrumb-link"]').should('be.visible');
    cy.get('[data-testid="rx-breadcrumb-link"]')
      .shadow()
      .find('a')
      .eq(0)
      .click({
        waitForAnimations: true,
      });
    // http://localhost:3001/my-health/medications?page=1  << previous
  };

  clickMedicationsListPageTwoBreadcrumbsOnDetailsPageAndVerifyNavigation = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="rx-breadcrumb-link"]')
      .shadow()
      .find('a')
      .eq(0)
      .click({
        waitForAnimations: true,
      });
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength}  medications, alphabetically by status`,
      );
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

  verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage = () => {
    cy.get('[data-testid="print-records-button"]').should('have.focus');
  };

  clickPrintThisPageButtonOnDetailsPage = () => {
    cy.get('[data-testid="download-print-button"]').should('exist');
    cy.get('[data-testid="download-print-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyPrintButtonEnabledOnDetailsPage = () => {
    cy.get('[data-testid="print-records-button"]')
      .should('contain', 'Print or download')
      .and('be.enabled');
  };

  clickDownloadMedicationDetailsAsPdfOnDetailsPage = () => {
    cy.get('[data-testid="download-pdf-button"]').should('be.enabled');
    cy.get('[data-testid="download-pdf-button"]').click({
      force: true,
    });
  };

  verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('have.text', 'Download a PDF of this page')
      .should('be.enabled');
  };

  clickDownloadMedicationsDetailsAsTxtOnDetailsPage = () => {
    cy.get('[data-testid="download-txt-button"]').should('be.enabled');
    cy.get('[data-testid="download-txt-button"]').click({
      force: true,
    });
  };

  verifyRefillButtonEnabledOnMedicationsDetailsPage = () => {
    cy.get('[data-testid="refill-request-button"]').should('be.visible');
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
      multiple: true,
    });
  };

  verifyNonVAStatusDropDownDefinition = () => {
    cy.get('[data-testid="nonVA-status-definition"] > :nth-child(1)').should(
      'contain',
      'this isn’t a prescription you filled through a VA pharmacy.',
    );
  };

  verifyActiveNonVAStatusDisplayedOnDetailsPage = status => {
    cy.get('[data-testid="rx-status"]').should('contain', status);
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
    cy.get('[data-testid="discontinued-status-definition"]').should(
      'contain',
      'You can’t refill this prescription. We may use this status for either of these reasons:',
    );
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

  verifyMedicationImageVisibleOnDetailsPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00113002239',
      rxTracking,
    ).as('rxImage');
    cy.get('[data-testid="rx-image"]').should('be.visible');
  };

  verifyRefillHistoryHeaderOnDetailsPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00113002239',
      rxTracking,
    ).as('rxImage');
    cy.get('[data-testid="refill-History"]').should(
      'contain',
      'Refill history',
    );
  };

  verifyFirstRefillHeaderTextOnDetailsPage = () => {
    cy.get('[data-testid="rx-refill"]')
      .first()
      .should('contain', 'Refill');
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
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00113002239',
      rxTracking,
    ).as('rxImage');
    cy.get('[data-testid="med-image"]').should(
      'contain',
      'Image of the medication or supply',
    );
  };

  verifyRxFilledByPharmacyDateOnDetailsPage = () => {
    cy.get('[data-testid="dispensedDate"]')
      // .first()
      .should('contain', 'September 24, 2023');
  };

  verifyRxShippedOnDateOnDetailsPage = () => {
    cy.get('[data-testid="shipped-on"]')
      .first()
      .should('contain', 'September 24, 2023');
  };

  verifyNoImageFieldMessageOnDetailsPage = () => {
    cy.get('[data-testid="no-image"]').should('contain', 'Image not available');
  };

  verifyNonVaMedicationStatusOnDetailsPage = prescriptionDetails => {
    cy.get('[data-testid="rx-status"]').should(
      'have.text',
      `${prescriptionDetails.data.attributes.dispStatus}`,
    );
  };

  verifyFacilityInPlainLanguageOnDetailsPage = prescription => {
    cy.get('[data-testid="facility-name"]').should('contain', prescription);
  };

  verifyExpiredStatusDescriptionOnDetailsPage = () => {
    cy.get('[data-testid="expired"]').should(
      'contain',
      'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
    );
  };

  verifyShippedOnInformationRxDetailsPage = shippedDate => {
    cy.get('[data-testid="shipping-date"]').should('contain', shippedDate);
  };

  verifyRxRecordPharmacyPhoneNumberOnDetailsPage = pharmacyPhone => {
    cy.get('[data-testid="phone-number"]')
      .shadow()
      .find('[href="tel:+19832720905"]')
      .should('contain', pharmacyPhone);
  };

  verifyRfRecordPharmacyPhoneNumberOnDetailsPage = pharmacyPhone => {
    cy.get('[data-testid="phone-number"]')
      .shadow()
      .find('[href="tel:+14106366899"]')
      .should('contain', pharmacyPhone);
  };

  verifyUnknownRxPharmacyPhoneNumberOnDetailsPage = unknownRxPhone => {
    cy.get('[data-testid="phone-number"]')
      .shadow()
      .find('[href="tel:+17832721069"]')
      .should('contain', unknownRxPhone);
  };

  clickLearnMoreAboutMedicationLinkOnDetailsPage = prescriptionId => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${prescriptionId}/documentation*`,
      medicationInformation,
    ).as('medicationDescription');
    cy.get('[data-testid="va-prescription-documentation-link"]').click({
      waitForAnimations: true,
    });
    cy.wait('@medicationDescription');
  };

  clickLearnMoreAboutMedicationLinkOnDetailsPageWithNoInfo = prescriptionId => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${prescriptionId}/documentation*`,
      noMedicationInformation,
    ).as('medicationDescription');
    cy.get('[data-testid="va-prescription-documentation-link"]').click({
      waitForAnimations: true,
    });
    cy.wait('@medicationDescription');
  };

  clickLearnMoreAboutMedicationLinkOnDetailsPageError = () => {
    cy.get('[data-testid="va-prescription-documentation-link"]').click({
      waitForAnimations: true,
    });
  };

  verifyMedicationInformationTitle = rxName => {
    cy.get('[data-testid="medication-information-title"]').should(
      'contain',
      `Medication information: ${rxName}`,
    );
  };

  verifyPrintOrDownloadDropDownButtonOnMedicationInformationPage = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownloadDropDownButtonOnMedicationInformationPage = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
  };

  verifyPrintThisPageDropDownOptionOnMedicationInformationPage = () => {
    cy.get('[data-testid="download-print-button"]').should(
      'contain',
      'Print this page',
    );
  };

  verifyDownloadPdfDropDownOptionOnMedicationInformationPage = () => {
    cy.get('[data-testid="download-pdf-button"]').should(
      'contain',
      'Download a PDF',
    );
  };

  verifyDownloadTxtDropDownOptionOnMedicationInformationPage = () => {
    cy.get('[data-testid="download-txt-button"]').should(
      'contain',
      'Download a text file',
    );
  };

  verifyPreviousPrescriptionsPaginationTextOnDetailsPage = text => {
    cy.get('[data-testid="grouping-showing-info"]').should('have.text', text);
  };

  clickNextButtonForPreviousPrescriptionPagination = () => {
    cy.contains('Next').click({ force: true });
  };

  verifyPaginationTextIsFocusedAfterClickingNext = text => {
    cy.get('[data-testid="grouping-showing-info"]')
      .should('have.text', text)
      .and('have.focus');
  };

  clickRefillHistoryAccordionOnDetailsPage = () => {
    cy.get('[data-testid="refill-history-accordion"]')
      .shadow()
      .find('[data-testid="expand-all-accordions"]')
      .click({ force: true, multiple: true });
  };

  // In component-library 54.7.0, va-accordion's expand/collapse button changed
  // from <button aria-pressed="true/false"> to <va-button-icon> without
  // aria-pressed. We verify state by checking which button is rendered:
  // expand-all visible = collapsed, collapse-all visible = expanded.
  verifyAccordionCollapsedOnDetailsPage = () => {
    cy.get('[data-testid="refill-history-accordion"]')
      .shadow()
      .find('[data-testid="expand-all-accordions"]')
      .should('exist');
  };

  verifyAccordionExpandedOnDetailsPage = () => {
    cy.get('[data-testid="refill-history-accordion"]')
      .shadow()
      .find('[data-testid="collapse-all-accordions"]')
      .should('exist');
  };

  verifyRefillHistoryInformationTextOnDetailsPage = text => {
    cy.get('[data-testid="refill-history-info"]').should('have.text', text);
  };

  verifyFilledDateFieldInAccordionCardInfoOnDetailPage = text => {
    cy.get(':nth-child(1) > [data-testid="fill-date"]').should(
      'have.text',
      text,
    );
  };

  verifyImageFieldInAccordionCardInfoOnDetailsPage = text => {
    cy.get(':nth-child(1) > [data-testid="med-image"]').should(
      'have.text',
      text,
    );
  };

  verifyMedicationDescriptionFieldInAccordionCardInfo = text => {
    cy.get(':nth-child(1) > [data-testid="med-description"]').should(
      'have.text',
      text,
    );
  };

  verifyDescriptionTextOnDetailsPage = text => {
    cy.get('[data-testid="recent-rx"]')
      .should('have.text', text)
      .and('be.visible');
  };

  verifyPreviousPrescriptionHeaderTextOnDetailsPage = text => {
    cy.get('[data-testid="previous-rx"]').should('contain', text);
  };

  visitMedDetailsPage = (prescriptionDetails, stationNumber = null) => {
    const urlSuffix = stationNumber ? `?station_number=${stationNumber}` : '';
    cy.intercept(
      'GET',
      `/my-health/medications/prescription/${prescriptionDetails}${urlSuffix}`,
    );
    cy.visit(
      `/my-health/medications/prescription/${prescriptionDetails}${urlSuffix}`,
    );
  };

  verifyNoMedicationsErrorAlertWhenUserNavsToDetailsPage = text => {
    cy.get('[data-testid="no-medications-list"]').should('have.text', text);
  };

  verifyLastFilledDateOnDetailsPage = text => {
    cy.get('[data-testid="rx-last-filled-date"]').should('contain', text);
  };

  verifyLastFilledDateNotDisplayedOnDetailsPage = () => {
    cy.get('[data-testid="rx-last-filled-date"]').should('not.exist');
  };

  verifyRefillLinkTextOnDetailsPage = text => {
    cy.get('[data-testid="refill-nav-link"]').should('have.text', text);
  };

  verifyRefillHistoryDescriptionText = text => {
    cy.get('[data-testid="refill-history-info"]').should('have.text', text);
  };

  verifyPendingRxWarningTextOnDetailsPage = alert => {
    cy.get('[data-testid="pending-med-alert"]').should('contain', alert);
  };

  verifyHeaderTextOnDetailsPage = text => {
    cy.get('[data-testid="recent-rx"]').should('have.text', text);
  };

  verifyPendingRenewalStatusDescriptionOnDetailsPage = text => {
    cy.get('[data-testid="pending-renewal-status"]').should('contain', text);
  };

  verifyPendingTextAlertForLessThanSevenDays = text => {
    cy.get('[data-testid="pending-med-alert"]').should('contain', text);
  };

  verifyRefillDelayAlertBannerOnDetailsPage = text => {
    cy.get('[data-testid="rx-details-refill-alert"]').should('contain', text);
  };

  verifyCheckStatusHeaderTextOnDetailsPage = text => {
    cy.get('[data-testid="check-status-text"]').should('have.text', text);
  };

  verifyPharmacyPhoneNumberOnDelayAlert = phoneNumber => {
    cy.get('[data-testid="pharmacy-phone-number"]')
      .shadow()
      .find('[href="tel:+14106366899"]')
      .should('contain', phoneNumber);
  };

  verifyProcessStepOneHeaderOnDetailsPage = (text, date) => {
    cy.get('[data-testid="submitted-step-one"]')
      .should('contain', text)
      .and('contain', date);
  };

  verifyProcessStepTwoHeaderOnDetailsPage = (text, note) => {
    cy.get('[data-testid="submitted-step-two"]')
      .should('contain', text)
      .and('contain', note);
  };

  verifyProcessStepThreeHeaderOnDetailsPage = (text, note) => {
    cy.get('[data-testid="submitted-step-three"]')
      .should('contain', text)
      .and('contain', note);
  };

  verifyActiveRxStepOneProgressTrackerOnDetailsPage = (
    text,
    data,
    dateInfo,
  ) => {
    cy.get('[header="We received your refill request"]')
      .should('contain', text)
      .and('contain', data)
      .and('contain', dateInfo);
  };

  verifyActiveRxStepTwoProgressTrackerOnDetailsPage = (text, data, note) => {
    cy.get('[data-testid="active-step-two"]')
      .should('contain', text)
      .and('contain', data)
      .and('contain', note);
  };

  verifyActiveRxStepThreeProgressTrackerOnDetailsPage = (text, data, note) => {
    cy.get('[data-testid="active-step-three"]')
      .should('contain', text)
      .and('contain', data)
      .and('contain', note);
  };

  verifyActiveRefillInProcessStepTwoOnDetailsPage = (
    locator,
    text,
    note,
    dateInfo,
  ) => {
    cy.get(locator)
      .should('contain', text)
      .and('contain', note)
      .and('contain', dateInfo);
  };

  verifyActiveRefillInProcessStepThreeOnDetailsPage = (
    text,
    note,
    dateInfo,
  ) => {
    cy.get('[data-testid="progress-step-three"]')
      .should('contain', text)
      .and('contain', note)
      .and('contain', dateInfo);
  };

  verifyTrackingForSubmittedRefillOnDetailsPage = () => {
    cy.get('[data-testid="rx-name"]').should(
      'contain',
      `${rxDetails.data.attributes.prescriptionName}`,
    );
  };

  verifyQuantityNotAvailableOnDetailsPage = text => {
    cy.get('[data-testid="rx-quantity"]')
      .first()
      .should('have.text', text);
  };

  verifyPrescribedOnDateNoAvailableOnDetailsPage = text => {
    cy.get('[data-testid="ordered-date"]').should('contain', text);
  };

  verifyProviderNameNotAvailableOnDetailsPage = text => {
    cy.get('[data-testid="prescribed-by"]').should('contain', text);
  };

  verifyMedDescriptionFieldInRefillAccordionDetailsPage = text => {
    cy.get('[data-testid="rx-description"]').should('contain', text);
  };

  verifyPharmacyPhoneNumberOnDetailsPage = text => {
    cy.get('[data-testid="pharmacy-phone"]').should('contain', text);
  };

  verifyReasonForUseOnDetailsPage = text => {
    cy.get('[data-testid="rx-reason-for-use"]').should('contain', text);
  };

  verifyPrescriptionQuantityOnDetailsPage = text => {
    cy.get('[data-testid="rx-quantity"]').should('have.text', text);
  };

  verifyInstructionsOnDetailsPage = text => {
    cy.get('[data-testid="rx-instructions"]').should('contain', text);
  };

  verifyStepTwoHeaderOnDetailPageForRxInProcess = (process, text) => {
    cy.get('[data-testid="process-delay-header"]')
      .should('contain', text)
      .and('contain', process);
  };

  verifyRefillAccordionHeaderForPartialFillOnDetailsPage = (text, date) => {
    cy.get('[data-testid="refill-history-accordion"] > :nth-child(1)')
      .should('contain', text)
      .and('contain', date);
  };

  verifyQuantityForPartialFillOnDetailsPage = text => {
    cy.get('[data-testid="rx-quantity-partial"]').should('have.text', text);
  };

  verifyPartialFillTextInRefillAccordionOnDetailsPage = text => {
    cy.get('[data-testid="partial-fill-text"]').should('have.text', text);
  };

  verifyMedicationDescriptionInTxtDownload = text => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    const now = new Date();
    const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    const fileName = `${downloadsFolder}/VA-medications-details-Safari-Mhvtp-${date}.txt`;
    cy.readFile(fileName).then(fileContent => {
      expect(fileContent).to.contain(text);
    });
  };

  verifyTrackingAlertHeaderOnDetailsPage = text => {
    cy.get('[data-testid="track-package"]').should('contain', text);
  };

  verifyTrackingNumberForShippedPrescriptionOnDetailsPage = text => {
    cy.get('[data-testid="tracking-number"]').should('contain', text);
  };

  verifyPrescriptionInformationInTrackingAlertOnDetailsPage = (text, name) => {
    cy.get('[data-testid="prescription-info"]').should('contain', text);
    cy.get('[data-testid="rx-name"]').should('contain', name);
  };

  verifyLastFilledDateInAccordionOnDetailsPage = text => {
    cy.get('[data-testid="accordion-fill-date-info"]')
      .shadow({ force: true })
      .find('[class="va-accordion__subheader"]', { force: true })
      .should('contain', text);
  };

  verifyShippedOnDateNotAvailableTextInRefillAccordion = text => {
    cy.get('[data-testid="shipped-on"]').should('contain', text);
  };

  verifyRxRfDispensedDateOnStepTwoProgressTracker = text => {
    cy.get('[data-testid="active-step-two"] > .vads-u-color--gray-dark').should(
      'be.visible',
    );
    const apiDate = text;
    const expectedDate = 'March 22, 2024';
    const parsedDate = new Date(apiDate);
    const timeZone = 'America/New_York';
    const zonedDate = utcToZonedTime(parsedDate, timeZone);
    // Format the date to match the UI format
    const formattedDate = format(zonedDate, DATETIME_FORMATS.longMonthDate);
    cy.get('[data-testid="active-step-two"] > .vads-u-color--gray-dark').should(
      'have.text',
      `Completed on ${expectedDate}`,
    );
    expect(formattedDate).to.equal(expectedDate);
  };

  formatToEDTString(date) {
    return `${date
      .toLocaleString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York',
        hour12: false,
      })
      .replace(',', '')
      .replace(' at', '')} EDT`;
  }

  updateCompleteDateTime(data, prescriptionName) {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    const formattedDate = this.formatToEDTString(fourteenDaysAgo);

    return {
      ...data,
      data: data.data.map(
        item =>
          item.attributes.prescriptionName === prescriptionName
            ? {
                ...item,
                attributes: {
                  ...item.attributes,
                  tracking: true,
                  trackingList: [
                    {
                      ...item.attributes.trackingList[0],
                      completeDateTime: formattedDate,
                    },
                  ],
                },
              }
            : item,
      ),
    };
  }

  updateRefillAndCompleteDates = (
    data,
    prescriptionName,
    refillDateOffset = 15,
  ) => {
    const currentDate = new Date();

    // Fixed completeDateTime to 14 days ago (T-14)
    const completeDate = new Date(currentDate);
    completeDate.setDate(currentDate.getDate() - 13);

    // Dynamic refillDate based on the provided offset
    const refillDate = new Date(currentDate);
    refillDate.setDate(currentDate.getDate() + refillDateOffset);

    return {
      ...data,
      data: data.data.map(
        item =>
          item.attributes.prescriptionName === prescriptionName
            ? {
                ...item,
                attributes: {
                  ...item.attributes,
                  refillDate:
                    item.attributes.refillDate != null
                      ? refillDate.toISOString()
                      : null,
                  tracking: true, // Ensure tracking is enabled
                  trackingList: item.attributes.trackingList?.length
                    ? [
                        {
                          ...item.attributes.trackingList[0],
                          completeDateTime: completeDate.toISOString(), // Fixed completeDateTime
                        },
                      ]
                    : [],
                },
              }
            : item,
      ),
    };
  };

  verifyRxNumberNotVisibleOnPendingMedicationsDetailsPage = PrescriptionNumber => {
    cy.get('[data-testid="va-prescription-container"]').should(
      'not.contain',
      PrescriptionNumber,
    );
  };

  verifyRefillHistorySectionNotVisibleForPendingPrescriptions = () => {
    cy.get('[data-testid="refill-History"]').should('not.exist');
  };

  verifyProviderFirstLastNameOnDetailsPage = FullName => {
    cy.get('[data-testid="prescribed-by"]').should('have.text', FullName);
  };

  verifyDocumentedByFullNameOnNonVAMedicationDetailsPage = FullName => {
    cy.get('[data-testid="rx-documented-by"]').should('have.text', FullName);
  };

  verifyResponseForRecordNotFoundForStandardizeErrorMessage = () => {
    cy.wait('@errorResponse').then(interception => {
      expect(interception.response.body.errors[0].status).to.eq('404');
      expect(interception.response.body.errors[0].code).to.eq('404');
      expect(interception.response.body.errors[0].title).to.eq(
        'Record not found',
      );
      expect(interception.response.body.errors[0].detail).to.eq(
        'The record identified by 232323 could not be found',
      );
    });
  };

  verifyNotesAboutPrescriptionImagesOnDetailsPage = text => {
    cy.get('[data-testid="note-images"]')
      .should('be.visible')
      .and('contain', text);
  };
}

export default MedicationsDetailsPage;
