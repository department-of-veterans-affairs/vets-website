// Relative imports.
import stub from '../../constants/stub.json';
import { TOOL_TIP_CONTENT } from '../../constants';

const SELECTORS = {
  APP: '[data-e2e-id="yellow-ribbon-app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  ERROR_ALERT_BOX: '.usa-alert.usa-alert-error',
};

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck();
}

describe('functionality of Yellow Ribbons', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('search the form and expect dom to have elements on success', () => {
    cy.server();
    cy.route({
      method: 'GET',
      response: stub,
      status: 200,
      url:
        '/v0/gi/yellow_ribbon_programs?city=Austin&name=university&page=1&per_page=10&state=TX',
    }).as('getSchoolsInYR');

    // navigate to yellow-ribbon and make axe check on browser
    cy.visit('/education/yellow-ribbon-participating-schools/');
    axeTestPage();

    // Ensure App is present
    cy.get(SELECTORS.APP);

    // Ensure form is present
    cy.get(SELECTORS.SEARCH_FORM);

    // Fill out and submit the form.
    cy.get(`${SELECTORS.SEARCH_FORM} input[name="yr-search-name"]`).type(
      'university',
    );
    cy.get(`${SELECTORS.SEARCH_FORM} select`).select(`Texas`);

    cy.get(`${SELECTORS.SEARCH_FORM} input[name="yr-search-city"]`).type(
      'Austin',
    );
    cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
    cy.wait('@getSchoolsInYR');

    // A11y check the search results.
    axeTestPage();

    // Check results to see if variety of nodes exist.
    cy.get(`${SELECTORS.SEARCH_RESULTS} li`)
      // Check location.
      .should('contain', 'Austin, TX')
      // Check contribution amount.
      .should('contain', '$8,500')
      // Check eligible students.
      .should('contain', '250 students')
      // Check degree level.
      .should('contain', 'All eligible students')
      .should('contain', 'Undergraduate')
      // Check website link.
      .should('contain', 'www.concordia.edu');

    // Ensure Tool Tip exists
    cy.get(`${SELECTORS.APP} .form-expanding-group`).click();
    cy.get(`${SELECTORS.APP} .form-expanding-group-open`).should(
      'contain',
      TOOL_TIP_CONTENT,
    );

    // Ensure Alert Box exists
    cy.get(`${SELECTORS.APP} .usa-alert.usa-alert-info`);
    // Ensure Alert Box Closes
    cy.get(`${SELECTORS.APP} .usa-alert.usa-alert-info button`).click();
    cy.get(`${SELECTORS.APP} .usa-alert.usa-alert-info`).should('not.exist');
  });

  it('search the form and expect dom to have elements on error', () => {
    cy.server();
    cy.route({
      method: 'GET',
      response: [],
      status: 500,
      url:
        '/v0/gi/yellow_ribbon_programs?city=Austin&name=university&page=1&per_page=10&state=TX',
    }).as('getSchoolsInYR');

    // navigate to yellow-ribbon and make axe check on browser
    cy.visit('/education/yellow-ribbon-participating-schools/');
    axeTestPage();

    // Ensure App is present
    cy.get(SELECTORS.APP);

    // Ensure form is present
    cy.get(SELECTORS.SEARCH_FORM);

    // Fill out and submit the form.
    cy.get(`${SELECTORS.SEARCH_FORM} input[name="yr-search-name"]`).type(
      'university',
    );
    cy.get(`${SELECTORS.SEARCH_FORM} select`).select(`Texas`);

    cy.get(`${SELECTORS.SEARCH_FORM} input[name="yr-search-city"]`).type(
      'Austin',
    );
    cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
    cy.wait('@getSchoolsInYR');

    // Ensure ERROR Alert Box exists
    cy.get(`${SELECTORS.ERROR_ALERT_BOX}`)
      // Check Headline.
      .should('contain', 'Something went wrong')
      // Check contain error message
      .should(
        'contain',
        'We’re sorry. Something went wrong on our end. Please try again later.',
      );

    // A11y check the search results.
    axeTestPage();
  });
});
