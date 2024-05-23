import { appName } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import unregisteredUser from '../../fixtures/user.unregistered.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- MHV Secondary Nav enabled`, () => {
  describe('registered user', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      cy.login(user);
      cy.visit('/my-health');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('renders', () => {
      cy.get('nav[aria-label="My HealtheVet"]');
    });

    it('passes automated accessibility (a11y) checks', () => {
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered user', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      cy.login(unregisteredUser);
      cy.visit('/my-health');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not render', () => {
      cy.get('nav[aria-label="My HealtheVet"]');
    });

    it('passes automated accessibility (a11y) checks', () => {
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe(`${appName} -- MHV Secondary Nav disabled`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    cy.login(user);
    cy.visit('/my-health');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('does not render', () => {
    cy.get('nav[aria-label="My HealtheVet"]').should('not.exist');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
