import { appName, rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  it('personalization enabled', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit(rootUrl);
    cy.findByRole('heading', { level: 1, name: 'My HealtheVet' });
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should.exist;
    cy.injectAxeThenAxeCheck();
  });

  it('personalization disabled', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    cy.login(user);
    cy.visit(rootUrl);
    cy.findByRole('heading', { level: 1, name: 'My HealtheVet' });
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should(
      'not.exist',
    );
    cy.injectAxeThenAxeCheck();
  });
});
