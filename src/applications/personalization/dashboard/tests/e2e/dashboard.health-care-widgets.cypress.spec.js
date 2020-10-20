const enrollmentStatusEnrolled = {
  applicationDate: '2006-01-30T00:00:00.000-06:00',
  enrollmentDate: '2006-03-20T00:00:00.000-06:00',
  preferredFacility: '626A4 - ALVIN C. YORK VAMC',
  effectiveDate: '2018-04-28T18:21:56.000-05:00',
  parsedStatus: 'enrolled',
};

function mockLocalStorage() {
  // make sure no first-time UX modals are in the way
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro', 'find-benefits-intro']),
  );
}

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

function makeUserObject(
  options = {
    isCerner: true,
    rx: true,
    messaging: true,
    facilities: [
      { facilityId: '668', isCerner: true },
      { facilityId: '757', isCerner: true },
    ],
  },
) {
  const services = [];
  if (options.rx) {
    services.push('rx');
  }
  if (options.messaging) {
    services.push('messaging');
  }
  return {
    data: {
      id: '',
      type: 'users_scaffolds',
      attributes: {
        services,
        account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
        profile: {
          email: 'vets.gov.user+36@gmail.com',
          firstName: 'WESLEY',
          middleName: 'WATSON',
          lastName: 'FORD',
          birthDate: '1986-05-06',
          gender: 'M',
          zip: '21122-6706',
          lastSignedIn: '2020-07-21T00:04:51.589Z',
          loa: { current: 3, highest: 3 },
          multifactor: true,
          verified: true,
          signIn: { serviceName: 'idme', accountType: 'N/A', ssoe: true },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19860506',
          familyName: 'Ford',
          gender: 'M',
          givenNames: ['Wesley', 'Watson'],
          isCernerPatient: options.isCerner,
          facilities: options.facilities,
          vaPatient: true,
          mhvAccountState: 'NONE',
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
          servedInMilitary: true,
        },
        inProgressForms: [],
        prefillsAvailable: [],
        vet360ContactInformation: {},
      },
    },
    meta: { errors: null },
  };
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
