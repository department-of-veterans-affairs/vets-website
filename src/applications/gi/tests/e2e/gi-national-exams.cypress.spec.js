import data from '../data/calculator-constants.json';
import nationalExamsListMockdata from '../data/national-exams-list.json';
import nationalExamDetailsMockdata from '../data/national-exam-details.json';

describe('GI Bill Comparison Tool - National Exams Page', () => {
  // Common intercepts for all tests
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      statusCode: 200,
    });
    // Intercept feature toggles once for all tests
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'isUpdatedGi', value: true }],
      },
    }).as('featureToggles');
  });

  describe('National Exams List Page', () => {
    beforeEach(() => {
      // Intercept the exam list API call and visit the list page
      cy.intercept('GET', '**/v1/gi/lcpe/exams*', {
        statusCode: 200,
        body: nationalExamsListMockdata,
      }).as('nationalExamsList');

      cy.visit('/education/gi-bill-comparison-tool/national-exams');
      cy.wait('@nationalExamsList');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('renders the National Exams header, description, and reimbursement link correctly', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('[data-testid="national-exams-header"]')
        .should('exist')
        .and('be.visible')
        .and('have.text', 'National Exams');
      cy.get('[data-testid="national-exams-description"]')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          'Part of your entitlement can be used to cover the costs of national exams',
        );
      cy.get('[data-testid="national-exams-reimbursement-link"]')
        .should('exist')
        .shadow()
        .find('a')
        .should(
          'have.attr',
          'href',
          'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/',
        )
        .and(
          'contain.text',
          'Find out how to get reimbursed for national tests',
        );
    });

    it('paginates correctly when there are more than 10 exams', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('#results-summary').should('contain', 'Showing 1-10');
      cy.get('[data-testid="currentPage"]')
        .shadow()
        .find('[aria-label="Next page"]')
        .click();
      cy.get('#results-summary').should('contain', 'Showing 11-19');
    });

    it('displays an error message when national exams fetch fails', () => {
      // Override the exam list intercept to simulate an error
      cy.injectAxeThenAxeCheck();
      cy.intercept('GET', '**/v1/gi/lcpe/exams*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('nationalExamsError');

      // Revisit the page to trigger the error state
      cy.visit('/education/gi-bill-comparison-tool/national-exams');
      cy.wait('@nationalExamsError');
      cy.get('va-alert[data-e2e-id="alert-box"]')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'We can’t load the national exams list right now');
    });

    it('displays a loading indicator while national exams are loading', () => {
      // Override with a delayed response
      cy.intercept('GET', '**/v1/gi/lcpe/exams*', {
        delayMs: 2000,
        statusCode: 200,
        body: nationalExamsListMockdata,
      }).as('nationalExamsListDelayed');

      // Visit the page and check for the loading indicator
      cy.visit('/education/gi-bill-comparison-tool/national-exams');
      cy.injectAxeThenAxeCheck();
      cy.get('va-loading-indicator')
        .should('exist')
        .and('be.visible');
      cy.wait('@nationalExamsListDelayed');
      cy.get('va-loading-indicator').should('not.exist');
    });

    it('focuses on results summary after changing page', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('va-pagination').should('exist');
      cy.get('va-pagination')
        .shadow()
        .find('[aria-label="Next page"]')
        .click();
      cy.get('#results-summary').should('have.focus');
    });

    it('navigates to exam details page when the first exam link is clicked', () => {
      // Intercept the exam details API call before clicking the link
      cy.injectAxeThenAxeCheck();
      cy.intercept('GET', '**/v1/gi/lcpe/exams/1@acce9', {
        statusCode: 200,
        body: nationalExamDetailsMockdata,
      }).as('examDetails');

      cy.get('ul[role="list"] > li')
        .first()
        .within(() => {
          cy.get('va-link').click();
        });
      cy.wait('@examDetails');
      cy.location('pathname').should(
        'eq',
        '/education/gi-bill-comparison-tool/national-exams/1@acce9',
      );
      cy.get('h1.vads-u-margin-bottom--3')
        .should('be.visible')
        .and('contain.text', 'AP-advanced placement exams');
      cy.get('h3.vads-u-margin-bottom--2')
        .should('be.visible')
        .and('contain.text', 'Admin Info');
      cy.get('.provider-info-container')
        .should('be.visible')
        .and('contain.text', 'College Board');
      cy.get('va-link')
        .contains('Get link to VA Form 22-0810 to download')
        .should('exist');
    });
  });

  describe('National Exam Details Page', () => {
    beforeEach(() => {
      // For details page tests with only one test, set up a specific mock response
      const singleTestDetails = {
        exam: {
          enrichedId: '1@acce9',
          name: 'AP-ADVANCED PLACEMENT EXAMS',
          tests: [
            {
              name: 'AP Exam Fee International',
              fee: '127',
              beginDate: '01-NOV-16',
              endDate: '30-NOV-23',
            },
          ],
          institution: {
            name: 'COLLEGE BOARD',
            physicalAddress: {
              address1: 'PO BOX 6671',
              address2: null,
              address3: null,
              city: 'PRINCETON',
              state: 'NJ',
              zip: '08541',
              country: 'USA',
            },
            mailingAddress: {
              address1: 'PO BOX 6671',
              address2: null,
              address3: null,
              city: 'PRINCETON',
              state: 'NJ',
              zip: '08541',
              country: 'USA',
            },
            webAddress: null,
          },
        },
      };
      cy.intercept('GET', '**/v1/gi/lcpe/exams/1@acce9', {
        statusCode: 200,
        body: singleTestDetails,
      }).as('examDetailsSingle');
      cy.visit('/education/gi-bill-comparison-tool/national-exams/1@acce9');
      cy.wait('@examDetailsSingle');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('renders exam details correctly when there is only one test', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('h1.vads-u-margin-bottom--3')
        .should('be.visible')
        .and('contain.text', 'AP-advanced placement exams');
      cy.get('.exam-single-test')
        .should('exist')
        .within(() => {
          cy.get('h3').should('contain.text', 'Test Info');
          cy.get('p').should('contain.text', 'Showing 1 of 1 test');
          cy.contains('Fee Description:').should('be.visible');
          cy.contains('AP Exam Fee International').should('be.visible');
        });
    });
  });
});
