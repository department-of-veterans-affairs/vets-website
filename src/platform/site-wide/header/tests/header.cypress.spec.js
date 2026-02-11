import features from '~/platform/utilities/tests/header-footer/mocks/features';
import * as h from '~/platform/utilities/tests/header-footer/utilities/helpers';

describe('global header', () => {
  const verifyElement = selector =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible');

  Cypress.config({
    includeShadowDom: true,
    waitForAnimations: true,
    pageLoadTimeout: 120000,
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
      'analytics',
    );
  });

  describe('desktop header', () => {
    it('should correctly load all of the header elements', () => {
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          const crisisLineModal = () =>
            cy
              .get('va-crisis-line-modal')
              .shadow()
              .find('button.va-crisis-line.va-overlay-trigger');
          verifyElement(crisisLineModal);
          verifyElement('.va-notice--banner');
          verifyElement('.va-header-logo-wrapper');
          verifyElement(
            '[alt="VA logo and Seal, U.S. Department of Veterans Affairs"]',
          );
          verifyElement('.sitewide-search-drop-down-panel-button');
          h.verifyLinkWithoutSelector(
            6,
            'Contact us',
            `${window.location.origin}/contact-us`,
          );
          verifyElement('.sign-in-links');
        });
    });
  });

  describe('mobile header', () => {
    it('should correctly load all of the header elements', () => {
      cy.viewport('iphone-4');
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          const crisisLineModal = () =>
            cy.get('va-crisis-line-modal[mode="trigger"]');
          verifyElement(crisisLineModal);
          verifyElement('.header-logo-row svg');
          verifyElement('.sign-in-links');

          const menuSelector = '.header-menu-button';
          verifyElement(menuSelector);
          const menuAndCloseButton = () => cy.get(menuSelector);

          menuAndCloseButton().contains('Menu');
          h.clickButton(menuSelector);
          menuAndCloseButton().contains('Close');

          h.verifyText('[for="search-header-dropdown-input-field"]', 'Search');
          verifyElement('#search-header-dropdown-component');

          const searchContainer = () =>
            cy.get('#search-header-dropdown-component');

          searchContainer()
            .scrollIntoView()
            .within(() => {
              verifyElement('input');
              verifyElement('button');
            });

          h.clickButton(menuSelector);
          menuAndCloseButton().contains('Menu');
        });
    });
  });
});
