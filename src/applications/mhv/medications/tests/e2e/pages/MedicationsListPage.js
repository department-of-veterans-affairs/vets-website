import moment from 'moment-timezone';
import prescriptions from '../fixtures/prescriptions.json';
import allergies from '../fixtures/allergies.json';
import parkedRx from '../fixtures/parked-prescription-details.json';
import activeRxRefills from '../fixtures/active-prescriptions-with-refills.json';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';
import nonVARx from '../fixtures/non-VA-prescription-on-list-page.json';
import prescription from '../fixtures/prescription-details.json';
import prescriptionFillDate from '../fixtures/prescription-dispensed-datails.json';

class MedicationsListPage {
  clickGotoMedicationsLink = (waitForMeds = false) => {
    // cy.intercept('GET', '/my-health/medications', prescriptions);
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
      prescriptions,
    ).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=-dispensed_date&sort[]=prescription_name&include_image=true',
      prescriptions,
    );
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
    if (waitForMeds) {
      cy.wait('@medicationsList');
    }
  };

  clickGotoMedicationsLinkforEmptyMedicationsList = () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
      emptyPrescriptionsList,
    );
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
  };

  verifyTextInsideDropDownOnListPage = () => {
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

  verifyLearnHowToRenewPrescriptionsLinkExists = () => {
    cy.get('[data-testid="active-no-refill-left"]');
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]').should('exist');
  };

  clickLearnHowToRenewPrescriptionsLink = () => {
    cy.get('[data-testid="active-no-refill-left"]');
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]')

      .shadow()
      .find('[href="/my-health/medications/about/accordion-renew-rx"]')
      .first()
      .click({ waitForAnimations: true });
  };

  clickPrintOrDownloadThisListDropDown = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyPrintMedicationsListEnabledOnListPage = () => {
    cy.get('[data-testid="print-records-button"] > span').should(
      'contain',
      'Print or download',
    );
    cy.contains('Print or download').should('be.enabled');
  };

  verifyNavigationToListPageAfterClickingBreadcrumbMedications = () => {
    cy.get('[data-testid="list-page-title"]')
      .should('have.text', 'Medications')
      .should('be.visible');
  };

  verifyNavigationToListPageTwoAfterClickingBreadcrumbMedications = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="page-total-info"]')
      .first()
      .should(
        'have.text',
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength} medications, last filled first`,
      );
  };

  clickDownloadListAsPDFButtonOnListPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('contain', 'Download a PDF of this list')
      .should('be.visible');
    cy.get('[data-testid="download-pdf-button"]').click({
      waitForAnimations: true,
    });
  };

  clickDownloadListAsTxtButtonOnListPage = () => {
    cy.get('[data-testid="download-txt-button"]').should(
      'contain',
      'Download a text file',
    );
    cy.get('[data-testid="download-txt-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyDownloadCompleteSuccessMessageBanner = () => {
    cy.get('[data-testid="download-success-banner"]').should(
      'contain',
      'Download complete',
    );
  };

  verifyDownloadTextFileHeadless = (
    userFirstName = 'Safari',
    userLastName = 'Mhvtp',
    searchText = 'Date',
  ) => {
    this.downloadTime1sec = moment()
      .add(1, 'seconds')
      .format('M-D-YYYY_hhmmssa');
    this.downloadTime2sec = moment()
      .add(2, 'seconds')
      .format('M-D-YYYY_hhmmssa');
    this.downloadTime3sec = moment()
      .add(3, 'seconds')
      .format('M-D-YYYY_hhmmssa');

    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/VA-medications-list-${userFirstName}-${userLastName}-${
        this.downloadTime1sec
      }.txt`;
      const txtPath2 = `${downloadsFolder}/VA-medications-list-${userFirstName}-${userLastName}-${
        this.downloadTime2sec
      }.txt`;
      const txtPath3 = `${downloadsFolder}/VA-medications-list-${userFirstName}-${userLastName}-${
        this.downloadTime3sec
      }.txt`;
      this.internalReadFileMaybe(txtPath1, searchText);
      this.internalReadFileMaybe(txtPath2, searchText);
      this.internalReadFileMaybe(txtPath3, searchText);
    } else {
      cy.log('browser is not headless');
    }
  };

  internalReadFileMaybe = (fileName, searchText) => {
    cy.task('log', `attempting to find file = ${fileName}`);
    cy.task('readFileMaybe', fileName).then(textOrNull => {
      const taskFileName = fileName;
      if (textOrNull != null) {
        cy.task('log', `found the text in ${taskFileName}`);
        cy.readFile(fileName).should('contain', `${searchText}`);
      }
    });
  };

  verifyInformationBasedOnStatusActiveNoRefillsLeft = () => {
    cy.get('[data-testid="active-no-refill-left"]')
      .should('be.visible')
      .and(
        'contain',
        'You have no refills left. If you need more, request a renewal.',
      );
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]')
      .should('exist')
      .and('be.visible');
  };

  verifyInformationBasedOnStatusActiveRefillInProcess = () => {
    cy.get('[data-testid="rx-refillinprocess-info"]')
      .should('exist')
      .and('be.visible')
      .and('contain', 'We expect to fill it on');
  };

  verifyInformationBasedOnStatusNonVAPrescription = () => {
    cy.get('[data-testid="rx-last-filled-info"]').should('be.visible');

    cy.get('[data-testid="non-VA-prescription"]')
      .should('be.visible')
      .and(
        'contain',
        'This isn’t a prescription that you filled through a VA pharmacy. You can’t manage this medication in this online tool.',
      );
  };

  verifyInformationBasedOnStatusActiveParked = () => {
    cy.get(
      `#card-header-${
        parkedRx.data.id
      } > [data-testid="medications-history-details-link"]`,
    ).should('be.visible');

    cy.get(
      '[data-testid="medication-list"] > :nth-child(5) > [data-testid="rx-card-info"] > [data-testid="rxStatus"]',
    )
      // cy.get(':nth-child(5) > .rx-card-detials > [data-testid="rxStatus"]')
      .should('be.visible')
      .and('contain', 'Active: Parked');
  };

  verifyInformationBasedOnStatusActiveOnHold = () => {
    cy.get('[data-testid="active-onHold"]')
      .should('be.visible')
      .and(
        'contain',
        'We put a hold on this prescription. If you need it now, call your VA pharmacy.',
      );
  };

  verifyInformationBasedOnStatusDiscontinued = () => {
    cy.get('[data-testid="discontinued"]')
      .should('be.visible')
      .and(
        'contain',
        'You can’t refill this prescription. If you need more, send a message to your care team.',
      );
  };

  verifyInformationBasedOnStatusExpired = () => {
    cy.get('[data-testid="expired"]')
      .should('be.visible')
      .and('contain', 'If you need more, request a renewal.');
  };

  verifyInformationBasedOnStatusTransferred = () => {
    cy.get('[data-testid="transferred"]')
      .should('be.visible')
      .and(
        'contain',
        'To manage this prescription, go to our My VA Health portal.',
      );
    cy.get('[data-testid="prescription-VA-health-link"]').should('be.visible');
  };

  verifyInformationBasedOnStatusUnknown = () => {
    cy.get('[data-testid="unknown"] > div')
      .should('be.visible')
      .and('contain', 'We’re sorry. There’s a problem with our system.');
  };

  verifyInformationBasedOnStatusActiveRefillsLeft = () => {
    cy.get(
      `[aria-describedby="card-header-${activeRxRefills.data.id}"]`,
    ).should('exist');
    cy.get(
      '[data-testid="medication-list"] > :nth-child(2) > [data-testid="rx-card-info"] > :nth-child(3)',
    )

      // cy.get(':nth-child(2) > .rx-card-detials > :nth-child(3)')
      .should(
        'contain',
        `${activeRxRefills.data.attributes.refillRemaining} refills left`,
      );
  };

  verifyInformationBaseOnStatusSubmitted = () => {
    cy.get('[data-testid="submitted-refill-request"]')
      .should('be.visible')
      .and(
        'contain',
        'We got your request on October 4, 2023. Check back for updates.',
      );
  };

  verifyNonVAPrescriptionNameOnListPage = () => {
    cy.get(
      `#card-header-${
        nonVARx.data.id
      } > [data-testid="medications-history-details-link"]`,
    ).should('contain', `${nonVARx.data.attributes.prescriptionName}`);
  };

  clickRefillButton = () => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/${
        prescription.data.attributes.prescriptionId
      }/refill`,
      prescription,
    );
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) > [data-testid="rx-card-info"] > [data-testid="fill-refill"] > [data-testid="refill-request-button"]',
    ).should('be.enabled');

    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) > [data-testid="rx-card-info"] > [data-testid="fill-refill"] > [data-testid="refill-request-button"]',
    )
      .first()
      .click({ waitForAnimations: true });
  };

  verifySuccessMessageAfterRefillRequest = () => {
    cy.get('[data-testid="success-message"]').should(
      'contain',
      'We got your request to fill this prescription.',
    );
    // .and('have.focus');
  };

  clickRefillButtonForVerifyingError = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) > [data-testid="rx-card-info"] > [data-testid="fill-refill"] > [data-testid="refill-request-button"]',
    );
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) > [data-testid="rx-card-info"] > [data-testid="fill-refill"] > [data-testid="refill-request-button"]',
    )
      .first()
      .click({ waitForAnimations: true });
  };

  verifyInlineErrorMessageForRefillRequest = () => {
    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'We didn’t get your request. Try again',
    );
  };

  selectSortDropDownOption = text => {
    cy.get('[data-testid="sort-dropdown"]')
      .find('#options')
      .select(text, { force: true });
  };

  clickSortAlphabeticallyByStatus = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    );
    cy.get('[data-testid="sort-button"]').should('be.visible');
    cy.get('[data-testid="sort-button"]').click({ waitForAnimations: true });
  };

  verifyPaginationDisplayedforSortAlphabeticallyByStatus = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="page-total-info"]').should(
      'contain',
      `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength} medications, alphabetically by status`,
    );
  };

  clickSortAlphabeticallyByName = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    );

    cy.get('[data-testid="sort-button"]').should('be.visible');
    cy.get('[data-testid="sort-button"]').click({ waitForAnimations: true });
  };

  verifyPaginationDisplayedforSortAlphabeticallyByName = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="page-total-info"]')
      .first()
      .should(
        'have.text',
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength} medications, alphabetically by name`,
      );
  };

  verifyLastFilledDateforPrescriptionOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(3) > [data-testid="rx-card-info"] > :nth-child(2) > [data-testid="rx-last-filled-date"]',
    ).should(
      'contain',
      `${prescriptionFillDate.data.attributes.sortedDispensedDate}`,
    );
  };

  verifyDiscontinuedMedicationNameIsVisibleOnListPage = prescriptionDetails => {
    cy.get(
      `#card-header-${
        prescriptionDetails.data.attributes.prescriptionId
      } > [data-testid="medications-history-details-link"]`,
    ).should('be.visible');
  };

  verifyPrescriptionExpirationDateforRxOver180Days = expiredPrescription => {
    // cy.intercept(
    //   'GET',
    //   'my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
    //   prescriptions,
    // ).as('medicationsList');
    cy.get('@medicationsList')
      .its('response')
      .then(res => {
        expect(res.body.data[15].attributes).to.include({
          expirationDate: `${
            expiredPrescription.data.attributes.expirationDate
          }`,
        });
      });
  };

  verifyPrescriptionNumberIsVisibleOnRxCardOnListPage = prescriptionNumber => {
    cy.get('[data-testid="rx-number"]')
      .first()
      .should('contain', prescriptionNumber);
  };
}
export default MedicationsListPage;
