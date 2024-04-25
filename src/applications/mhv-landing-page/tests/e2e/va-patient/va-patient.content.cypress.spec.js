import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { resolveLandingPageLinks } from '../../../utilities/data';

const unregisteredHeadline = 'You don’t have access to My HealtheVet';
let pageLinks;

describe(`${appName} -- VA Patient`, () => {
  describe('user is not a VA Patient', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visitPage({ vaPatient: false });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();

      pageLinks = resolveLandingPageLinks(false, [], 0, 'arialLabel', false);
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays the Unregistered Alert', () => {
      cy.findByTestId('unregistered-alert');
      cy.findByRole('heading', { name: unregisteredHeadline }).should.exist;
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not display Health Tools cards', () => {
      pageLinks.cards.forEach(card => {
        cy.findByRole('heading', { name: card.title }).should('not.exist');
      });
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays hub links', () => {
      pageLinks.hubs.forEach(hub => {
        LandingPage.validateLinkGroup(hub.title, hub.links.length);
      });
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays the "VA health benefits" heading', () => {
      cy.findByRole('heading', { name: 'VA health benefits' }).should.exist;
    });

    it('passes automated accessibility (a11y) checks', () => {
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('user is a VA Patient', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      LandingPage.visitPage();
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();

      pageLinks = resolveLandingPageLinks(false, [], 0, 'arialLabel', true);
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not display the Unregistered Alert', () => {
      cy.findByTestId('unregistered-alert').should('not.exist');
      cy.findByRole('heading', {
        name: unregisteredHeadline,
      }).should('not.exist');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays Health Tools cards', () => {
      pageLinks.cards.forEach(card => {
        LandingPage.validateLinkGroup(card.title, card.links.length);
      });
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays hub links', () => {
      pageLinks.hubs.forEach(hub => {
        LandingPage.validateLinkGroup(hub.title, hub.links.length);
      });
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays the "My VA health benefits" heading', () => {
      cy.findByRole('heading', { name: 'My VA health benefits' }).should.exist;
    });

    it('passes automated accessibility (a11y) checks', () => {
      cy.injectAxeThenAxeCheck();
    });
  });
});
