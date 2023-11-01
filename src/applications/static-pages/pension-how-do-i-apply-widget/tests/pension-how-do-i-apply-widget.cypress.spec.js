import loggedInUser from './fixtures/mocks/loggedInUser.json';
import features from './fixtures/mocks/features.json';
import mockStatus from './fixtures/mocks/profile-status.json';

const TEST_URL = '/pension/how-to-apply/';

const setup = ({ authenticated } = {}) => {
  cy.intercept('GET', '/v0/feature_toggles*', features);
  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.login(loggedInUser);
  cy.visit(TEST_URL);
};

describe('The Pension Widget - Not Authenticated', () => {
  beforeEach(() => {
    setup();
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('The Pension Widget - Authenticated', () => {
  beforeEach(() => {
    setup({ authenticated: true });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});
