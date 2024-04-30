import stub from '../../constants/stub.json';
import zeroResultsStub from '../../constants/stubZeroResults.json';

const SELECTORS = {
  APP: '[data-e2e-id="search-app"]',
  SEARCH_INPUT: '#search-field',
  SEARCH_BUTTON: '#search-field + button[type="submit"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULTS_EMPTY: '[data-e2e-id="search-results-empty"]',
  SEARCH_RESULTS_TITLE: '[data-e2e-id="result-title"]',
  ERROR_ALERT_BOX: '[data-e2e-id="alert-box"]',
};

const enableDropdownComponent = () => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        {
          name: 'search_dropdown_component_enabled',
          value: true,
        },
      ],
    },
  });
};

describe('Sitewide Search smoke test', () => {
  it('successfully searches and renders results from the global search', () => {
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    }).as('getSearchResultsGlobal');

    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();

    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');

    cy.wait('@getSearchResultsGlobal');
    cy.axeCheck();

    cy.get('va-link[text="Veterans Benefits Administration Home"]').should(
      'exist',
    );
    cy.get(
      `${
        SELECTORS.SEARCH_RESULTS
      } li va-link[href="https://benefits.va.gov/benefits/"]`,
    ).should('exist');
  });

  it('successfully searches and renders results from the results page', () => {
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    }).as('getSearchResultsPage');

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_INPUT}`).focus();
    cy.get(`${SELECTORS.SEARCH_INPUT}`).clear();
    cy.get(`${SELECTORS.SEARCH_INPUT}`).type('benefits');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).click();

    cy.wait('@getSearchResultsPage');
    cy.axeCheck();

    cy.get('va-link[text="Veterans Benefits Administration Home"]').should(
      'exist',
    );
    cy.get(
      `${
        SELECTORS.SEARCH_RESULTS
      } li va-link[href="https://benefits.va.gov/benefits/"]`,
    ).should('exist');
  });

  it('fails to search and has an error', () => {
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: [],
      statusCode: 500,
    }).as('getSearchResultsFailed');

    cy.visit('/search/?query=benefits');
    cy.injectAxeThenAxeCheck();

    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');

    cy.wait('@getSearchResultsFailed');

    cy.get(`${SELECTORS.ERROR_ALERT_BOX} h2`).should(
      'have.text',
      'Your search didn’t go through',
    );

    cy.axeCheck();
  });

  describe('Maintenance Window Message Display', () => {
    const maintenanceTestCases = [
      { date: '2021-03-16T20:00:00.000Z', description: 'Tuesday at 4 PM EST' }, // Within Tuesday maintenance window
      { date: '2021-03-18T20:00:00.000Z', description: 'Thursday at 4 PM EST' }, // Within Thursday maintenance window
      { date: '2021-03-16T21:00:00.000Z', description: 'Tuesday at 5 PM EST' }, // Within Tuesday maintenance window
      { date: '2021-03-18T21:00:00.000Z', description: 'Thursday at 5 PM EST' }, // Within Thursday maintenance window
    ];

    maintenanceTestCases.forEach(testCase => {
      it(`should display maintenance message during maintenance window when 0 results on ${
        testCase.description
      }`, () => {
        cy.clock(new Date(testCase.date).getTime(), ['Date']);

        enableDropdownComponent();
        cy.intercept('GET', '/v0/search?query=benefits', {
          body: zeroResultsStub,
          statusCode: 200,
        }).as('getSearchResultsGlobal');

        cy.visit('/search?query=benefits');
        cy.injectAxeThenAxeCheck();

        cy.get('[data-e2e-id="search-app"]').within(() => {
          cy.get('va-maintenance-banner')
            .should('exist')
            .and('contain', 'We’re working on Search VA.gov right now.');
        });

        cy.axeCheck();
      });
    });

    it('should not display message if returns with search results at 4 PM EST on a Tuesday', () => {
      // Mocking the date and time to Tuesday at 4 PM EST (EDT, so UTC-4)
      cy.clock(new Date('2021-03-16T20:00:00.000Z').getTime(), ['Date']);

      enableDropdownComponent();
      cy.intercept('GET', '/v0/search?query=benefits', {
        // Using your provided "stub" for successful search results here
        body: stub,
        statusCode: 200,
      }).as('getSearchResultsDuringMaintenance');

      cy.visit('/search?query=benefits');
      cy.injectAxeThenAxeCheck();

      cy.wait('@getSearchResultsDuringMaintenance');

      cy.get('[data-e2e-id="search-app"]').within(() => {
        // Ensuring the maintenance banner does not appear
        cy.get('va-maintenance-banner').should('not.exist');
        // Ensuring search results are displayed
        cy.get('[data-e2e-id="search-results"]').should('exist');
        cy.get('[data-e2e-id="result-title"]').should(
          'have.length.at.least',
          1,
        );
      });
      cy.axeCheck();
    });

    const nonMaintenanceTestCases = [
      { date: '2021-03-15T18:00:00.000Z', description: 'Monday at 2 PM EST' }, // Monday
      { date: '2021-03-20T22:00:00.000Z', description: 'Saturday at 6 PM EST' }, // Saturday
      { date: '2021-03-21T13:00:00.000Z', description: 'Sunday at 9 AM EST' }, // Sunday
    ];

    nonMaintenanceTestCases.forEach(testCase => {
      it(`should not display maintenance message with no results on ${
        testCase.description
      }`, () => {
        cy.clock(new Date(testCase.date).getTime(), ['Date']);

        enableDropdownComponent();
        cy.intercept('GET', '/v0/search?query=benefits', {
          body: {
            data: {
              id: '',
              type: 'search_results_responses',
              attributes: {
                body: {
                  query: 'benefits',
                  web: {
                    total: 0,
                    nextOffset: 0,
                    spellingCorrection: null,
                    results: [],
                  },
                },
              },
            },
            meta: {
              pagination: {
                currentPage: 1,
                perPage: 10,
                totalPages: 0,
                totalEntries: 0,
              },
            },
          },
          statusCode: 200,
        }).as('getSearchResultsGlobal');

        cy.visit('/search?query=benefits');
        cy.injectAxeThenAxeCheck();

        cy.get('[data-e2e-id="search-app"]').within(() => {
          cy.get('va-maintenance-banner').should('not.exist');
        });

        cy.axeCheck();
      });
    });

    it('should resume normal functionality immediately after maintenance window ends', () => {
      // Mock a time immediately after the maintenance window, e.g., 6:01 PM EST on a Tuesday
      cy.clock(new Date('2021-03-16T23:01:00.000Z').getTime(), ['Date']);

      enableDropdownComponent();
      cy.intercept('GET', '/v0/search?query=benefits', {
        body: stub, // Assuming 'stub' is your normal response fixture for search results
        statusCode: 200,
      }).as('getSearchResultsGlobal');

      cy.visit('/search?query=benefits');
      cy.injectAxeThenAxeCheck();

      cy.get('[data-e2e-id="search-app"]').within(() => {
        cy.get('va-maintenance-banner').should('not.exist');
        cy.get('[data-e2e-id="search-results"]').should('exist');
      });

      cy.wait('@getSearchResultsGlobal')
        .its('response.statusCode')
        .should('eq', 200);

      cy.axeCheck();
    });
  });
});
