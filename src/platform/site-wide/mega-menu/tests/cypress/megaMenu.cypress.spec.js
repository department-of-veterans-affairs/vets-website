/**
 * [TestRail-integrated] Spec for Mega-Menu
 * @testrailinfo projectId 8
 * @testrailinfo suiteId 9
 * @testrailinfo groupId 2975
 * @testrailinfo runName SH-e2e-MegaMenu
 */
import { mockUser } from '../fixtures/user';

Cypress.Commands.add(
  'checkMenuItem',
  (
    selector,
    expectedPath,
    parentMenuSelector = false,
    grandParentMenuSelector = false,
  ) => {
    if (grandParentMenuSelector) {
      cy.get(grandParentMenuSelector).click();
    }
    if (parentMenuSelector) {
      cy.get(parentMenuSelector).click();
    }
    cy.get(selector).click();
    cy.location('pathname').should('match', new RegExp(`^/${expectedPath}/?$`));
    cy.go('back');
  },
);

const testFirstMenuSection = isMobile => {
  cy.get('[data-e2e-id="vetnav-level2--disability"').should('not.exist');
  cy.get(`#mega-menu-${isMobile ? 'desktop' : 'mobile'} #vetnav`).should(
    'not.exist',
  );
  cy.get('[data-e2e-id="va-benefits-and-health-care-0"]').click();
  cy.get('[data-e2e-id="vetnav-level2--health-care"]').click();
  cy.get('[data-e2e-id="va-benefits-and-health-care-0"]').click();
  cy.checkMenuItem(
    '[data-e2e-id="how-to-apply-1"]',
    'health-care/how-to-apply',
    '[data-e2e-id="vetnav-level2--health-care"]',
    '[data-e2e-id="va-benefits-and-health-care-0"]',
  );
  cy.checkMenuItem(
    '[data-e2e-id="family-and-caregiver-health-benefits-2"]',
    'health-care/family-caregiver-benefits',
    '[data-e2e-id="vetnav-level2--health-care"]',
    '[data-e2e-id="va-benefits-and-health-care-0"]',
  );
  cy.checkMenuItem(
    '[data-e2e-id="view-your-lab-and-test-results-3"]',
    'health-care/view-test-and-lab-results',
    '[data-e2e-id="vetnav-level2--health-care"]',
    '[data-e2e-id="va-benefits-and-health-care-0"]',
  );

  cy.get('[data-e2e-id="va-benefits-and-health-care-0"]').click();
  cy.get('[data-e2e-id="vetnav-level2--disability"]').click();
  cy.get('[data-e2e-id="view-all-in-disability"]');
  cy.get('[data-e2e-id="vetnav-column-one-header"]');
  cy.get('[data-e2e-id="eligibility-0"]');

  cy.get('[data-e2e-id="about-va-1"]');
  cy.checkMenuItem('[data-e2e-id="find-a-va-location-2"]', 'find-locations');
};

const testSecondMenuSection = isMobile => {
  cy.get('[data-e2e-id="vetnav-main-column-header"]').should('not.exist');
  cy.get(`#mega-menu-${isMobile ? 'desktop' : 'mobile'} #vetnav`).should(
    'not.exist',
  );
  cy.get('[data-e2e-id="about-va-1"]').click();
  cy.get('[data-e2e-id="vetnav-main-column-header"]').contains(
    'VA organizations',
  );
  cy.get('[data-e2e-id="veterans-health-administration-0"]');
  cy.get('[data-e2e-id="vetnav-column-one-header"]').contains(
    'Innovation at VA',
  );
  cy.get('[data-e2e-id="va-open-data-2"]');
  cy.get('[data-e2e-id="vetnav-column-two-header"]').contains('Learn about VA');
  cy.get('[data-e2e-id="veterans-legacy-program-4"]');
  cy.get('[data-e2e-id="agency-financial-report"]');
  cy.get('[data-e2e-id="about-va-1"]').click();

  cy.checkMenuItem(
    '[data-e2e-id="veterans-health-administration-0"]',
    'health',
    '[data-e2e-id="about-va-1"]',
  );
  cy.checkMenuItem(
    '[data-e2e-id="va-plans-budget-finances-and-performance-2"]',
    'performance',
    '[data-e2e-id="about-va-1"]',
  );
};

const testFindLocationsLink = () => {
  cy.get('[data-e2e-id="find-a-va-location-2"]')
    .should('have.attr', 'href')
    .and('include', 'find-locations');
};

