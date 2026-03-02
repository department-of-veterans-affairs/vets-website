import { addSeconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import mockUser from '../fixtures/user.json';
import mockVamcEhr from '../fixtures/vamc-ehr.json';
import mockUnauthenticatedUser from '../fixtures/non-rx-user.json';
import mockToggles from '../fixtures/toggles-response.json';
import mockTogglesAccelerated from '../fixtures/toggles-accelerated-delivery.json';
import cernerUser from '../fixtures/cerner-user.json';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';
import { Paths, DownloadFormat } from '../utils/constants';
import prescriptions from '../fixtures/prescriptions.json';
import exportList from '../fixtures/exportList.json';
import { DATETIME_FORMATS, medicationsUrls } from '../../../util/constants';
import listOfprescriptions from '../fixtures/listOfPrescriptions.json';

class MedicationsSite {
  login = (
    isMedicationsUser = true,
    isAcceleratingAllergies = false,
    user = mockUser,
  ) => {
    this.mockFeatureToggles(isAcceleratingAllergies);
    this.mockVamcEhr();

    if (isMedicationsUser) {
      cy.intercept(
        'GET',
        // '/my_health/v1/prescriptions?page=1&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
        '/my_health/v1/prescriptions?page=1&per_page=999',
        prescriptions,
      ).as('prescriptions');
      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?&sort=alphabetical-status',
        exportList,
      ).as('exportList');

      cy.intercept('GET', '/health-care/refill-track-prescriptions');

      // src/platform/testing/e2e/cypress/support/commands/login.js handles the next two lines
      // window.localStorage.setItem('isLoggedIn', true);
      // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.login(user);
    } else {
      // cy.login();
      window.localStorage.setItem('isLoggedIn', false);

      cy.intercept('GET', '/v0/user', mockUnauthenticatedUser).as(
        'mockUnAuthUser',
      );
      cy.intercept('GET', '/health-care/refill-track-prescriptions');
    }
  };

  cernerLogin = user => {
    // if (isMedicationsUser) {
    cy.login(user);
    this.mockFeatureToggles();
    this.mockVamcEhr();

    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      emptyPrescriptionsList,
    ).as('emptyPrescriptionsList');
    // }
  };

  cernerLoginPrescriptionListError = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login(cernerUser);
      this.mockFeatureToggles();
      this.mockVamcEhr();
    }
  };

  cernerLoginRefillPageError = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login(cernerUser);
      this.mockFeatureToggles();
      this.mockVamcEhr();
      cy.visit(medicationsUrls.MEDICATIONS_REFILL);
    }
  };

  loginWithFeatureToggles = (user, toggles) => {
    cy.login(user);
    cy.intercept('GET', '/v0/feature_toggles?*', toggles).as('featureToggles');
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, listOfprescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      listOfprescriptions,
    ).as('listOfprescriptions');
    this.mockVamcEhr();
  };

  loginWithManagementImprovements = () => {
    const toggles = JSON.parse(JSON.stringify(mockToggles));
    const flag = toggles.data.features.find(
      f => f.name === 'mhv_medications_management_improvements',
    );
    if (flag) flag.value = true;
    this.mockVamcEhr();
    cy.intercept('GET', '/v0/feature_toggles?*', toggles).as('featureToggles');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=999',
      prescriptions,
    ).as('prescriptions');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort=alphabetical-status',
      exportList,
    ).as('exportList');
    cy.intercept('GET', '/health-care/refill-track-prescriptions');
    cy.login(mockUser);
  };

  verifyloadLogInModal = () => {
    cy.visit(medicationsUrls.MEDICATIONS_ABOUT);
    cy.get('#signin-signup-modal-title').should('contain', 'Sign in');
  };

  loadVAPaginationPrescriptions = (interceptedPage = 1, mockRx) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?page=${interceptedPage}&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=-dispensed_date&sort[]=prescription_name&include_image=true',
      mockRx,
    ).as('prescriptions');
    cy.get('[id="pagination"]')
      .shadow()
      .find('[class="usa-pagination__button usa-current"]')
      .click({ waitForAnimations: true });
    // cy.wait(`@Prescriptions${interceptedPage}`);
  };

  loadVAPaginationNextPrescriptions = (interceptedPage = 2, mockRx) => {
    cy.intercept('GET', Paths.INTERCEPT.PAGINATION_NEXT, mockRx).as(
      `Prescriptions${interceptedPage}`,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=-dispensed_date&sort[]=prescription_name&include_image=true',
      mockRx,
    );
    cy.get('[id="pagination"]')
      .shadow()
      .find('[aria-label="Next page"]')
      .first()
      .click({ waitForAnimations: true });
    cy.wait(`@Prescriptions${interceptedPage}`);
  };

  loadVAPaginationPreviousPrescriptions = (
    interceptedPage = 2,
    mockRx,
    PerPage = 20,
  ) => {
    cy.intercept(
      'POST',
      `/my_health/v1/prescriptions?page=1&per_page=${PerPage}&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[id="pagination"]')
      .shadow()
      .find('[aria-label="Previous page"]')
      .click({ waitForAnimations: true });
    // cy.wait(`@Prescriptions${interceptedPage}`);
  };

  verifyPaginationPrescriptionsDisplayed = (
    displayedStartNumber,
    displayedEndNumber,
    threadLength,
  ) => {
    cy.get('[data-testid="page-total-info"]').should($el => {
      const text = $el.text().trim();
      expect(text).to.include(
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${threadLength}  medications, alphabetically by status`,
      );
    });
  };

  verifyDownloadedFile = ({
    prefixString = 'VA-medications-list-Safari-Mhvtp',
    searchText = 'Date',
    format = DownloadFormat.PDF,
  } = {}) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const now = Date.now();
      const downloadsFolder = Cypress.config('downloadsFolder');
      const timeZone = 'America/New_York';

      const timestamps = [0, 1, 2, 3].map(sec =>
        formatInTimeZone(
          addSeconds(now, sec),
          timeZone,
          DATETIME_FORMATS.filename,
        ).replace(/\./g, ''),
      );

      // Browsers automatically replace invalid filename characters (like /) with _ when saving
      const sanitizedPrefix = prefixString.replace(/\//g, '_');
      const filePaths = timestamps.map(
        timestamp =>
          `${downloadsFolder}/${sanitizedPrefix}-${timestamp}.${format}`,
      );

      const results = [];
      const checkFile = index => {
        if (index >= filePaths.length || results.length > 0) {
          return; // Stop if we've checked all files or found one
        }

        const filePath = filePaths[index];
        cy.task('log', `attempting to find file = ${filePath}`);
        cy.task('readFileMaybe', filePath).then(content => {
          if (content !== null) {
            results.push({ filePath, content });
          } else {
            checkFile(index + 1); // Only check next if not found
          }
        });
      };
      checkFile(0);

      cy.then(() => {
        expect(
          results,
          `Expected one of these files to exist:\n${filePaths.join('\n')}`,
        ).to.have.lengthOf.at.least(1);

        // Only check content for TXT files since PDFs are binary
        if (DownloadFormat.TXT === format) {
          const foundWithText = results.some(r =>
            r.content.includes(searchText),
          );
          expect(
            foundWithText,
            `Expected file to contain "${searchText}"`,
          ).to.equal(true);
        }
      });
    } else {
      cy.log('browser is not headless');
    }
  };

  mockFeatureToggles = (isAcceleratingAllergies = false) => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      isAcceleratingAllergies ? mockTogglesAccelerated : mockToggles,
    ).as('featureToggles');
  };

  mockVamcEhr = () => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamcEhr).as('vamcEhr');
  };

  unallowedUserLogin = user => {
    cy.login(user);
    this.mockFeatureToggles();
    this.mockVamcEhr();
    cy.intercept('GET', '/v0/user', user).as('mockUser');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      emptyPrescriptionsList,
    ).as('emptyPrescriptionsList');
  };
}

export default MedicationsSite;
