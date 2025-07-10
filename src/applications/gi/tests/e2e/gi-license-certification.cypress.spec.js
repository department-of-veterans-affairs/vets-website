import data from '../data/calculator-constants.json';
import lcListMockData from '../data/lc-list.json';
import lcDetailsMockData from '../data/lc-details.json';

describe('GI Bill Comparison Tool - License & Certification Pages', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      statusCode: 200,
    });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'gi_comparison_tool_lce_toggle_flag', value: true }],
      },
    }).as('featureToggles');
  });

  describe('License & Certification Search Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearch');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('renders the search page header and description correctly', () => {
      cy.get('h1')
        .should('exist')
        .and('contain.text', 'Licenses, certifications, and prep courses');
      cy.get('p.lc-description')
        .first()
        .should('contain.text', 'Use the search tool to find out which tests');
    });

    it('displays typeahead suggestions when user types in search box', () => {
      cy.get('#keyword-search input').type('electric');

      cy.get('.suggestions-list').should('be.visible');

      cy.get('.suggestions-list .suggestion')
        .first()
        .find('.keyword-suggestion-container')
        .within(() => {
          cy.contains('electric');
          cy.contains('results').should('be.visible');
        });

      cy.get('.suggestions-list .suggestion')
        .should('have.length.at.least', 2)
        .each(($suggestion, index) => {
          if (index > 0) {
            cy.wrap($suggestion)
              .invoke('text')
              .should('match', /electric/i);
          }
        });

      cy.get('#clear-input').click();
      cy.get('.suggestions-list').should('not.exist');
    });

    it('redirects to results page with search parameters when form is submitted', () => {
      cy.get('#keyword-search input').type('electric');

      cy.get('select.dropdown-filter').select('License');

      cy.get('va-button')
        .contains('Submit')
        .click();

      cy.url().should('include', '/results');
      cy.url().should('include', 'name=electric');
      cy.url().should('include', 'category=license');

      cy.get('h1').should('contain.text', 'Search results');

      cy.get('va-card').should('exist');
    });

    it('displays error state when fetching results fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
      cy.wait('@lcError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });

  describe('License & Certification Search Results Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearch');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );
      cy.wait('@lcSearch');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('displays search results', () => {
      cy.get('h1').should('contain.text', 'Search results');
      cy.get('va-card').should('have.length', 10);
    });

    it('updates results correctly when category checkboxes and state dropdown are changed', () => {
      cy.get('va-checkbox[name="all"]')
        .shadow()
        .find('input[type="checkbox"]')
        .uncheck({ force: true });
      cy.get('va-checkbox[name="license"]')
        .shadow()
        .find('input[type="checkbox"]')
        .check({ force: true });
      cy.get('va-checkbox[name="certification"]')
        .shadow()
        .find('input[type="checkbox"]')
        .uncheck({ force: true });

      cy.get('.state-dropdown select#State').select('CA', { force: true });

      cy.get('.update-results-button-after').click();

      cy.url().should('include', 'category=license');
      cy.url().should('include', 'state=CA');

      cy.get('va-card')
        .should('exist')
        .each($card => {
          cy.wrap($card)
            .find('h4.lc-card-subheader')
            .should('contain.text', 'License');

          cy.wrap($card)
            .find('p.state')
            .should('contain.text', 'California');
        });
    });

    it('displays loading state while fetching results', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        delay: 2000,
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearchDelayed');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );

      cy.get('va-loading-indicator')
        .should('exist')
        .and('be.visible');

      cy.wait('@lcSearchDelayed');
      cy.get('va-loading-indicator').should('not.exist');
    });

    it('displays error state when fetching results fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );
      cy.wait('@lcError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });

  describe('License & Certification Detail Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        statusCode: 200,
        body: lcDetailsMockData,
      }).as('lcDetails');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );
      cy.wait('@lcDetails');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('displays license/certification details correctly', () => {
      cy.get('h1')
        .should('exist')
        .and('contain.text', 'General Electrician');
      cy.get('.lc-result-details')
        .should('exist')
        .within(() => {
          cy.get('h2')
            .should('exist')
            .and('contain.text', 'Certification');
          cy.get('h3')
            .contains('Admin info')
            .should('be.visible');
          cy.get('.name-wrapper').should('contain.text', 'Electric School');
          cy.contains('Certification tests are available nationally').should(
            'be.visible',
          );
          cy.get('va-link')
            .shadow()
            .find('a')
            .should(
              'have.attr',
              'href',
              'https://www.va.gov/find-forms/about-form-22-0803/',
            )
            .and('contain.text', 'Get VA Form22-0803 to download');
          cy.get('h3')
            .contains('Test info')
            .should('be.visible');
        });
    });

    it('renders test details correctly when there is only one test', () => {
      const singleTestData = {
        lac: {
          enrichedId: '1@sec',
          lacNm: 'General Electrician',
          eduLacTypeNm: 'Certification',
          institution: {
            name: 'Electric School',
            physicalAddress: {
              address1: '3500 Lacey Road',
              city: 'Downers Grove',
              state: 'IL',
              zip: '60515',
            },
            mailingAddress: {
              address1: '3500 Lacey Road',
              city: 'Downers Grove',
              state: 'IL',
              zip: '60515',
            },
          },
          tests: [
            {
              name: 'General Electrician Exam',
              fee: '370',
            },
          ],
        },
      };

      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        statusCode: 200,
        body: singleTestData,
      }).as('lcDetailsSingle');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );
      cy.wait('@lcDetailsSingle');

      cy.get('.single-test-wrapper')
        .should('exist')
        .within(() => {
          cy.get('h4').should(
            'contain.text',
            'Test name: General Electrician Exam',
          );
          cy.get('.fee').should('contain.text', 'Fee: $370.00');
        });
    });

    it('displays loading state while fetching details', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        delay: 2000,
        statusCode: 200,
        body: lcDetailsMockData,
      }).as('lcDetailsDelayed');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );

      cy.get('va-loading-indicator')
        .should('exist')
        .and('be.visible');

      cy.wait('@lcDetailsDelayed');
      cy.get('va-loading-indicator').should('not.exist');
    });

    it('displays error state when details fetch fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcDetailsError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );
      cy.wait('@lcDetailsError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });
});
