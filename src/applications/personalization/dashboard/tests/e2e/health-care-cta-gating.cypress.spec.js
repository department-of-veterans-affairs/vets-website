import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';

import { mockFolderResponse } from '../../utils/mocks/messaging/folder';

import {
  makeUserObject,
  mockLocalStorage,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('MyVA Dashboard - CTA Links', () => {
  beforeEach(() => {
    mockLocalStorage();
  });
  context('when user is has messaging and rx features', () => {
    beforeEach(() => {
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: true,
        rx: true,
        facilities: [{ facilityId: '123', isCerner: false }],
        isPatient: true,
      });

      cy.login(mockUser);
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      cy.intercept('GET', '/v0/messaging/health/folders/0', mockFolderResponse);
    });
    it('should show the rx CTA amd unread messages alert', () => {
      cy.visit('my-va/');
      cy.findByRole('link', {
        name: /schedule and manage.*appointments/i,
      }).should('exist');
      cy.findByTestId('unread-messages-alert').should('exist');
      cy.findByRole('link', {
        name: /refill and track.*prescriptions/i,
      }).should('exist');
      cy.findByRole('link', {
        name: /request travel reimbursement/i,
      }).should('exist');
    });
  });
  context('when user lacks messaging and rx features', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: false,
        rx: false,
        facilities: [{ facilityId: '123', isCerner: false }],
        isPatient: true,
      });

      cy.login(mockUser);
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
    });
    it('should show the rx and messaging CTAs', () => {
      cy.visit('my-va/');
      cy.findByRole('link', {
        name: /schedule and manage.*appointments/i,
      }).should('exist');
      cy.findByRole('link', { name: /send a.*message/i }).should('exist');
      cy.findByRole('link', {
        name: /refill and track.*prescriptions/i,
      }).should('not.exist');
    });
  });
});
