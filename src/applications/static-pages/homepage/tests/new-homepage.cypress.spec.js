const features = require('./mocks/features');
const typeaheadResponses = require('./mocks/searchTypeaheadResponses');

describe('Homepage', () => {
  const BASE_URL = 'https://staging.va.gov/';
  const checkLinkNavigation = (scrollToSelector, linkText, pathname) => {
    cy.get(scrollToSelector)
      .should('exist')
      .scrollIntoView();
    cy.contains(linkText, {
      selector: 'a',
    }).click();
    cy.location('pathname').should('eq', pathname);
    cy.go('back');
  };

  Cypress.config({ includeShadowDom: true, waitForAnimations: true });

  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
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
          cy.get('#search-tools-header').should('exist');
          cy.get('[data-widget-type="homepage-search"]').should('exist');
          cy.get('#other-search-tools', { selector: 'h2' }).should(
            'be.visible',
          );
          cy.get('#top-pages', { selector: 'h2' }).should('exist');
          cy.get('a')
            .should('exist')
            .and('have.length.at.least', 10);
        });
    });

    describe('Search subsection', () => {
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
          if (searchTerm) {
            cy.contains(searchTerm, {
              selector: '#search-results-page-dropdown-input-field',
            }).should('be.visible');
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
            cy.get('[data-e2e-id="search-app"] input[type="text"]')
              .should('exist')
              .its('value')
              .should('be.undefined');
            cy.get('[data-e2e-id="search-results-empty"]').should('be.visible');
            cy.get('[data-e2e-id="search-results"]').should('not.exist');
          }
        };

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
            .find('#va-search-input')
            .clear()
            .next('#va-search-button')
            .click();
          checkResultsPage('');
        });
      });

      describe('Other search tools', () => {
        // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
        it('navigates to appropriate search-tool-pages', () => {
          const toolsListSelector = '.homepage-common-tasks__search-tools ul';

          // skipping page-content AXE-check -- already done in first test
          checkLinkNavigation(
            toolsListSelector,
            'Find a VA location',
            '/find-locations/',
          );
          checkLinkNavigation(
            toolsListSelector,
            'Find a VA form',
            '/find-forms/',
          );
          checkLinkNavigation(
            toolsListSelector,
            'Find benefit resources and support',
            '/resources/',
          );
        });
      });
    });

    describe('Top-pages subsection', () => {
      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('navigates to top pages', () => {
        const linksListSelector = '#top-pages + .homepage-common-tasks__list';

        // skipping page-content AXE-check -- already done in first test
        checkLinkNavigation(
          linksListSelector,
          'Check your claim or appeal status',
          '/claim-or-appeal-status/',
        );
        checkLinkNavigation(
          linksListSelector,
          'Review your payment history',
          '/va-payment-history/',
        );
        checkLinkNavigation(
          linksListSelector,
          'File for disability compensation',
          '/disability/file-disability-claim-form-21-526ez/introduction',
        );
        checkLinkNavigation(
          linksListSelector,
          'Schedule or manage health appointments',
          '/health-care/schedule-view-va-appointments/',
        );
        checkLinkNavigation(
          linksListSelector,
          'Refill or track a prescription',
          '/health-care/refill-track-prescriptions/',
        );
        checkLinkNavigation(
          linksListSelector,
          'Compare GI Bill benefits',
          '/education/gi-bill-comparison-tool',
        );
        checkLinkNavigation(
          linksListSelector,
          'Get mental health care',
          '/health-care/health-needs-conditions/mental-health/',
        );
        checkLinkNavigation(
          linksListSelector,
          'Review or update your dependents',
          '/view-change-dependents',
        );
        checkLinkNavigation(
          linksListSelector,
          'Get reimbursed for travel pay',
          '/health-care/get-reimbursed-for-travel-pay/',
        );
        checkLinkNavigation(
          linksListSelector,
          'Get your VA medical records',
          '/health-care/get-medical-records/',
        );
      });
    });
  });
});
