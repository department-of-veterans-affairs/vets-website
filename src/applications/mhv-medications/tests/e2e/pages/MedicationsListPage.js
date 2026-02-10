import prescriptions from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';
import acceleratedAllergies from '../fixtures/accelerated-allergies.json';
import allergiesList from '../fixtures/allergies-list.json';
import tooltip from '../fixtures/tooltip-for-filtering-list-page.json';
import { Paths } from '../utils/constants';
import nonVARx from '../fixtures/non-VA-prescription-on-list-page.json';
import prescription from '../fixtures/prescription-details.json';
import prescriptionFillDate from '../fixtures/prescription-dispensed-datails.json';
import { medicationsUrls, RX_SOURCE } from '../../../util/constants';
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
    cy.intercept(
      'GET',
      '/my_health/v2/medical_records/allergies',
      acceleratedAllergies,
    ).as('acceleratedAllergies');
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

  visitMedicationsLinkWhenNoAllergiesAPICallFails = () => {
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    // Use wildcard pattern to match RTK Query URL with various query parameters
    cy.intercept('GET', '/my_health/v1/prescriptions?*', prescriptions).as(
      'medicationsList',
    );
    // Force allergies API to return an error
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('allergiesError');
    // Also intercept v2 allergies for Cerner pilot
    cy.intercept('GET', '/my_health/v2/medical_records/allergies', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('allergiesErrorV2');
    cy.visit(medicationsUrls.MEDICATIONS_URL);
    // Wait for allergies error and medications list to load
    cy.wait(['@allergiesError', '@medicationsList'], { timeout: 10000 });
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
    cy.get('[data-testid="send-renewal-request-message-link"]').should('exist');
  };

  verifyLearnHowToRenewPrescriptionsLink = () => {
    cy.get('[data-testid="send-renewal-request-message-link"]')
      .shadow()
      .find(`a`)
      .should('contain', 'Send a renewal request message');
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
      .should('contain', 'Download a PDF')
      .should('be.visible');
    cy.get('[data-testid="download-pdf-button"]').click({
      waitForAnimations: true,
    });
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
    cy.findByTestId('download-success-banner').within(() => {
      cy.get('.hydrated').should('exist');
    });
  };

  verifyDownloadSuccessMessageBannerNotVisibleAfterReload = () => {
    cy.findByTestId('download-success-banner').should('not.exist');
  };

  verifyInformationBasedOnStatusActiveNoRefillsLeft = () => {
    // V1 status logic is used (V2 flags disabled), which shows "Contact your VA provider" message
    cy.get('[data-testid="active-no-refill-left"]')
      .first()
      .should('be.visible')
      .and(
        'contain',
        'Contact your VA provider if you need more of this medication.',
      );
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
      '[data-testid="medication-list"] > :nth-child(11) [data-testid="rxStatus"]',
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
        'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
      );
  };

  verifyInformationBasedOnStatusDiscontinued = () => {
    cy.get('[data-testid="discontinued"]')
      .should('be.visible')
      .and(
        'contain',
        'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
      );
  };

  verifyInformationBasedOnStatusExpired = () => {
    cy.get('[data-testid="expired"]')
      .should('be.visible')
      .and(
        'contain',
        'You can’t refill this prescription. Contact your VA provider if you need more of this medication.',
      );
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
      `[data-testid="medication-list"] > :nth-child(7) #status-description-${unknownPrescription} > [data-testid="unknown"] > :nth-child(2) > :nth-child(1)`,
    )
      .should('be.visible')
      .and('contain', 'We’re sorry. There’s a problem with our system.');
  };

  verifyNumberOfRefillsLeftNotDisplayedOnMedicationCard = () => {
    cy.contains('refills left').should('not.be.visible');
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
      '[data-testid="medication-list"] > :nth-child(5) [data-testid="medications-history-details-link"]',
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
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="refill-request-button"]',
    ).should('be.enabled');

    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="refill-request-button"]',
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
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="refill-request-button"]',
    );
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="refill-request-button"]',
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

  validateMedicationsListSorted = sortedData => {
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

  sortPrescriptionsByLastFilledCustom = data => {
    const filled = [];
    const notYetFilled = [];
    const nonVA = [];

    data.data.forEach(item => {
      const { dispensedDate, prescriptionSource } = item.attributes;
      if (prescriptionSource === RX_SOURCE.NON_VA) {
        nonVA.push(item);
      } else if (dispensedDate) {
        filled.push(item);
      } else {
        notYetFilled.push(item);
      }
    });

    filled.sort((a, b) => {
      const dateA = new Date(a.attributes.dispensedDate).getTime();
      const dateB = new Date(b.attributes.dispensedDate).getTime();
      return dateB - dateA; // newest to oldest
    });

    notYetFilled.sort((a, b) => {
      const nameA = a.attributes.prescriptionName?.toLowerCase() || '';
      const nameB = b.attributes.prescriptionName?.toLowerCase() || '';
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    nonVA.sort((a, b) => {
      const nameA = a.attributes.prescriptionName?.toLowerCase() || '';
      const nameB = b.attributes.prescriptionName?.toLowerCase() || '';
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return {
      ...data,
      data: [...filled, ...notYetFilled, ...nonVA],
    };
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
    cy.get('[data-testid="page-total-info"]').should('be.focused');
  };

  verifyLastFilledDateforPrescriptionOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(2) [data-testid="rx-last-filled-date"]',
    ).should(
      'contain',
      `${prescriptionFillDate.data.attributes.sortedDispensedDate}`,
    );
  };

  verifyDiscontinuedMedicationNameIsVisibleOnListPage = () => {
    cy.get(
      '[data-testid="medication-list"] > :nth-child(6) [data-testid="medications-history-details-link"]',
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
      '[data-testid="refill-in-process"] > [data-testid="rx-process"] > [data-testid="rx-refillinprocess-info"] > [data-testid="pharmacy-phone-number"]',
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
    cy.get('[data-testid="rx-filter"]')
      .shadow()
      .find('[type="button"]')
      .click({ waitForAnimations: true });
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
      '.landing-page-content > [data-testid="medication-list"] > :nth-child(1) [data-testid="medications-history-details-link"]',
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
      `.landing-page-content > [data-testid="medication-list"] > :nth-child(${cardNumber})`,
    )
      .first()
      .should('not.contain', prescriptionNumber);
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
    cy.findByTestId('rx-need-help-container')
      .should('contain', text)
      .and('be.visible');
  };

  verifyGoToUseMedicationLinkOnListPage = () => {
    cy.findByTestId('go-to-use-medications-link').should('be.visible');
  };

  verifyStartANewMessageLinkOnListPage = () => {
    cy.findByTestId('start-a-new-message-link').should('be.visible');
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

  verifyErrorMessageforFailedAPICallListPage = text => {
    cy.findByTestId('no-medications-list').should('contain', text);
  };

  loadListPageWithoutToolTip = () => {
    cy.intercept('GET', '/my_health/v1/tooltips', hidden).as('tooltips');
    cy.visit(medicationsUrls.MEDICATIONS_URL);
  };

  verifyFilterAriaRegionText = text => {
    cy.findByTestId('filter-aria-live-region').should('have.text', text);
  };

  verifySortScreenReaderActionText = text => {
    cy.findByTestId('sort-action-sr-text').should('have.text', text);
  };

  // OH Integration tests

  visitMedicationsListForUserWithAcceleratedAllergies = (
    waitForMeds = false,
  ) => {
    // cy.intercept('GET', '/my-health/medications', prescriptions);
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      '/my_health/v2/medical_records/allergies',
      acceleratedAllergies,
    ).as('acceleratedAllergies');
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

  verifyAllergiesListNetworkResponseWithAcceleratedAllergies = () => {
    cy.get('@acceleratedAllergies')
      .its('response')
      .then(res => {
        expect(res.body.data[0].attributes).to.include({
          name: 'TRAZODONE',
        });
      });
  };

  // SendRxRenewalMessage component test helpers
  verifyRenewalRequestLinkExists = () => {
    cy.get('[data-testid="send-renewal-request-message-link"]')
      .should('exist')
      .and('be.visible');
  };

  verifyRenewalRequestActionLinkExists = () => {
    cy.get('[data-testid="send-renewal-request-message-action-link"]')
      .should('exist')
      .and('be.visible');
  };

  clickRenewalRequestLink = () => {
    cy.get('[data-testid="send-renewal-request-message-link"]')
      .first()
      .shadow()
      .find('a')
      .click();
  };

  clickRenewalRequestActionLink = () => {
    cy.get('[data-testid="send-renewal-request-message-action-link"]')
      .first()
      .click();
  };

  verifyRenewalModalIsOpen = () => {
    cy.get('va-modal')
      .should('exist')
      .and('have.attr', 'visible', 'true');

    cy.get('va-modal')
      .shadow()
      .find('h2')
      .should('contain', "You're leaving medications to send a message");
  };

  verifyRenewalModalIsClosed = () => {
    cy.get('va-modal').should('have.attr', 'visible', 'false');
  };

  closeRenewalModalWithBackButton = () => {
    cy.get('va-modal')
      .shadow()
      .find('button')
      .contains('Back')
      .click();
  };

  closeRenewalModalWithCloseButton = () => {
    cy.get('va-modal')
      .shadow()
      .find('button[aria-label="Close"]')
      .click();
  };

  verifyRenewalModalContent = () => {
    cy.get('va-modal')
      .find('p')
      .first()
      .should(
        'contain',
        "You'll need to select your provider and send them a message requesting a prescription renewal.",
      );

    cy.get('va-modal')
      .find('p')
      .eq(1)
      .should(
        'contain',
        "If you need a medication immediately, you should call your VA pharmacy's automated refill line",
      );
  };

  // Request Refill Button on Card methods
  verifyRequestRefillButtonExistsOnCard = () => {
    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('exist');
  };

  verifyRequestRefillButtonNotExistsOnCard = () => {
    cy.get('[data-testid="refill-request-button"]').should('not.exist');
  };

  verifyRequestRefillButtonText = () => {
    cy.get('[data-testid="refill-request-button"]')
      .first()
      .shadow()
      .find('button')
      .should('contain', 'Request a refill');
  };

  clickRequestRefillButtonOnFirstCard = () => {
    cy.get('[data-testid="refill-request-button"]')
      .first()
      .click();
  };

  verifyRequestRefillButtonHasAriaDescribedBy = () => {
    cy.get('[data-testid="refill-request-button"]')
      .first()
      .should('have.attr', 'aria-describedby')
      .and('match', /card-header-\d+/);
  };
}

export default MedicationsListPage;
