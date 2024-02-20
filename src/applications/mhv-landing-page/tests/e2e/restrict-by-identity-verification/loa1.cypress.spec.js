import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { resolveLandingPageLinks } from '../../../utilities/data';

const viewportSizes = ['va-top-desktop-1', 'va-top-mobile-1'];

// ID.me is LandingPage.visitPage default for serviceProvider
const verifyIdentityHeading = /Verify your identity to use your ID.me account on My HealtheVet/i;

describe(appName, () => {
  describe('Display content based on LOA', () => {
    viewportSizes.forEach(size => {
      beforeEach(() => {
        cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
        ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      });

      it(`Shows unverified identity message for patients with loa1 on ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          0,
          'arialLabel',
          true,
        );

        // User has facilities, but identity is not verified
        LandingPage.visitPage({
          facilities: [{ facilityId: '123', isCerner: false }],
          loa: 1,
        });
        LandingPage.validatePageLoaded();
        LandingPage.validateURL();
        cy.injectAxeThenAxeCheck();

        // Test that the unverified identity message is present
        cy.findByRole('heading', {
          name: verifyIdentityHeading,
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
        cy.findByRole('heading', { name: /My VA health benefits/i }).should
          .exist;
      });

      it(`landing page is enabled for patients with facilities and loa 3 on ${size} screen`, () => {
        cy.viewportPreset(size);
        const pageLinks = resolveLandingPageLinks(
          false,
          [],
          0,
          'arialLabel',
          true,
        );

        LandingPage.visitPage({
          facilities: [{ facilityId: '123', isCerner: false }],
          loa: 3,
        });
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
        cy.findByRole('heading', { name: /My VA health benefits/i }).should
          .exist;

        // Test that the unverified identity message is NOT present
        cy.findByRole('heading', {
          name: verifyIdentityHeading,
        }).should('not.exist');
      });
    });
  });
});
