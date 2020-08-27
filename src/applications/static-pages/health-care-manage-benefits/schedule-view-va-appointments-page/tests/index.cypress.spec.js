import cernerUser from '../../fixtures/user/cerner.json';
import notCernerUser from '../../fixtures/user/notCerner.json';

const TEST_URL = '/health-care/schedule-view-va-appointments/';

const setup = ({ authenticated, isCerner } = {}) => {
  // Clear announcements.
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

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
    cy.contains('You can use this tool to:');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-patient-cta-widget"]').should('not.exist');
  });

  it('Shows the correct CTA widget when authenticated and is NOT a Cerner patient', () => {
    // Set up the test.
    setup({ authenticated: true, isCerner: false });

    // Ensure the non-Cerner patient content shows.
    cy.contains('You can use this tool to:');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-patient-cta-widget"]').should('not.exist');
  });

  it('Shows the correct CTA widget when authenticated and IS a Cerner patient', () => {
    // Set up the test.
    setup({ authenticated: true, isCerner: true });

    // Ensure the Cerner patient content shows.
    cy.contains('You can use these tools to:');

    // Make sure CTA widget is displaying correctly.
    cy.get('[data-testid="cerner-patient-cta-widget"]').should('exist');
  });
});
