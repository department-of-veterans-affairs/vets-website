import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import MhvRegistrationAlert from '../../../components/MhvRegistrationAlert';

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
  });

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: MhvRegistrationAlert.defaultProps.headline,
    }).should('not.exist');
  });
});
