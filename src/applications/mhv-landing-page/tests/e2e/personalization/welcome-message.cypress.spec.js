import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  it('personalization enabled', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    LandingPage.visit();
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should.exist;
    cy.injectAxeThenAxeCheck();
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
