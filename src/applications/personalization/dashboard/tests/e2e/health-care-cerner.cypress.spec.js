import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';
import vamcErc from '../fixtures/vamc-ehr.json';

import {
  makeUserObject,
  mockLocalStorage,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('MyVA Dashboard - Cerner Widget', () => {
  describe('when user is not enrolled in a Cerner facility', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: true,
        rx: false,
        facilities: [{ facilityId: '686', isCerner: false }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      // cy.intercept('https://localhost:3001/protected-endpoint', )
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcErc);
    });
    it('should not show the Cerner alert', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-widget').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('when user is enrolled at Cerner facility', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: true,
        messaging: true,
        rx: true,
        facilities: [
          { facilityId: '668', isCerner: true },
          { facilityId: '757', isCerner: true },
        ],
        isPatient: true,
      });

      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcErc);
    });
    it('should show the Cerner alert', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-widget').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
