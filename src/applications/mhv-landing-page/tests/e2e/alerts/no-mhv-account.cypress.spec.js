import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import MhvRegistrationAlert from '../../../components/MhvRegistrationAlert';
import { resolveLandingPageLinks } from '../../../utilities/data';

describe(`${appName} - MHV Registration Alert - `, () => {
  const pageLinks = resolveLandingPageLinks(false, [], 'arialLabel', false);

  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
  });

  it(`alert shown for user without MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'NONE' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: MhvRegistrationAlert.defaultProps.headline,
    }).should.exist;

    // Check the cards are visible
    pageLinks.cards.forEach(card => {
      LandingPage.validateLinkGroup(card.title, card.links.length);
    });
  });

  it(`alert not shown for user with MHV account`, () => {
    LandingPage.visit({ mhvAccountState: 'OK' });
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: MhvRegistrationAlert.defaultProps.headline,
    }).should('not.exist');

    // Check the cards are visible
    pageLinks.cards.forEach(card => {
      LandingPage.validateLinkGroup(card.title, card.links.length);
    });
  });
});