const testMobileMenuSections = () => {
  cy.get('[data-e2e-id="about-va-1"]').should('not.be.visible');
  cy.get('#mega-menu-desktop #vetnav').should('not.exist');

  // Open the menu.
  cy.get('.vetnav-controller-open').contains('Menu');
  cy.get('.vetnav-controller-open').click();
  cy.get('.vetnav-controller-close').contains('Close');

  // Check the links to make sure they all look right.
  cy.findByTestId('mobile-home-nav-link');
  cy.get('[data-e2e-id="about-va-1"]').click();
  cy.get('[data-e2e-id="vetnav-level2--va-organizations"]').click();
  cy.get('[data-e2e-id="all-va-offices-and-organizations-6"]');
  cy.get('.back-button').click();
  cy.get('[data-e2e-id="vetnav-level2--va-organizations"]');
  testFindLocationsLink();

  // Close the mobile menu.
  cy.get('.vetnav-controller-close').click();
  cy.get('.vetnav-controller-open').contains('Menu');
};

const testMobileTabFocus = () => {
  cy.get('[data-e2e-id="about-va-1"]').should('not.be.visible');
  cy.get('#mega-menu-desktop #vetnav').should('not.exist');

  cy.get('.vetnav-controller-open').contains('Menu');
  cy.get('.vetnav-controller-open').click();
  cy.get('.vetnav-controller-close').contains('Close');

  // tabbing through first level menu wraps around to open/close button
  cy.findByTestId('mobile-home-nav-link').focus();

  for (let i = 0; i < 5; i++) {
    cy.focused().tab();
  }

  cy.focused().should('have.attr', 'aria-controls', 'vetnav');

  // shift tabbing through first level menu wraps around to open/close button

  for (let i = 0; i < 6; i++) {
    cy.focused().tab({ shift: true });
  }

  cy.focused().should('have.attr', 'aria-controls', 'vetnav');

  // tabbing through second level menu wraps around to open/close button
  cy.findByTestId('mobile-home-nav-link')
    .tab()
    .click();

  for (let i = 0; i < 15; i++) {
    cy.focused().tab();
  }

  cy.focused().should('have.attr', 'aria-controls', 'vetnav');

  // tabbing through third level menu wraps around to open/close button
  cy.findByTestId('mobile-home-nav-link')
    .tab()
    .tab()
    .click();

  cy.get('#vetnav-health-care-ms button').focus();

  for (let i = 0; i < 11; i++) {
    cy.focused().tab();
  }

  cy.focused().should('have.attr', 'aria-controls', 'vetnav');
};

const testDesktopMenuSections = () => {
  testFirstMenuSection(false);
  testSecondMenuSection(false);
  testFindLocationsLink();
};

// Use an app's URL if provided in the environment, otherwise use the homepage.
// Unauthenticated tests are skipped for app URLs to avoid unexpected behavior.
const testUrl = Cypress.env('app_url') || '/';
const usingHomepageUrl = testUrl === '/';

describe('Mega Menu', () => {
  context('on desktop', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('looks as expected unauthenticated - C12293', () => {
      // Skip unauthenticated test for app URLs to avoid unexpected behavior.
      if (usingHomepageUrl) {
        // Visit the homepage.
        cy.visit(testUrl);

        // Back to home button should not appear on desktop.
        cy.findByTestId('mobile-home-nav-link').should('not.be.visible');

        // Test the menu sections.
        testDesktopMenuSections();

        // cy.get('[data-e2e-id="my-va-3"]');
        // Authenticated links should not appear.
        cy.get('[data-e2e-id="my-health-4"]').should('not.exist');
      }
    });

    it.skip('looks as expected authenticated - C12294', () => {
      // Login as the mock user.
      cy.login(mockUser);

      // Visit the home or app page.
      cy.visit(testUrl);

      // Back to home button should not appear on desktop.
      cy.findByTestId('mobile-home-nav-link').should('not.be.visible');

      // Test the menu sections.
      testDesktopMenuSections();

      // Authenticated links should appear.
      cy.get('[data-e2e-id="my-va-3"]');
      cy.get('[data-e2e-id="my-health-4"]');
    });
  });

  context('on mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-4');
    });

    it.skip('looks as expected unauthenticated - C12295', () => {
      // Skip unauthenticated test for app URLs to avoid unexpected behavior.
      if (usingHomepageUrl) {
        // Visit the homepage.
        cy.visit(testUrl);

        // Test the menu sections.
        testMobileMenuSections();

        cy.get('[data-e2e-id="my-va-3"]');
        // Authenticated links should not appear.
        cy.get('[data-e2e-id="my-health-4"]').should('not.exist');
      }
    });

    it.skip('looks as expected authenticated - C12296', () => {
      // Login as the mock user.
      cy.login(mockUser);

      // Visit the home or app page.
      cy.visit(testUrl);

      // Test the menu sections.
      testMobileMenuSections();

      // Authenticated links should appear.
      cy.get('[data-e2e-id="my-va-3"]');
      cy.get('[data-e2e-id="my-health-4"]');
    });

    it.skip('traps focus inside mega menu when opened - C12297', () => {
      // Skip unauthenticated test for app URLs to avoid unexpected behavior.
      if (usingHomepageUrl) {
        cy.visit(testUrl);

        testMobileTabFocus();
      }
    });
  });
});
