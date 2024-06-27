import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

import {
  APPLICATION_FEATURE_TOGGLES,
  generateFeatureToggles,
} from '../../../mocks/api/feature-toggles';

const toggles = {
  ...APPLICATION_FEATURE_TOGGLES,
  mhvLandingPagePersonalization: true,
};

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  it('personalization enabled', () => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({ toggles, enableAll: true }),
    ).as('featureToggles');
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
