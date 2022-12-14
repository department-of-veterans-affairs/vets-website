const typeaheadResponses = require('./mocks/typeaheadResponses');

describe('Homepage', () => {
  const BASE_URL = 'https://staging.va.gov/';

  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.visit(`${BASE_URL}new-home-page`);
    cy.location('pathname').should('eq', '/new-home-page/');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('loads page with expected sections', () => {
    cy.get('.homepage-hero').should('exist');
    cy.get('.homepage-common-tasks').should('exist');
    cy.get('.homepage-blog').should('exist');
    cy.get('.homepage-benefits-row').should('exist');
    cy.get('.homepage-email-updates-signup').should('exist');

    // TODO: Uncomment AXE-check below before finalizing spec
    // cy.injectAxeThenAxeCheck();
  });

  describe('Hero section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads Hero-section contents', () => {
      cy.get('.homepage-hero')
        .scrollIntoView()
        .within(() => {
          cy.contains('Welcome', { selector: 'h2' }).should('be.visible');
          cy.contains('Learn what the PACT Act means for you', {
            selector: 'a',
          }).should('be.visible');
          cy.contains(/create account/i, { selector: 'button' }).should(
            'be.visible',
          );
        });

      // skipping AXE-check -- already done in first test
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('navigates to PACT Act page', () => {
      cy.get('.homepage-hero')
        .scrollIntoView()
        .within(() => {
          cy.contains('Learn what the PACT Act means for you', {
            selector: 'a',
          }).click();
          cy.location('pathname').should(
            'eq',
            '/resources/the-pact-act-and-your-va-benefits/',
          );
        });

      // skipping AXE-check -- already done in previous test
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('displays sign-in/-up modal', () => {
      cy.get('.homepage-hero')
        .scrollIntoView()
        .within(() => {
          cy.contains(/create account/i, { selector: 'button' }).click();
        });

      cy.location('search').should('eq', '?next=loginModal');
      cy.get('#signin-signup-modal').should('be.visible');

      // skipping AXE-check -- already done in first test
    });
  });

  describe('Common-tasks section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads Common-task section-contents', () => {
      cy.get('.homepage-common-tasks')
        .scrollIntoView()
        .within(() => {
          cy.get('#search-tools-header').should('be.visible');
          cy.get('[data-widget-type="homepage-search"]').should('be.visible');
          cy.get('#other-search-tools', { selector: 'h2' }).should(
            'be.visible',
          );
          cy.get('#top-pages', { selector: 'h2' }).should('be.visible');
          cy.get('a')
            .should('be.visible')
            .its('length')
            .should('be.greaterThan', 1);
        });

      // skipping AXE-check -- already done in first test
    });
  });

  describe('Search section', () => {
    describe('Search box', () => {
      beforeEach(() => {
        cy.intercept('https://staging-api.va.gov/v0/search_typeahead*', req => {
          req.reply(typeaheadResponses[req.query.query]);
        }).as('typeahead');
      });
      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it(
        'supports text-input search-submission ',
        { includeShadowDom: true, waitForAnimations: true },
        () => {
          cy.get('[data-widget-type="homepage-search"] va-search-input')
            .scrollIntoView()
            .within(inputWidget => {
              cy.wrap(inputWidget)
                .find('#va-search-input')
                .clear()
                .type('health', { force: true })
                .next('#va-search-button')
                .click()
                .then(() => {
                  cy.location('pathname').should('eq', '/search/');
                  cy.location('search').should('eq', '?query=health&t=false');
                });
            });
          // skipping AXE-check -- already done in first test
        },
      );
    });
  });
});
