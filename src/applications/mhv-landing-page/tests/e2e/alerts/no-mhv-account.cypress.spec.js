import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(`${appName} - MHV Registration Alert - `, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
  });

  it(`alert shown for user without MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'NONE' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: 'Register your account with My HealtheVet',
    }).should.exist;

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: 'Register your account with My HealtheVet',
    }).should('not.exist');

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });
});
