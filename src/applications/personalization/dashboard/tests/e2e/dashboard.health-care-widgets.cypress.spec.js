import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';

import { makeUserObject, mockLocalStorage } from './dashboard-e2e-helpers';

function mockFeatureFlags() {
  cy.route('GET', '/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features: [
        {
          // This feature flag is required to enable Cerner alerts
          name: 'show_new_schedule_view_appointments_page',
          value: true,
        },
      ],
    },
  });
}

describe('MyVA Dashboard - Health Care Widgets', () => {
  describe('when user is enrolled at Cerner facility with all features', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: true,
        messaging: true,
        rx: true,
        facilities: [{ facilityId: '668', isCerner: true }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('exist');
      cy.findByTestId('cerner-messaging-widget').should('exist');
      cy.findByTestId('cerner-prescription-widget').should('exist');
      cy.findByTestId('non-cerner-appointment-widget').should('not.exist');
      cy.findByTestId('non-cerner-messaging-widget').should('not.exist');
      cy.findByTestId('non-cerner-prescription-widget').should('not.exist');
    });
  });
  describe('when user is enrolled at Cerner facility that only supports appointments', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: true,
        messaging: true,
        rx: true,
        facilities: [{ facilityId: '757', isCerner: true }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('exist');
      cy.findByTestId('cerner-messaging-widget').should('not.exist');
      cy.findByTestId('cerner-prescription-widget').should('not.exist');
      cy.findByTestId('non-cerner-appointment-widget').should('not.exist');
      cy.findByTestId('non-cerner-messaging-widget').should('exist');
      cy.findByTestId('non-cerner-prescription-widget').should('exist');
    });
  });
  describe('when user is enrolled at Cerner facility and lacks the prescription and messaging features', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: true,
        messaging: false,
        rx: false,
        facilities: [{ facilityId: '757', isCerner: true }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('exist');
      cy.findByTestId('cerner-messaging-widget').should('not.exist');
      cy.findByTestId('cerner-prescription-widget').should('not.exist');
      cy.findByTestId('non-cerner-appointment-widget').should('not.exist');
      cy.findByTestId('non-cerner-messaging-widget').should('not.exist');
      cy.findByTestId('non-cerner-prescription-widget').should('not.exist');
    });
  });
  describe('when user is enrolled in a non-Cerner facility', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: true,
        rx: true,
        facilities: [{ facilityId: '686', isCerner: false }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('not.exist');
      cy.findByTestId('cerner-messaging-widget').should('not.exist');
      cy.findByTestId('cerner-prescription-widget').should('not.exist');
      cy.findByTestId('non-cerner-appointment-widget').should('exist');
      cy.findByTestId('non-cerner-messaging-widget').should('exist');
      cy.findByTestId('non-cerner-prescription-widget').should('exist');
    });
  });
  describe('when user is enrolled in a non-Cerner facility and lacks the messaging service', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: false,
        rx: true,
        facilities: [{ facilityId: '686', isCerner: false }],
        isPatient: true,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('not.exist');
      cy.findByTestId('cerner-messaging-widget').should('not.exist');
      cy.findByTestId('cerner-prescription-widget').should('not.exist');
      cy.findByTestId('non-cerner-appointment-widget').should('exist');
      cy.findByTestId('non-cerner-messaging-widget').should('not.exist');
      cy.findByTestId('non-cerner-prescription-widget').should('exist');
    });
  });
  describe('when user is enrolled in a non-Cerner facility and lacks the prescriptions service', () => {
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
      cy.route(
        'GET',
        '/v0/health_care_applications/enrollment_status',
        enrollmentStatusEnrolled,
      );
      mockFeatureFlags();
    });
    it('should show the correct widgets', () => {
      cy.visit('my-va/');
      cy.findByTestId('cerner-appointment-widget').should('not.exist');
      cy.findByTestId('cerner-messaging-widget').should('not.exist');
      cy.findByTestId('cerner-prescription-widget').should('not.exist');
      cy.findByTestId('non-cerner-appointment-widget').should('exist');
      cy.findByTestId('non-cerner-messaging-widget').should('exist');
      cy.findByTestId('non-cerner-prescription-widget').should('not.exist');
    });
  });
});
