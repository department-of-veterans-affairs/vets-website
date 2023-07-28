const widgetPath = '/health-care/eligibility/priority-groups/';

const mockVamcEhr = () => {
  const data = {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  };
  cy.intercept('GET', '/data/cms/vamc-ehr.json', { data });
};

const mockFeatureEnabled = (enabled = true) => {
  const priorityGroupAlertFeature = {
    name: 'show_priority_group_alert_widget',
    value: enabled,
  };
  const data = {
    type: 'feature_toggles',
    features: [priorityGroupAlertFeature],
  };
  cy.intercept('GET', '/v0/feature_toggles?*', { data });
};

const mockEnrollmentStatus = (data = false, statusCode = 200) => {
  const defaultEnrollmentStatus = {
    effectiveDate: '2019-01-02T21:58:55.000-06:00',
    priorityGroup: 'Group 8G',
  };
  const res = {
    body: data || defaultEnrollmentStatus,
    statusCode,
  };
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status', res);
};

describe('Priority Group Alert Widget', () => {
  describe('feature disabled', () => {
    it('renders <PactAct /> when feature is disabled', () => {
      mockVamcEhr();
      mockFeatureEnabled(false);
      cy.visit(widgetPath);
      cy.findByText(/The PACT Act expands benefit access for Veterans/);
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('feature enabled', () => {
    beforeEach(() => {
      mockVamcEhr();
      mockFeatureEnabled();
    });

    it('renders <SignInPrompt /> when signed out', () => {
      cy.visit(widgetPath);
      cy.findByText('You might already have an assigned priority group');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('renders <PriorityGroup /> when signed in and enrolled', () => {
      mockEnrollmentStatus();
      cy.login();
      cy.visit(widgetPath);
      cy.findByText(/Your assigned priority group is 8G/);
      cy.injectAxe();
      cy.axeCheck();
    });

    xit('renders <UnknownGroup /> when priorityGroup is not set', () => {
      mockEnrollmentStatus({ priorityGroup: null });
      cy.login();
      cy.visit(widgetPath);
      cy.findByText('You have not yet been assigned to a priority group');
      cy.injectAxe();
      cy.axeCheck();
    });

    xit('renders <UnknownGroup /> when enrollmentStatus is empty', () => {
      mockEnrollmentStatus({});
      cy.login();
      cy.visit(widgetPath);
      cy.findByText('You have not yet been assigned to a priority group');
      cy.injectAxe();
      cy.axeCheck();
    });

    xit('renders <ApiError /> when the API is unavailable', () => {
      mockEnrollmentStatus({}, 500);
      cy.login();
      cy.visit(widgetPath);
      cy.findByText("We can't access your priority group information");
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
