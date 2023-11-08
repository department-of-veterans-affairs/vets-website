/* eslint-disable no-param-reassign */
import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';
import * as mockHeaderFooterData from '~/platform/landing-pages/header-footer-data.json';

const CATEGORY_NAME = 'Health care';
const menuCategory = h.getMenuCategoryData(CATEGORY_NAME);
const columnLinks = h.getColumnLinksForBHLinks(menuCategory);
const columnHeadersForDesktop = h.getColumnHeadersForBH(menuCategory);

// Service member and family member benefits are also tested in here
describe('global header - benefit hubs - health care', () => {
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

    // The header data is set in window.VetsGov.headerFooter with the data received
    // from content-build. It's mocked here with header-footer-data.json
    cy.visit('/', {
      onBeforeLoad(win) {
        win.VetsGov = {};
        win.VetsGov.headerFooter = mockHeaderFooterData;
      },
    });
  });

  describe('desktop menu', () => {
    it('should correctly load the elements', () => {
      cy.injectAxeThenAxeCheck();

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          h.clickBenefitsAndHealthcareButton();

          const viewAllSelector = '[data-e2e-id="view-all-in-health-care"]';
          const healthCareButton = '[data-e2e-id="vetnav-level2--health-care"]';

          h.verifyMenuItemsForDesktop(
            healthCareButton,
            viewAllSelector,
            columnLinks,
            columnHeadersForDesktop,
          );

          // Service member benefits
          h.verifyText(
            '[data-e2e-id="vetnav-level2--service-member-benefits"]',
            'Service member benefits',
          );

          // Family member benefits
          h.verifyText(
            '[data-e2e-id="vetnav-level2--family-member-benefits"]',
            'Family member benefits',
          );
        });
    });
  });

  describe('mobile menu', () => {
    it('should correctly load the elements', () => {
      cy.viewport(400, 1000);
      cy.injectAxeThenAxeCheck();

      h.clickMenuButton();

      const headerNav = () => cy.get('#header-nav-items');

      headerNav().within(() => {
        h.clickBenefitsAndHealthcareButtonMobile();

        // Service member benefits
        h.verifyText(
          '[data-e2e-id="service-member-benefits"]',
          'Service member benefits',
        );

        // Family member benefits
        h.verifyText(
          '[data-e2e-id="family-member-benefits"]',
          'Family member benefits',
        );

        const healthCareButton = () => cy.get('.header-menu-item-button').eq(1);

        h.verifyMenuItemsForMobile(healthCareButton, columnLinks);
      });
    });
  });
});
