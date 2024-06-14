// Relative imports.
import stub from '../../constants/stub.json';
import { TOOL_TIP_CONTENT } from '../../constants';

const SELECTORS = {
  APP: '[data-e2e-id="yellow-ribbon-app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  ALERT_BOX_ERROR: 'va-alert[status="error"]',
  ALERT_BOX_INFO: 'va-alert[status="info"]',
};

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
}

describe('functionality of Yellow Ribbons', () => {
  // cy.axeCheck() is required at least once, is wrapped in axeTestPage() above for DRYness, and used throughout these tests
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('search the form and expect dom to have elements on success', () => {
    cy.intercept(
      'GET',
      '/v0/gi/yellow_ribbon_programs?city=Austin&name=university&page=1&per_page=10&state=TX',
      stub,
    ).as('getSchoolsInYR');

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
    cy.get(`${SELECTORS.SEARCH_FORM} va-button`).click();
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
      .should('contain', 'Visit Concordia University-Texas website');

    // Ensure Tool Tip exists
    cy.get(`${SELECTORS.APP} va-additional-info`).click();
    cy.get(`${SELECTORS.APP} va-additional-info`).should(
      'contain',
      TOOL_TIP_CONTENT,
    );

    // Ensure Alert Box exists
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_INFO}`);
    // Ensure Alert Box Closes
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_INFO}`)
      .shadow()
      .find('button')
      .click();
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_INFO}`)
      .shadow()
      .should('not.exist');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('search the form and expect dom to have elements on error', () => {
    cy.intercept(
      'GET',
      '/v0/gi/yellow_ribbon_programs?city=Austin&name=university&page=1&per_page=10&state=TX',
      { statusCode: 500, body: [] },
    ).as('getSchoolsInYR');

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
    cy.get(`${SELECTORS.SEARCH_FORM} va-button`).click();
    cy.wait('@getSchoolsInYR');

    // Ensure ERROR Alert Box exists
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_ERROR}`);

    // Check Error Headline.
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_ERROR}`)
      .find('h3')
      .should('contain', 'Something went wrong');

    // Check contain error message
    cy.get(`${SELECTORS.APP} ${SELECTORS.ALERT_BOX_ERROR}`)
      .find('div')
      .should(
        'contain',
        'We’re sorry. Something went wrong on our end. Please try again later.',
      );

    // A11y check the search results.
    axeTestPage();
  });
});
