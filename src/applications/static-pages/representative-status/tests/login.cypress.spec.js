import loggedInUser from './fixtures/mocks/loggedInUser.json';
import mockStatus from './fixtures/mocks/profileStatus.json';
import featuresDisabled from './fixtures/mocks/featuresDisabled.json';
import featuresEnabled from './fixtures/mocks/featuresEnabled.json';

const TEST_URL = '/get-help-from-accredited-representative/find-rep';

const setup = ({ authenticated, isEnabled = true } = {}) => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;
  cy.intercept('GET', '/v0/feature_toggles*', features);
  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.login(loggedInUser);
  cy.visit(TEST_URL);
};

describe('Unauthenticated', () => {
  beforeEach(() => {
    setup({ authenticated: false });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('Authenticated', () => {
  beforeEach(() => {
    setup({ authenticated: true });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});
