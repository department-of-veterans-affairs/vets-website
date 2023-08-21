// Mock user data and feature toggles.
import loggedInUser from './fixtures/mocks/loggedInUser.json';
import features from './fixtures/mocks/features.json';
import mockStatus from './fixtures/mocks/profile-status.json';

const TEST_URL = '/pension-widget'; // Replace with the correct path

const setup = ({ authenticated } = {}) => {
  // Mock feature toggles route.
  cy.intercept('GET', '/v0/feature_toggles*', features);

  // Navigate straight to the test URL if unauth.
  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  // Log in the user.
  cy.login(loggedInUser);

  // Visit the test URL.
  cy.visit(TEST_URL);
};

describe('The Pension Widget unauthenticed Veteran', () => {
  beforeEach(() => {
    setup();
    cy.injectAxe();
  });

  it('Displays the alert with the correct header', () => {
    cy.get('h2').contains('How do I apply?');
    cy.axeCheck();
  });

  it('Displays the alert with the correct header', () => {
    cy.get('h3').contains('Our online pension form isn’t working right now');
    cy.axeCheck();
  });

  it('Provides the appropriate instructions', () => {
    cy.get('div').contains(
      'You can still apply for VA pension benefits by mail, in person at a VA regional office, or with the help of a Veterans Service Officer (VSO) or another accredited representative.',
    );
    cy.get('div').contains(
      'If you started your form online already, you’ll need to start over using a PDF form. But you can still refer to the information you saved in your online form.',
    );
    cy.get('strong').contains('If you started your form online already,');
    cy.axeCheck();
  });

  it('Displays "Sign in or create an account" button when user is not authenticated', () => {
    cy.get('va-button')
      .contains('Sign in or create an account')
      .should('exist');
    cy.axeCheck();
  });
});

describe('The Pension Widget for authenticed Veteran', () => {
  beforeEach(() => {
    setup({ authenticated: true });
    cy.injectAxe();
  });

  it('Displays the alert with the correct header', () => {
    cy.get('h2').contains('How do I apply?');
    cy.axeCheck();
  });

  it('Displays the alert with the correct header', () => {
    cy.get('h3').contains('Our online pension form isn’t working right now');
    cy.axeCheck();
  });

  it('Provides the appropriate instructions', () => {
    cy.get('div').contains(
      'You can still apply for VA pension benefits by mail, in person at a VA regional office, or with the help of a Veterans Service Officer (VSO) or another accredited representative.',
    );
    cy.get('div').contains(
      'If you started your form online already, you’ll need to start over using a PDF form. But you can still refer to the information you saved in your online form.',
    );
    cy.get('strong').contains('If you started your form online already,');
    cy.axeCheck();
  });

  it('Displays "Refer to your saved form" link when user is authenticated', () => {
    cy.get('a')
      .contains('Refer to your saved form')
      .should('exist');
    cy.axeCheck();
  });
});
