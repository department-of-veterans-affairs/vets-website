import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import cernerUser from '../../fixtures/user/cerner.json';
import notCernerUser from '../../fixtures/user/notCerner.json';
import features from '../../fixtures/feature-toggles/enabled.json';
import staticEhrData from '../../fixtures/vamc-ehr-static.json';

const TEST_URL = '/health-care/schedule-view-va-appointments/';

const setup = ({ authenticated, isCerner } = {}) => {
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
  if (isCerner) {
    cy.login(cernerUser);
  } else {
    cy.login(notCernerUser);
  }

  // Visit the test URL.
  cy.visit(TEST_URL);
};

describe('The schedule view VA appointments page', () => {
  it('Shows the correct CTA widget when unauthenticated', () => {
    // Set up the test.
    setup({ authenticated: false });

    // Ensure the non-Cerner patient content shows.
    cy.get('[data-testid="non-cerner-content"]').should('exist');
    cy.get('[data-testid="cerner-content"]').should('not.exist');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-cta-widget"]').should('not.exist');
  });

  it('Shows the correct CTA widget when authenticated and is NOT a Cerner patient', () => {
    // Set up the test.
    setup({ authenticated: true, isCerner: false });

    // Ensure the non-Cerner patient content shows.
    cy.get('[data-testid="non-cerner-content"]').should('exist');
    cy.get('[data-testid="cerner-content"]').should('not.exist');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-cta-widget"]').should('not.exist');
  });

  it('Shows the correct CTA widget when authenticated and IS a Cerner patient', () => {
    // Set up the test.
    setup({ authenticated: true, isCerner: true });

    // Ensure the Cerner patient content shows.
    cy.get('[data-testid="non-cerner-content"]').should('not.exist');
    cy.get('[data-testid="cerner-content"]').should('exist');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-cta-widget"]').should('exist');
  });
});
