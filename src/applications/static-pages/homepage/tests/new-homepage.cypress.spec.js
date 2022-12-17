import features from './mocks/features';
import { searchTypeaheadResponses } from './mocks/searchTypeaheadResponses';

// NOTE: This spec tests the Staging new-homepage.  Homepage does not exist within vets-website here.
describe('Homepage', () => {
  const BASE_URL = 'https://staging.va.gov/';
  const checkLinkNavigation = (scrollToSelector, linkText, destination) => {
    const httpProtocolRegex = new RegExp('^https?://', 'i');

    cy.get(scrollToSelector)
      .should('exist')
      .scrollIntoView();
    cy.contains(linkText, {
      selector: 'a',
    }).click();
    if (!httpProtocolRegex.test(destination)) {
      // root-relative link - assert pathname
      cy.location('pathname').should('eq', destination);
    } else {
      // absolute link - assert entire URL
      cy.location('href').should('eq', destination);
    }

    cy.go('back');
  };

  Cypress.config({
    includeShadowDom: true,
    waitForAnimations: true,
    pageLoadTimeout: 120000,
  });

  before(function() {
    // run this spec ONLY in local project
    cy.log(`Cypress.env('CI'): ${Cypress.env('CI')}`);
    cy.log(`Cypress.env('CYPRESS_CI'): ${Cypress.env('CYPRESS_CI')}`);
    if (Cypress.env('CI') || Cypress.env('CYPRESS_CI')) this.skip();
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
      'analytics',
    );
    cy.visit(`${BASE_URL}new-home-page/`);
    cy.location('pathname').should('eq', '/new-home-page/');
  });

  it('loads page with expected sections - C32628', () => {
    cy.get('.homepage-hero').should('exist');
    cy.get('.homepage-common-tasks').should('exist');
    cy.get('.homepage-blog').should('exist');
    cy.get('.homepage-benefits-row').should('exist');
    cy.get('.homepage-email-updates-signup').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  describe('Hero section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads Hero-section contents - C32629', () => {
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
    it('navigates to PACT Act page - C32630', () => {
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
    it('displays sign-in/-up modal - C32631', () => {
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
    it('loads Common-tasks section-contents - C32632', () => {
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
            `?query=${searchTerm.replaceAll(' ', '%20')}&t=false`,
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
            req.reply(searchTypeaheadResponses[req.query.query]);
          }).as('typeahead');
        });

        // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
        it('runs text-input search - C32633', () => {
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
        it('runs typeahead-suggestion search - C32634', () => {
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
        it('passes empty-search to results-page - C32635', () => {
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
        it('navigates to appropriate search-tool-pages - C32636', () => {
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
      it('navigates to top pages - C32637', () => {
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

  describe('Blog/News section', () => {
    describe('Pathfinder article', () => {
      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('loads blog/news-section content - C32638', () => {
        // skipping page-content AXE-check -- already done in first test
        cy.get('.homepage-blog')
          .should('exist')
          .scrollIntoView()
          .within(() => {
            cy.get('h3#pathfinder-the-front-door-for-')
              .should('exist')
              .next('p')
              .should('exist')
              .and('not.be.empty');
          });
      });

      // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
      it('navigates to link-destinations - C32639', () => {
        // skipping page-content AXE-check -- already done in first test
        checkLinkNavigation(
          '.homepage-blog',
          'Pathfinder: The front door for engaging with VA',
          'https://pathfinder.va.gov/',
        );
        checkLinkNavigation(
          '.homepage-blog',
          'Read the full article',
          'https://pathfinder.va.gov/',
        );
        checkLinkNavigation(
          '.homepage-blog',
          'More VA news ',
          'https://news.va.gov/',
        );
      });
    });
  });

  describe('Benefit hubs section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads benefit-hubs section content - C32640', () => {
      const checkHubContents = h3Id => {
        cy.get(`.homepage-benefits-row [data-e2e="hub"] h3#${h3Id}`)
          .should('exist')
          .next('p')
          .should('exist')
          .and('not.be.empty');
      };

      // skipping page-content AXE-check -- already done in first test
      cy.get('[data-e2e="hub"]').should('have.length.at.least', 11);
      checkHubContents('service-member-benefits');
      checkHubContents('family-member-benefits');
      checkHubContents('burials-and-memorials');
      checkHubContents('careers-and-employment');
      checkHubContents('housing-assistance');
      checkHubContents('pension');
      checkHubContents('life-insurance');
      checkHubContents('education-and-training');
      checkHubContents('records');
      checkHubContents('health-care');
      checkHubContents('disability');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('navigates to benefit-hub pages - C32641', () => {
      const hubDivSelector = '.homepage-benefits-row [data-e2e="hub"]';

      // skipping page-content AXE-check -- already done in first test
      checkLinkNavigation(
        `${hubDivSelector} h3#service-member-benefits`,
        'Service member benefits',
        '/service-member-benefits/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#family-member-benefits`,
        'Family member benefits',
        '/family-member-benefits/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#burials-and-memorials`,
        'Burials and memorials',
        '/burials-memorials/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#careers-and-employment`,
        'Careers and employment',
        '/careers-employment/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#housing-assistance`,
        'Housing assistance',
        '/housing-assistance/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#pension`,
        'Pension',
        '/pension/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#life-insurance`,
        'Life insurance',
        '/life-insurance/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#education-and-training`,
        'Education and training',
        '/education/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#records`,
        'Records',
        '/records/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#health-care`,
        'Health care',
        '/health-care/',
      );
      checkLinkNavigation(
        `${hubDivSelector} h3#disability`,
        'Disability',
        '/disability/',
      );
    });
  });

  describe('Email-signup section', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('loads email-section contents - C32642', () => {
      // skipping page-content AXE-check -- already done in first test
      cy.get('.homepage-email-update-wrapper')
        .should('exist')
        .within(() => {
          cy.get('h2#sign-up-to-get-the-latest-va-u').should('exist');
          cy.get(
            'form[action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"]',
          ).should('exist');
        });
    });

    // TODO: Finalize & unskip when error-handling functionality is implemented in Staging.
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it.skip('handles invalid-email input - C32643', () => {
      // skipping page-content AXE-check -- already done in first test
      cy.get(
        'form[action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"]',
      )
        .scrollIntoView()
        .find('input#email')
        .clear()
        .type('invalid')
        .next('button[type="submit"]')
        .click();
      // TODO: Assert error-state.
    });

    // Form-submission functionality is disabled in Staging.
  });
});
