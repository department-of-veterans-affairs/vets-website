import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import nonLOA3User from '../../fixtures/user/nonLOA3.json';
import notCernerUser from '../../fixtures/user/notCerner.json';
import features from '../../fixtures/feature-toggles/enabled.json';
import staticEhrData from '../../fixtures/vamc-ehr-static.json';

const TEST_URL = '/health-care/refill-track-prescriptions/';

const setup = ({ authenticated, isLOA3 = true } = {}) => {
  // Mock feature toggles route.
  cy.intercept('GET', '/v0/feature_toggles*', features);
  cy.intercept('GET', '/data/cms/vamc-ehr.json', staticEhrData);

  // Clear announcements.
  disableFTUXModals();

  // Navigate straight to the test URL if unauth.
  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }

  // Log in the user.
  if (isLOA3) {
    cy.login(notCernerUser);
  } else {
    cy.login(nonLOA3User);
  }

  // Visit the test URL.
  cy.visit(TEST_URL);
};

describe('The schedule view VA appointments page', () => {
  // The CallToAction handles what to show users whether they are logged in or not
  it('Shows the CallToAction widget when unauthenticated', () => {
    // Set up the test.
    setup({ authenticated: false });

    cy.get('[data-testid="mhv-unauthenticated-alert"]').should('exist');
  });

  it('Shows the CallToAction widget when authenticated', () => {
    // Set up the test.
    setup({ authenticated: true });

    cy.get('va-link-action').should('exist');
  });
});
