import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { resolveLandingPageLinks } from '../../../utilities/data';

const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

const unregisteredHeadline = 'You don’t have access to My HealtheVet';

describe(appName, () => {
  describe('Display content based on VA Patient property', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      });

      it(`VA Patient property is false -- ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          0,
          'arialLabel',
          false,
        );

        LandingPage.visitPage({ vaPatient: false });
        LandingPage.validatePageLoaded();
        LandingPage.validateURL();
        cy.injectAxeThenAxeCheck();

        cy.findByRole('heading', { name: unregisteredHeadline }).should.exist;

        // Test the cards are not visible
        pageLinks.cards.forEach(card => {
          cy.findByRole('heading', { name: card.title }).should('not.exist');
        });
        // Test the hubs are visible
        pageLinks.hubs.forEach(hub => {
          LandingPage.validateLinkGroup(hub.title, hub.links.length);
        });

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: 'VA health benefits' }).should.exist;
      });

      it(`VA Patient property is true -- ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          0,
          'arialLabel',
          true,
        );

        LandingPage.visitPage();
        LandingPage.validatePageLoaded();
        LandingPage.validateURL();
        cy.injectAxeThenAxeCheck();

        // Validate the cards and hubs
        pageLinks.cards.forEach(card => {
          LandingPage.validateLinkGroup(card.title, card.links.length);
        });
        pageLinks.hubs.forEach(hub => {
          LandingPage.validateLinkGroup(hub.title, hub.links.length);
        });

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: 'My VA health benefits' }).should
          .exist;

        // Test that the no health data message is NOT present
        cy.findByRole('heading', {
          name: unregisteredHeadline,
        }).should('not.exist');
      });
    });
  });
});
