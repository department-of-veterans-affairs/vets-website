import { getAppUrl } from '@department-of-veterans-affairs/platform-utilities';

const enableFeature = (enabled = true) => {
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

const setEnrollmentStatus = (data = false) => {
  const defaultEnrollmentStatus = {
    effectiveDate: '2019-01-02T21:58:55.000-06:00',
    priorityGroup: 'Group 8G',
  };
  const body = data || defaultEnrollmentStatus;
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status', body);
};

describe('Priority Group Alert Widget', () => {
  it('renders <PactAct /> when feature is disabled', () => {
    enableFeature(false);
    cy.visit(getAppUrl('/health-care/eligibility/priority-groups'));
    cy.findByText(/The PACT Act expands benefits for Veterans/);
    cy.axeCheck();
  });

  it('renders <SignInPrompt /> when signed out', () => {
    enableFeature();
    cy.visit(getAppUrl('/health-care/eligibility/priority-groups'));
    cy.findByText('You might already have an assigned priority group');
    cy.axeCheck();
  });

  it('renders <UnknownGroup /> when priorityGroup is not set', () => {
    enableFeature();
    setEnrollmentStatus({});
    cy.visit(getAppUrl('/health-care/eligibility/priority-groups'));
    cy.findByText('You have not yet been assigned to a priority group');
    cy.axeCheck();
  });

  it('renders <ApiError /> when the API is unavailable', () => {
    enableFeature();
    const res = { statusCode: 500 };
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status', res);
    cy.visit(getAppUrl('/health-care/eligibility/priority-groups'));
    cy.findByText("We can't access your priority group information");
    cy.axeCheck();
  });
});
