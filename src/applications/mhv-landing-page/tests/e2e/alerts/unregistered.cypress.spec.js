import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { resolveLandingPageLinks } from '../../../utilities/data';

const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

const noHealthDataHeading = /You don’t have access to My HealtheVet/i;

describe(appName, () => {
  describe('Display content based on patient registration', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
        ApiInitializer.initializeMessageData.withNoUnreadMessages();
      });

      it(`unregistered patient on ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          'arialLabel',
          false,
        );

        LandingPage.visit({ registered: false });
        cy.injectAxeThenAxeCheck();

        // Test that the no health data message is present
        cy.findByRole('heading', {
          name: noHealthDataHeading,
        }).should.exist;

        // Test the cards are not visible
        pageLinks.cards.forEach(card => {
          cy.findByRole('heading', { name: card.title }).should('not.exist');
        });
        // Test the hubs are visible
        pageLinks.hubs.forEach(hub => {
          LandingPage.validateLinkGroup(hub.title, hub.links.length);
        });

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /VA health benefits/i }).should.exist;
      });

      it(`registered patient on ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          'arialLabel',
          true,
        );

        LandingPage.visit();
        cy.injectAxeThenAxeCheck();

        // Validate the cards and hubs
        pageLinks.cards.forEach(card => {
          LandingPage.validateLinkGroup(card.title, card.links.length);
        });
        pageLinks.hubs.forEach(hub => {
          LandingPage.validateLinkGroup(hub.title, hub.links.length);
        });

        // Test for the conditional heading for VA health benefits
        cy.findByRole('heading', { name: /My VA health benefits/i }).should
          .exist;

        // Test that the no health data message is NOT present
        cy.findByRole('heading', {
          name: noHealthDataHeading,
        }).should('not.exist');
      });
    });
  });
});
