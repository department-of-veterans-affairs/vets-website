import { appName, rootUrl } from '../../../manifest.json';
import { generateFeatureToggles } from '../../../mocks/api/feature-toggles';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  it('personalization enabled', () => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        mhvLandingPagePersonalization: true,
      }),
    ).as('featureToggles');
    cy.login(user);
    cy.visit(rootUrl);
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should.exist;
    cy.injectAxeThenAxeCheck();
  });

  it('personalization disabled', () => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        mhvLandingPagePersonalization: false,
      }),
    ).as('featureToggles');
    cy.login(user);
    cy.visit(rootUrl);
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should(
      'not.exist',
    );
    cy.injectAxeThenAxeCheck();
  });
});
