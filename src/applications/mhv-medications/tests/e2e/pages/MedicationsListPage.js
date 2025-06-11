import moment from 'moment-timezone';
import prescriptions from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';
import allergiesList from '../fixtures/allergies-list.json';
import tooltip from '../fixtures/tooltip-for-filtering-list-page.json';
import activeRxRefills from '../fixtures/active-prescriptions-with-refills.json';
import { Paths } from '../utils/constants';
import nonVARx from '../fixtures/non-VA-prescription-on-list-page.json';
import prescription from '../fixtures/prescription-details.json';
import prescriptionFillDate from '../fixtures/prescription-dispensed-datails.json';
import { medicationsUrls } from '../../../util/constants';
import tooltipVisible from '../fixtures/tooltip-visible-list-page.json';
import noToolTip from '../fixtures/tooltip-not-visible-list-page.json';
import hidden from '../fixtures/tooltip-hidden.json';

class MedicationsListPage {
  clickGotoMedicationsLink = (waitForMeds = false) => {
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept('GET', `${Paths.MED_LIST}`).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&filter[[disp_status][eq]]=Active:%20Refill%20in%20Process,Active:%20Submitted&sort=alphabetical-rx-name',
      prescriptions,
    ).as('medicationsSortByName');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');
    cy.intercept('GET', Paths.MED_LIST, prescriptions).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
    if (waitForMeds) {
      cy.wait('@medicationsList');
    }
  };

  clickGotoMedicationsLinkForListPageAPICallFail = () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);

    cy.intercept('GET', Paths.MED_LIST, { forceNetworkError: true }).as(
      'medicationsList',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
  };

  visitMedicationsLinkWhenNoAllergiesAPICallFails = (waitForMeds = false) => {
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept('GET', Paths.MED_LIST, prescriptions).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    cy.visit(medicationsUrls.MEDICATIONS_URL);
    if (waitForMeds) {
      cy.wait('@medicationsList');
    }
  };

  visitMedicationsListForUserWithAllergies = (waitForMeds = false) => {
    // cy.intercept('GET', '/my-health/medications', prescriptions);
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergiesList,
    ).as('allergiesList');
    cy.intercept('GET', Paths.MED_LIST, prescriptions).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    cy.visit(medicationsUrls.MEDICATIONS_URL);
    if (waitForMeds) {
      cy.wait('@medicationsList');
    }
  };

  verifyAllergiesListNetworkResponseWithAllergyTypeReported = (
    valueCode,
    allergy,
  ) => {
    cy.get('@allergiesList')
      .its('response')
      .then(res => {
        expect(res.body.entry[allergy].resource.extension[allergy]).to.include({
          valueCode,
        });
      });
  };

  verifyAllergiesListNetworkResponseWithAllergyTypeObserved = (
    valueCode,
    allergy,
    listNumber,
  ) => {
    cy.get('@allergiesList')
      .its('response')
      .then(res => {
        expect(
          res.body.entry[allergy].resource.extension[listNumber],
        ).to.include({
          valueCode,
        });
      });
  };

  verifyAllergiesListNetworkResponseURL = (url, allergy) => {
    cy.get('@allergiesList')
      .its('response')
      .then(res => {
        expect(
          res.body.entry[allergy].resource.extension[allergy].url,
        ).to.include(url);
      });
  };

  verifyAllergiesListContainedResourceOrgName = (orgName, allergy) => {
    cy.get('@allergiesList')
      .its('response')
      .then(res => {
        expect(
          res.body.entry[allergy].resource.contained[allergy].name,
        ).to.include(orgName);
      });
  };

  verifyZeroAllergiesOnNetworkResponseForUserWithNoAllergies = totalAllergies => {
    cy.get('@allergies')
      .its('response')
      .then(res => {
        expect(res.body.total).to.eq(totalAllergies);
      });
  };

  clickPrintThisPageOfTheListButtonOnListPage = () => {
    cy.get('[data-testid="download-print-button"]').should('exist');
    cy.get('[data-testid="download-print-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyPrintErrorMessageForAllergiesAPICallFail = () => {
    cy.get('[data-testid="no-medications-list"]').should(
      'contain',
      'We can’t print your records right now',
    );
  };

  verifyDownloadErrorMessageForAllergiesAPICallFail = () => {
    cy.get('[data-testid="no-medications-list"]').should(
      'contain',
      'We can’t download your records right now',
    );
  };

  verifyFocusOnDownloadFailureAlertBanner = () => {
    cy.get('[data-testid="api-error-notification"]').should('be.focused');
  };

  verifyTextInsideDropDownOnListPage = () => {
    cy.get('[data-testid="dropdown-info"]').should(
      'contain',
      'If you’re on a public or shared computer',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.get('[data-testid="before-download"]').should('be.visible');
    cy.get('[data-testid="before-download"]').click({
      waitForAnimations: true,
    });
  };

  verifyLearnHowToRenewPrescriptionsLinkExists = () => {
    cy.get('[data-testid="learn-to-renew-precsriptions-link"]').should('exist');
  };

  verifyLearnHowToRenewPrescriptionsLink = () => {
    cy.get('[data-testid="learn-to-renew-precsriptions-link"]');
    cy.get('[data-testid="learn-to-renew-precsriptions-link"]')

      .shadow()
      .find(`[href="/resources/how-to-renew-a-va-prescription"]`)
      .should('be.visible');
  };

  clickPrintOrDownloadThisListDropDown = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyFocusOnPrintDownloadDropDownButton = () => {
    cy.get('[data-testid="print-records-button"]').should('have.focus');
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
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength}  medications, alphabetically by status`,
      );
    });
  };

  clickDownloadListAsPDFButtonOnListPage = () => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?&sort=alphabetical-status`,
      prescriptions,
    ).as('medicationsList');
    cy.get('[data-testid="download-pdf-button"]')
      .should('contain', 'Download a PDF of all medications')
      .should('be.visible');
    cy.get('[data-testid="download-pdf-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyLoadingSpinnerForDownloadOnListPage = () => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?&sort=alphabetical-status`,
      prescriptions,
    ).as('medicationsList');
    cy.get('[data-testid="print-download-loading-indicator"]').should('exist');
  };

  clickDownloadListAsTxtButtonOnListPage = () => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?&sort=alphabetical-status`,
      prescriptions,
    ).as('medicationsList');
    cy.get('[data-testid="download-txt-button"]').should(
      'contain',
      'Download a text file',
    );
    cy.get('[data-testid="download-txt-button"]').click({
      force: true,
    });
  };

  verifyDownloadCompleteSuccessMessageBanner = text => {
    cy.intercept('GET', Paths.MED_LIST, prescriptions).as('medicationsList');
    cy.get('[data-testid="download-success-banner"]')
      .should('contain', 'Download started')
      .and('contain', text);
  };

  verifyFocusOnDownloadAlertSuccessBanner = () => {
    cy.get('[data-testid="download-success-banner"] > .hydrated').should(
      'be.focused',
    );
  };

  verifyDownloadSuccessMessageBannerNotVisibleAfterReload = () => {
    cy.get('[data-testid="download-success-banner"]').should('not.exist');
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

  verifyInformationBasedOnStatusActiveRefillInProcess = text => {
    cy.get('[data-testid="rx-refillinprocess-info"]')
      .should('exist')
      .and('be.visible')
      .and('contain', text);
  };

  verifyInformationBasedOnStatusNonVAPrescription = text => {
    cy.get('[data-testid="rx-last-filled-info"]').should('be.visible');

    cy.get('[data-testid="non-VA-prescription"]')
      .should('be.visible')
      .and('contain', text);
  };

  verifyInformationBasedOnStatusActiveParked = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(11) > [data-testid="rx-card-info"] > [data-testid="rxStatus"]',
    )
      // cy.get(':nth-child(5) > .rx-card-detials > [data-testid="rxStatus"]')
      .should('be.visible')
      .and('contain', 'Active: Parked');
  };

  verifyInformationBasedOnStatusActiveOnHold = () => {
    cy.get('[data-testid="active-onHold"]')
      .should('be.visible')
      .and('contain', 'You can’t refill this prescription online right now.');
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
      .and('contain', 'This prescription is too old to refill. ');
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

  verifyInformationBasedOnStatusUnknown = unknownPrescription => {
    cy.get(
      `[data-testid="medication-list"] > :nth-child(7) > [data-testid="rx-card-info"] > #status-description-${unknownPrescription} > [data-testid="unknown"] > :nth-child(2) > :nth-child(1)`,
    )
      .should('be.visible')
      .and('contain', 'We’re sorry. There’s a problem with our system.');
  };

  verifyInformationBasedOnStatusActiveRefillsLeft = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(2) > [data-testid="rx-card-info"] > :nth-child(4)',
    ).should(
      'contain',
      `${activeRxRefills.data.attributes.refillRemaining} refills left`,
    );
  };

  verifyInformationBaseOnStatusSubmitted = () => {
    cy.get('[data-testid="submitted-refill-request"]')
      .should('be.visible')
      .and(
        'contain',
        'We got your request on October 2, 2023. Check back for updates.',
      );
  };

  verifyNonVAPrescriptionNameOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(5) > [data-testid="rx-card-info"] > [data-testid="medications-history-details-link"]',
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

  loadRxDefaultSortAlphabeticallyByStatus = () => {
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
  };

  sortPrescriptionsByStatusNameAndFillDate = data => {
    return {
      ...data,
      data: data.data
        .slice() // Create a shallow copy to avoid mutating the original array
        .sort((a, b) => {
          // Sort by status alphabetically
          const statusA = a.attributes.dispStatus?.toLowerCase() || '';
          const statusB = b.attributes.dispStatus?.toLowerCase() || '';
          if (statusA < statusB) return -1;
          if (statusA > statusB) return 1;
          // If statuses are the same, sort by medication name alphabetically
          const nameA = a.attributes.prescriptionName?.toLowerCase() || '';
          const nameB = b.attributes.prescriptionName?.toLowerCase() || '';
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          // If names are the same, sort by fill date in descending order
          const fillDateA = new Date(a.attributes.dispensedDate || 0);
          const fillDateB = new Date(b.attributes.dispensedDate || 0);
          return fillDateB - fillDateA;
        }),
    };
  };

  validateMedicationsListSortedAlphabeticallyByStatus = sortedData => {
    cy.get('[data-testid="medications-history-details-link"]').then(
      $nameEls => {
        const seen = new Set();
        const actualUniqueNames = [...$nameEls]
          .map(el => el.textContent.trim())
          .filter(name => {
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
          });

        const expectedUniqueNames = sortedData.data.map(
          rx => rx.attributes.prescriptionName,
        );
        expect(actualUniqueNames).to.deep.equal(
          expectedUniqueNames.slice(0, actualUniqueNames.length),
        );
      },
    );
  };

  verifyPaginationDisplayedforSortAlphabeticallyByStatus = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength}  medications, alphabetically by status`,
      );
    });
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    ).as('medicationList');
  };

  loadRxAfterSortAlphabeticallyByName = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20null&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      prescriptions,
    );
    // cy.intercept(
    //   '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=prescription_name&sort[]=dispensed_date',
    //   // prescriptions,
    //   req => {
    //     return Cypress.Promise.delay(500).then(() => req.continue());
    //   },
    // ).as('prescriptions');

    // cy.get('[data-testid="loading-indicator"]').should('exist');
  };

  sortPrescriptionsByNameAndLastFillDate = data => {
    return {
      ...data,
      data: data.data.slice().sort((a, b) => {
        const nameA = a.attributes.prescriptionName?.toLowerCase() || '';
        const nameB = b.attributes.prescriptionName?.toLowerCase() || '';
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        // If names are the same, sort by fill date in descending order
        const fillDateA = new Date(a.attributes.dispensedDate || 0);
        const fillDateB = new Date(b.attributes.dispensedDate || 0);
        return fillDateB - fillDateA;
      }),
    };
  };

  validateMedicationsListSortedAlphabeticallyByName = sortedData => {
    cy.get('[data-testid="medications-history-details-link"]').then(
      $nameEls => {
        const actualNames = [...$nameEls]
          .map(el => el.textContent.trim())
          .slice(0, 20);
        const expectedNames = sortedData.data
          .map(rx => rx.attributes.prescriptionName)
          .slice(0, 20);
        expect(actualNames).to.deep.equal(expectedNames);
      },
    );
  };

  verifyPaginationDisplayedforSortAlphabeticallyByName = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20null&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    );
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength}  medications, alphabetically by name`,
      );
    });
    cy.get('[data-testid="page-total-info"]').should('be.focused');
  };

  loadRxAfterSortLastFilledFirst = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=-dispensed_date&sort[]=prescription_name&include_image=true',
      prescriptions,
    );
    // cy.intercept(
    //   '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
    //   req => {
    //     return Cypress.Promise.delay(500).then(() => req.continue());
    //   },
    // ).as('prescriptions');

    // cy.get('[data-testid="loading-indicator"]').should('exist');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20null&sort[]=-dispensed_date&sort[]=prescription_name',
      prescriptions,
    );
  };

  verifyPaginationDisplayedforSortLastFilledFirst = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength}  medications, last filled first`,
      );
    });
  };

  verifyLastFilledDateforPrescriptionOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(2) > [data-testid="rx-card-info"] > [data-testid="rx-last-filled-date"]',
    ).should(
      'contain',
      `${prescriptionFillDate.data.attributes.sortedDispensedDate}`,
    );
  };

  verifyDiscontinuedMedicationNameIsVisibleOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(6) > [data-testid="rx-card-info"] > [data-testid="medications-history-details-link"]',
    ).should('be.visible');
  };

  verifyPrescriptionExpirationDateforRxOver180Days = expiredPrescription => {
    cy.get('@Medications')
      .its('response')
      .then(res => {
        expect(res.body.data[14].attributes).to.include({
          expirationDate: `${
            expiredPrescription.data.attributes.expirationDate
          }`,
        });
      });
  };

  verifyCmopNdcNumberIsNull = () => {
    cy.wait('@Medications').then(interception => {
      expect(interception.response.body.data[1].attributes).to.include({
        cmopNdcNumber: null,
      });
    });
  };

  verifyPrescriptionSourceForNonVAMedicationOnDetailsPage = () => {
    cy.get('@Medications')
      .its('response')
      .then(res => {
        expect(res.body.data[4].attributes).to.include({
          prescriptionSource: 'NV',
        });
      });
  };

  verifyPrescriptionNumberIsVisibleOnRxCardOnListPage = prescriptionNumber => {
    cy.get('[data-testid="rx-number"]')
      .first()
      .should('contain', prescriptionNumber);
  };

  verifyMedicationsListPageTitle = () => {
    cy.get('[data-testid="list-page-title"]').should(
      'have.text',
      'Medications',
    );
  };

  verifyAboutMedicationsBreadcrumbTextOnListPage = () => {
    cy.get('[href="/my-health/medications/about"]').should(
      'contain',
      'About medications',
    );
  };

  verifyMedicationDescriptionDetails = (
    shape,
    color,
    frontImprint,
    backImprint,
  ) => {
    cy.wait('@Medications').then(interception => {
      expect(interception.response.body.data[19].attributes).to.include({
        shape,
        color,
        frontImprint,
        backImprint,
      });
    });
  };

  verifyPrintThisPageOptionFromDropDownMenuOnListPage = () => {
    cy.get('[data-testid="download-print-button"]').should('be.enabled');
  };

  verifyPrintAllMedicationsFromDropDownOnListPage = () => {
    cy.get('[data-testid="download-print-all-button"]').should('be.enabled');
  };

  verifyPharmacyPhoneNumberOnListPage = phoneNumber => {
    cy.get(
      '[data-testid="active-onHold"] > [data-testid="pharmacy-phone-number"]',
    )
      .shadow()
      .find('[href="tel:+19832720905"]')
      .should('contain', phoneNumber);
  };

  verifyShippedOnInformationOnRxCardOnMedicationsListPage = shippedDate => {
    cy.get(
      ' [data-testid="rx-card-details--shipped-on"] > [data-testid="shipping-date"]',
    ).should('contain', shippedDate);
  };

  verifyRFRecordPhoneNumberOnListPage = rfPhoneNumber => {
    cy.get(
      '[data-testid="refill-in-process"] > [data-testid="rx-process"] > [data-testid="pharmacy-phone-info"] > [data-testid="pharmacy-phone-number"]',
    )
      .shadow()
      .find('[href="tel:+14106366899"]')
      .should('contain', rfPhoneNumber);
  };

  verifyUnknownRxPhoneNumberOnListPage = unknownPhoneNumber => {
    cy.get(
      '[data-testid="unknown"] > [data-testid="unknown-rx"] > :nth-child(2) > [data-testid="pharmacy-phone-number"]',
    )
      .shadow()
      .find('[href="tel:+17832721069"]')
      .should('contain', unknownPhoneNumber);
  };

  verifyAllergiesAndReactionsLinkOnMedicationsListPage = () => {
    cy.get('[data-testid="allergies-link"]').should(
      'contain',
      'Go to your allergies and reactions',
    );
  };

  verifyRefillPageLinkTextOnMedicationsListPage = () => {
    cy.get('[data-testid="prescriptions-nav-link-to-refill"]').should(
      'contain',
      'Start a refill request',
    );
  };

  verifyMedicationsListHeaderTextOnListPage = () => {
    cy.get('[data-testid="med-list"]').should('have.text', 'Medications list');
  };

  verifyFilterAccordionOnMedicationsListPage = () => {
    cy.get('[data-testid="filter-accordion"]').should('be.visible');
  };

  verifyLabelTextWhenFilterAccordionExpanded = () => {
    cy.get('[data-testid="filter-option"]')
      .shadow()
      .find('[class="usa-legend"]', { force: true })
      .should('contain', 'Select a filter');
  };

  clickfilterAccordionDropdownOnListPage = () => {
    cy.get('[data-testid="rx-filter"]').should('exist');
    cy.get('[data-testid="rx-filter"]').click({ waitForAnimations: true });
  };

  verifyFilterOptionsOnListPage = (text, description) => {
    cy.get(`[label="${text}"]`)
      .should('be.visible')
      .and('contain', description);
  };

  clickFilterRadioButtonOptionOnListPage = option => {
    cy.contains(`${option}`).click({ force: true });
  };

  verifyFilterHeaderTextHasFocusafterExpanded = () => {
    cy.get('[data-testid="rx-filter"]')
      .shadow()
      .find('[type="button"]')
      .should('have.text', 'Filter list')
      .and('have.focus');
  };

  verifyFilterButtonWhenAccordionExpanded = () => {
    cy.get('[data-testid="filter-button"]')
      .shadow()
      .find('[type="button"]')
      .should('be.visible')
      .and('have.text', 'Apply filter');
  };

  clickFilterButtonOnAccordion = (url, filterRx) => {
    cy.intercept('GET', `${url}`, filterRx);
    cy.get('[data-testid="filter-button"]')
      .shadow()
      .find('[type="button"]')
      .click({ waitForAnimations: true });
  };

  verifyNameOfFirstRxOnMedicationsList = rxName => {
    cy.get(
      '.landing-page-content > [data-testid="medication-list"] > :nth-child(1) > [data-testid="rx-card-info"] > [data-testid="medications-history-details-link"]',
    ).should('contain', rxName);
  };

  verifyAllMedicationsRadioButtonIsChecked = () => {
    cy.contains('All medications').should('be.visible');
    cy.get('[data-testid="filter-button"]')
      .shadow()
      .find('[type="button"],[value="ALL Medications"],[aria-checked="true"]', {
        force: true,
      })
      .should('exist');
  };

  verifyFocusOnPaginationTextInformationOnListPage = text => {
    cy.get('[data-testid="page-total-info"]')
      .should('be.focused')
      .and('contain', text);
  };

  verifyFilterCollapsedOnListPage = () => {
    cy.get('[data-testid="filter-button"]').should('not.be.visible');
    cy.get('[data-testid="filter-option"]').should('not.be.visible');
  };

  visitMedicationsListPageURL = medication => {
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, medication).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');
    cy.intercept('GET', '/my_health/v1/tooltips', tooltip).as('tooltips');
    cy.intercept('GET', `${Paths.MED_LIST}`, medication).as('Medications');
    cy.intercept('POST', '/my_health/v1/tooltips', tooltipVisible).as(
      'tooltipsVisible',
    );
    cy.visit(medicationsUrls.MEDICATIONS_URL);
  };

  verifyEmptyMedicationsListAlertOnListPage = text => {
    cy.get('[data-testid="empty-medList-alert"]').should('have.text', text);
  };

  verifyMessageForZeroFilterResultsOnListPage = text => {
    cy.get('[data-testid="zero-filter-results"]')
      .should('have.text', text)
      .and('be.focused');
  };

  verifyNoMedicationsInListMessageNotShown = () => {
    cy.get('[data-testid="alert-message"]').should('not.exist');
  };

  clickResetFilterButtonOnFilterAccordionDropDown = () => {
    cy.get('[data-testid="filter-reset-button"]').should('exist');
    cy.get('[data-testid="filter-reset-button"]').click({
      waitForAnimations: true,
    });
  };

  clickBackToTopButtonOnListPage = () => {
    cy.get('[data-testid="rx-back-to-top"]')
      .should('exist')
      .and('be.visible');
    cy.get('[data-testid="rx-back-to-top"]', { includeShadowDom: true })
      .find('[class ="text"]')
      .click({ force: true });
  };

  verifyMedicationsListPageTitleIsFocused = () => {
    cy.get('[data-testid="list-page-title"]')
      .should('be.visible')
      .and('be.focused');
  };

  verifyPrecriptionNumberForPendingRxOnMedicationCard = (
    prescriptionNumber,
    cardNumber,
  ) => {
    cy.get(
      `[data-testid="medication-list"] > :nth-child(${cardNumber}) > [data-testid="rx-card-info"] > [data-testid="rx-number"]`,
    )
      .first()
      .should('contain', prescriptionNumber);
  };

  verifyPendingNewRxInfoTextOnMedicationCardOnListPage = text => {
    cy.get('[data-testid="pending-renewal-rx"]')
      .first()
      .should('be.visible')
      .and('have.text', text);
  };

  verifyPendingRenewalInfoTextOnMedicationCardOnListPage = text => {
    cy.get('[data-testid="pending-renewal-rx"]')
      .should('be.visible')
      .and('contain', text);
  };

  updatedOrderDates = data => {
    const currentDate = new Date();
    return {
      ...data,
      data: data.data.map(item => {
        const newOrderedDate = new Date(currentDate);
        newOrderedDate.setDate(currentDate.getDate());
        return {
          ...item,
          attributes: {
            ...item.attributes,
            orderedDate:
              item.attributes.orderedDate != null
                ? newOrderedDate.toISOString()
                : null,
          },
        };
      }),
    };
  };

  verifyRefillDelayAlertBannerOnListPage = text => {
    cy.get('[data-testid="rxDelay-alert-message"]').should('have.text', text);
  };

  verifyRefillDetailsLinkVisibleOnDelayAlertBanner = rxName => {
    cy.get('[data-testid="alert-banner"]').should('contain', rxName);
  };

  clickMedicationsDetailsLinkOnDelayAlert = (prescriptionId, rx) => {
    cy.intercept('GET', `/my_health/v1/prescriptions/${prescriptionId}`, rx);
    cy.get(`[data-testid="refill-alert-link-${prescriptionId}"]`).click({
      force: true,
    });
  };

  verifyNeedHelpSectionOnListPage = text => {
    cy.get('[data-testid="rx-need-help-container"]')
      .should('contain', text)
      .and('be.visible');
  };

  verifyGoToUseMedicationLinkOnListPage = () => {
    cy.get('[data-testid="go-to-use-medications-link"]').should('be.visible');
  };

  verifyStartANewMessageLinkOnListPage = () => {
    cy.get('[data-testid="start-a-new-message-link"]').should('be.visible');
  };

  verifyTitleNotesOnListPage = text => {
    cy.get('[data-testid="Title-Notes"]').should('contain', text);
  };

  verifyToolTipTextOnListPage = text => {
    cy.get('#rx-ipe-filtering-description')
      .should('contain', text)
      .and('be.visible');
  };

  verifyToolTipNotVisibleOnListPage = () => {
    cy.get('[data-testid="rx-ipe-filtering-stop-showing-this-hint"]').should(
      'not.exist',
    );
  };

  clickStopShowingThisHintLinkOnListPage = () => {
    cy.intercept(
      'PATCH',
      'my_health/v1/tooltips/ad9ced53-3d27-4183-8b35-7c3cab737ce1',
      noToolTip,
    ).as('noToolTip');
    cy.get('[data-testid="rx-ipe-filtering-stop-showing-this-hint"]').click({
      force: true,
    });
  };

  verifyFilterAccordionDropDownIsFocused = () => {
    cy.get('[data-testid="rx-filter"]').should('have.focus');
  };

  updatedRefillDates = data => {
    const currentDate = new Date();
    return {
      ...data,
      data: data.data.map(item => {
        const newRefillDate = new Date(currentDate);
        newRefillDate.setDate(currentDate.getDate() + 6);
        return {
          ...item,
          attributes: {
            ...item.attributes,
            refillDate:
              item.attributes.refillDate != null
                ? newRefillDate.toISOString()
                : null,
          },
        };
      }),
    };
  };

  verifyToolTipCounterSetToZero = () => {
    cy.get('@tooltipsVisible')
      .its('response')
      .then(res => {
        expect(res.body.counter).to.eq(0);
      });
  };

  verifyErroMessageforFailedAPICallListPage = text => {
    cy.get('[data-testid="no-medications-list"]').should('contain', text);
  };

  loadListPageWithoutToolTip = () => {
    cy.intercept('GET', '/my_health/v1/tooltips', hidden).as('tooltips');
    cy.visit(medicationsUrls.MEDICATIONS_URL);
  };

  verifyContentInListPageDownload = text => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    const pad = n => n.toString().padStart(2, '0');
    let hours = text.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}${pad(text.getMinutes())}${pad(
      text.getSeconds(),
    )}${ampm}`;
    const date = `${text.getMonth() +
      1}-${text.getDate()}-${text.getFullYear()}_${formattedTime}`;
    const fileName = `${downloadsFolder}/VA-medications-list-Safari-Mhvtp-${date}.txt`;
    cy.readFile(fileName).then(fileContent => {
      expect(fileContent).to.contain('not available');
      expect(fileContent).to.not.contain('None noted');
    });
  };
}

export default MedicationsListPage;
