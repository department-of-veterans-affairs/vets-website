import mockUser from '../fixtures/user.json';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockUnauthenticatedUser from '../fixtures/non-rx-user.json';
import mockToggles from '../fixtures/toggles-response.json';
import cernerUser from '../fixtures/cerner-user.json';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';

import prescriptions from '../fixtures/prescriptions.json';
import { medicationsUrls } from '../../../util/constants';

class MedicationsSite {
  login = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        mockToggles,
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?page=1&per_page=999',
        prescriptions,
      ).as('prescriptions');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/health-care/refill-track-prescriptions');
    } else {
      // cy.login();
      window.localStorage.setItem('isLoggedIn', false);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        {
          data: {
            type: 'feature_toggles',
            features: [
              {
                name: 'mhv_medications_to_va_gov_release',
                value: true,
              },
            ],
          },
        },
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', mockUnauthenticatedUser).as(
        'mockUnAuthUser',
      );
      cy.intercept('GET', '/health-care/refill-track-prescriptions');
    }
  };

  cernerLogin = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        mockToggles,
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');

      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
        emptyPrescriptionsList,
      ).as('emptyPrescriptionsList');
      cy.intercept('GET', '/v0/user', cernerUser).as('mockUser');
    }
  };

  cernerLoginPrescriptionListError = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        mockToggles,
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', cernerUser).as('mockUser');
    }
  };

  cernerLoginRefillPageError = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        mockToggles,
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', cernerUser).as('mockUser');
      cy.visit(medicationsUrls.MEDICATIONS_REFILL);
    }
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
    cy.intercept(
      'GET',
      `my_health/v1/prescriptions?page=${interceptedPage}&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
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
    cy.get('[data-testid="page-total-info"]').should(
      'contain',
      `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${threadLength} medications, alphabetically by status`,
    );
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
}
export default MedicationsSite;
