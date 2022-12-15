const features = require('./mocks/features');
const typeaheadResponses = require('./mocks/searchTypeaheadResponses');

describe('Homepage', () => {
  const BASE_URL = 'https://staging.va.gov/';

  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.visit(`${BASE_URL}new-home-page/`);
    cy.location('pathname').should('eq', '/new-home-page/');
  });

  it('loads page with expected sections', () => {
    cy.get('.homepage-hero').should('exist');
    cy.get('.homepage-common-tasks').should('exist');
    cy.get('.homepage-blog').should('exist');
    cy.get('.homepage-benefits-row').should('exist');
    cy.get('.homepage-email-updates-signup').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  describe('Hero section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads Hero-section contents', () => {
      // skipping page-content AXE-check -- already done in first test
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

      // skipping page-content AXE-check -- already done in first test
    });
  });

  describe('Common-tasks section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads Common-task section-contents', () => {
      // skipping page-content AXE-check -- already done in first test
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
    });
  });

  describe('Search section', () => {
    describe('Search box', () => {
      const keyword = 'health';
      const suggestedKeyword = 'health benefits';
      const checkResultsPage = searchTerm => {
        cy.location('pathname').should('eq', '/search/');
        cy.location('search').should(
          'eq',
          `?query=${searchTerm.replace(' ', '%20')}&t=false`,
        );
        cy.get('#h1-search-title').should('be.visible');
        cy.contains(keyword, {
          selector:
            '[data-e2e-id="search-results-page-dropdown-input-field"] div',
        }).should('be.visible');
        if (searchTerm) {
          cy.contains(/^Showing 1-[\d]{1,2} of [\d]+ results for /, {
            selector: 'h2',
          })
            .should('be.visible')
            .and('contain.text', `"${searchTerm}"`);
          cy.get('[data-e2e-id="search-results"]')
            .should('exist')
            .find('.result-item')
            .should('have.length.at.least', 1);
        } else {
          // empty-search
          cy.get(
            '[data-e2e-id="search-results-page-dropdown-input-field"]',
          ).should('be.empty');
          cy.get('[data-e2e-id="search-results-empty"]').should('be.visible');
          cy.get('[data-e2e-id="search-results"]').should('not.exist');
        }
      };

      Cypress.config({ includeShadowDom: true, waitForAnimations: true });

      beforeEach(() => {
        cy.intercept('/v0/search_typeahead?query=*', req => {
          req.reply(typeaheadResponses[req.query.query]);
        }).as('typeahead');
      });

      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('runs text-input search', () => {
        // skipping page-content AXE-check -- already done in first test
        cy.get('[data-widget-type="homepage-search"] va-search-input')
          .scrollIntoView()
          .find('#va-search-input')
          .clear()
          .type(keyword, { force: true })
          .next('#va-search-button')
          .click();
        checkResultsPage(keyword);
      });

      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('runs typeahead-suggestion search', () => {
        // skipping page-content AXE-check -- already done in first test
        cy.get('[data-widget-type="homepage-search"] va-search-input')
          .scrollIntoView()
          .find('#va-search-input')
          .clear()
          .type(keyword, { force: true });
        cy.get('#va-search-listbox', { selector: 'ul' })
          .should('exist')
          .find('> .va-search-suggestion', { selector: 'li' })
          .should('have.length', 5)
          .eq(0)
          .should('contain', suggestedKeyword)
          .click();
        checkResultsPage(suggestedKeyword);
      });

      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('passes empty-search to results-page', () => {
        // skipping page-content AXE-check -- already done in first test
        cy.get('[data-widget-type="homepage-search"] va-search-input')
          .scrollIntoView()
          .find('#va-search-button')
          .click();
        checkResultsPage('');
      });
    });

    describe('Other search tools', () => {
      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('navigates to appropriate search-tool-pages', () => {
        const toolsListSelector = '.homepage-common-tasks__search-tools ul';

        // skipping page-content AXE-check -- already done in first test
        cy.get(toolsListSelector)
          .scrollIntoView()
          .findByText('Find a VA location', { selector: 'a' })
          .click();
        cy.contains('Find VA locations', { selector: 'h1' }).should(
          'be.visible',
        );
        cy.go('back');
        cy.get(toolsListSelector)
          .scrollIntoView()
          .findByText('Find a VA form', { selector: 'a' })
          .click();
        cy.contains('Find a VA form', { selector: 'h1' }).should('be.visible');
        cy.go('back');
        cy.get(toolsListSelector)
          .scrollIntoView()
          .findByText('Find benefit resources and support', { selector: 'a' })
          .click();
        cy.contains('Resources and support', { selector: 'h1' }).should(
          'be.visible',
        );
        cy.go('back');
      });
    });
  });
});
