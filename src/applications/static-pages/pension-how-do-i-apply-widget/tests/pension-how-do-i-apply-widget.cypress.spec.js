import loggedInUser from './fixtures/mocks/loggedInUser.json';
import features from './fixtures/mocks/features.json';
import mockStatus from './fixtures/mocks/profile-status.json';

const TEST_URL = '/pension-how-do-i-apply-widget';

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

  it('Displays the correct page content for unauthenticated user', () => {
    cy.get('h3').contains('Our online pension form isn’t working right now');
    cy.get('p').contains(
      'You can still apply for VA pension benefits by mail, in person at a VA regional office, or with the help of a Veterans Service Officer (VSO) or another accredited representative. Download the PDF form we provide on this page.',
    );
    cy.get('h4').contains('If you started your form online already');
    cy.get('p').contains(
      `You’ll need to start over using a PDF form. But you can still sign in to VA.gov to refer to the information you saved in your online form.`,
    );
    cy.get('p').contains(
      'We’ll record the potential start date for your benefits as the date you first saved your online form. You have 1 year from this date to submit your application. If we approve your claim, you may be able to get retroactive payments.',
    );
    cy.get('strong').contains('Note: ');
    cy.get('va-button')
      .contains('Sign in to VA.gov')
      .should('exist');
    cy.axeCheck();
  });
});

describe('The Pension Widget for authenticed Veteran', () => {
  beforeEach(() => {
    setup({ authenticated: true });
    cy.injectAxe();
  });

  it('Displays the correct page content for authenticated user', () => {
    cy.get('h3').contains('Our online pension form isn’t working right now');
    cy.get('div').contains(
      'You can still apply for VA pension benefits by mail, in person at a VA regional office, or with the help of a Veterans Service Officer (VSO) or another accredited representative. Download the PDF form we provide on this page.',
    );
    cy.get('h4').contains('If you started your form online already');
    cy.get('p').contains(
      `You’ll need to start over using a PDF form. But you can still refer to the information you saved in your online form.`,
    );
    cy.get('a')
      .contains('Refer to your saved form')
      .should('exist');
    cy.axeCheck();
  });
});
