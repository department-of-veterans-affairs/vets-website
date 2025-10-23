import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';

import {
  makeUserObject,
  mockLocalStorage,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import { v2 } from '../../mocks/appointments';
import { mockFolderResponse } from '../../utils/mocks/messaging/folder';

const userWithRxMessaging = makeUserObject({
  isCerner: false,
  messaging: true,
  rx: true,
  facilities: [{ facilityId: '123', isCerner: false }],
  isPatient: true,
});

const userWithoutRxMessaging = makeUserObject({
  isCerner: false,
  messaging: false,
  rx: false,
  facilities: [{ facilityId: '123', isCerner: false }],
  isPatient: true,
});

describe('My VA Dashboard - Rx Messaging', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      const rv = v2.createAppointmentSuccess({ startsInDays: [] });
      req.reply(rv);
    });
    cy.intercept(
      'GET',
      '/v0/health_care_applications/enrollment_status',
      enrollmentStatusEnrolled,
    );
    cy.intercept('GET', '/my_health/v1/messaging/folders', mockFolderResponse);
  });

  context('when user has messaging and rx features', () => {
    it('should show the view messages and rx CTAs', () => {
      cy.login(userWithRxMessaging);
      cy.visit('my-va/');
      cy.findByTestId('view-your-messages-link-from-cta').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user lacks messaging and rx features', () => {
    it('should show the rx CTA and unread messages alert', () => {
      cy.login(userWithoutRxMessaging);
      cy.visit('my-va/');

      cy.findByTestId('view-manage-appointments-link-from-error').should(
        'not.exist',
      );
      cy.findByTestId('view-manage-appointments-link-from-cta').should(
        'not.exist',
      );
      cy.findByTestId('view-your-messages-link-from-cta').should('exist');
      cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
      cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
        'exist',
      );
      cy.findByTestId('get-medical-records-link-from-cta').should('exist');
      cy.findByTestId('apply-va-healthcare-link-from-cta').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
