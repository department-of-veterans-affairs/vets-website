import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- MHV Newsletter Signup`, () => {
  describe('registered user', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit();
      cy.findByRole('heading', {
        name: /Subscribe to the My HealtheVet newsletter/,
      }).should.exist;
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unverified user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ verified: false, registered: false });
      cy.findByRole('heading', {
        name: /Subscribe to the My HealtheVet newsletter/,
      }).should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered "dslogon" user', () => {
    it('does not render', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({
        registered: false,
        verified: false,
        serviceName: 'dslogon',
      });
      cy.findByRole('heading', {
        name: /Subscribe to the My HealtheVet newsletter/,
      }).should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unregistered user with verified login (non-patient page)', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visitNonPatientPage();
      cy.findByRole('heading', {
        name: /Subscribe to the My HealtheVet newsletter/,
      }).should.exist;
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('user without MHV account', () => {
    it('renders', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      LandingPage.visit({ mhvAccountState: false });
      cy.findByRole('heading', {
        name: /Subscribe to the My HealtheVet newsletter/,
      }).should.exist;
      cy.injectAxeThenAxeCheck();
    });
  });
});
