// Relative imports.
import { mockUser } from '@@profile/tests/fixtures/users/user.js';

const testFirstMenuSection = () => {
  cy.get('[data-e2e-id="vetnav-level2--disability"').should('not.exist');
  cy.get('[data-e2e-id="va-benefits-and-health-care-0"]').click();
  cy.get('[data-e2e-id="vetnav-level2--disability"]').click();
  cy.get('[data-e2e-id="view-all-in-disability"]');
  cy.get('[data-e2e-id="vetnav-column-one-header"]');
  cy.get('[data-e2e-id="eligibility-0"]');
  // cy.get('[data-e2e-id="coronavirus-fa-qs"]');
  cy.get('[data-e2e-id="about-va-1"]');
  cy.get('[data-e2e-id="find-a-va-location-2"]');
};

const testSecondMenuSection = () => {
  cy.get('[data-e2e-id="vetnav-main-column-header"]').should('not.exist');
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
};

const testFindLocationsLink = () => {
  cy.get('[data-e2e-id="find-a-va-location-2"]')
    .should('have.attr', 'href')
    .and('include', 'find-locations');
};

const testMobileMenuSections = () => {
  cy.get('[data-e2e-id="about-va-1"]').should('not.be.visible');

  // Open the menu.
  cy.get('.vetnav-controller-open').contains('Menu');
  cy.get('.vetnav-controller-open').click();
  cy.get('.vetnav-controller-close').contains('Close');

  // Check the links to make sure they all look right.
  cy.get('[data-e2e-id="mobile-home-nav-link"]');
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

const testDesktopMenuSections = () => {
  testFirstMenuSection();
  testSecondMenuSection();
  testFindLocationsLink();
};

describe('Mega Menu', () => {
  context('on desktop', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('looks as expected unauthenticated', () => {
      // Visit the homepage.
      cy.visit('/');

      // Back to home button should not appear on desktop.
      cy.get('[data-e2e-id="mobile-home-nav-link"]').should('not.be.visible');

      // Test the menu sections.
      testDesktopMenuSections();

      // Authenticated links should not appear.
      cy.get('[data-e2e-id="my-va-3"]').should('not.exist');
      cy.get('[data-e2e-id="my-health-4"]').should('not.exist');
    });

    it('looks as expected authenticated', () => {
      // Login as the mock user.
      cy.login(mockUser);

      // Visit the homepage.
      cy.visit('/');

      // Back to home button should not appear on desktop.
      cy.get('[data-e2e-id="mobile-home-nav-link"]').should('not.be.visible');

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

    it('looks as expected unauthenticated', () => {
      // Visit the homepage.
      cy.visit('/');

      // Test the menu sections.
      testMobileMenuSections();

      // Authenticated links should not appear.
      cy.get('[data-e2e-id="my-va-3"]').should('not.exist');
      cy.get('[data-e2e-id="my-health-4"]').should('not.exist');
    });

    it('looks as expected authenticated', () => {
      // Login as the mock user.
      cy.login(mockUser);

      // Visit the homepage.
      cy.visit('/');

      // Test the menu sections.
      testMobileMenuSections();

      // Authenticated links should appear.
      cy.get('[data-e2e-id="my-va-3"]');
      cy.get('[data-e2e-id="my-health-4"]');
    });
  });
});
