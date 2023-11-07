import loggedInUser from './fixtures/mocks/loggedInUser.json';
import featuresDisabled from './fixtures/mocks/featuresDisabled.json';
import featuresEnabled from './fixtures/mocks/featuresEnabled.json';
import mockStatus from './fixtures/mocks/profile-status.json';

const TEST_URL = '/pension/application/527EZ/introduction';

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

describe('The Pension Apply Widget - Not Authenticated, Flipper Enabled', () => {
  beforeEach(() => {
    setup();
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('The Pension Apply Widget - Authenticated, Flipper Enabled', () => {
  beforeEach(() => {
    setup({ authenticated: true });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('The Deactivated Pension Apply Widget - Not Authenticated, Flipper Disabled', () => {
  beforeEach(() => {
    setup({ isEnabled: false });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('The Deactivated Pension Apply Widget - Authenticated, Flipper Disabled', () => {
  beforeEach(() => {
    setup({ authenticated: true, isEnabled: false });
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});
