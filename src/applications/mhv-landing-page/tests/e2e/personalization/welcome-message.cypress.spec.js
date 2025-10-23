import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { USER_MOCKS } from '../../../mocks/api/user';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  context('personalization enabled', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
    });

    it('shows the Welcome', () => {
      LandingPage.visit();
      cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should.exist;
      cy.injectAxeThenAxeCheck();
    });

    it('should match name capitalization to auth header', () => {
      LandingPage.visit({ user: USER_MOCKS.ALL_CAPS_NAME });
      cy.findAllByText('Kevin').should('have.length', 2);
    });
  });

  it('personalization disabled', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    LandingPage.visit();
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should(
      'not.exist',
    );
    cy.injectAxeThenAxeCheck();
  });
});
