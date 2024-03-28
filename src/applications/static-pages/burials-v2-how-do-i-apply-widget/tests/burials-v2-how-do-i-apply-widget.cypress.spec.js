import featuresDisabled from './fixtures/mocks/featuresDisabled.json';
import featuresEnabled from './fixtures/mocks/featuresEnabled.json';

const TEST_URL = '/burials-memorials/veterans-burial-allowance/';

const setup = isEnabled => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;
  cy.intercept('GET', '/v0/feature_toggles*', features);
  cy.visit(TEST_URL);
};

describe('The Burials v2 Apply Widget, Flipper Enabled', () => {
  beforeEach(() => {
    setup(true);
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});

describe('The Burials v2 Apply Widget, Flipper Disabled', () => {
  beforeEach(() => {
    setup(false);
    cy.injectAxe();
  });

  it('Accessibility check', () => {
    cy.axeCheck();
  });
});
