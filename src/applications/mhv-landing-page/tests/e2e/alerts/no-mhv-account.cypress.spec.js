import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import MhvRegistrationAlert from '../../../components/alerts/AlertMhvRegistration';

describe(`${appName} - MHV Registration Alert - `, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
  });

  it(`alert shown for user without MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'NONE' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: MhvRegistrationAlert.defaultProps.headline,
    }).should.exist;

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: MhvRegistrationAlert.defaultProps.headline,
    }).should('not.exist');

    // Check the cards and hubs are visible
    cy.findAllByTestId(/^mhv-link-group-card-/).should.exist;
    cy.findAllByTestId(/^mhv-link-group-hub-/).should.exist;
  });
});
