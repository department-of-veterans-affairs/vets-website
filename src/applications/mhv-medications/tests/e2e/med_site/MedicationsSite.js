import mockUser from '../fixtures/user.json';
import mockVamcEhr from '../fixtures/vamc-ehr.json';
import mockUnauthenticatedUser from '../fixtures/non-rx-user.json';
import mockToggles from '../fixtures/toggles-response.json';
import cernerUser from '../fixtures/cerner-user.json';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';
import { Paths } from '../utils/constants';
import prescriptions from '../fixtures/prescriptions.json';
import { medicationsUrls } from '../../../util/constants';
import listOfprescriptions from '../fixtures/listOfPrescriptions.json';

class MedicationsSite {
  login = (isMedicationsUser = true) => {
    this.mockFeatureToggles();
    this.mockVamcEhr();

    if (isMedicationsUser) {
      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?page=1&per_page=999',
        prescriptions,
      ).as('prescriptions');
      cy.intercept('GET', '/health-care/refill-track-prescriptions');

      // src/platform/testing/e2e/cypress/support/commands/login.js handles the next two lines
      // window.localStorage.setItem('isLoggedIn', true);
      // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.login(mockUser);
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
        `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${threadLength} medications, alphabetically by status`,
      );
    });
  };

  verifyDownloadedPdfFile = (_prefixString, _clickMoment, _searchText) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      const txtPath2 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      const txtPath3 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      this.internalReadFileMaybe(txtPath1, _searchText);
      this.internalReadFileMaybe(txtPath2, _searchText);
      this.internalReadFileMaybe(txtPath3, _searchText);
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
      } else {
        cy.task('log', `found the file ${taskFileName} but did not find text`);
      }
    });
  };

  mockFeatureToggles = () => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockToggles).as(
      'featureToggles',
    );
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
