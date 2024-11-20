import { truncate } from 'lodash';
import articles from './articles.json';

const container = '[data-testid="rs-container"]';

describe('Resources & Support', () => {
  const verifyText = (selector, expectedValue, index = 0) =>
    cy
      .get(container)
      .find(selector)
      .eq(index)
      .should('be.visible')
      .should('have.text', expectedValue);

  const verifyShadowText = (wc, expectedValue, index = 0) =>
    cy
      .get(wc)
      .eq(index)
      .shadow()
      .find('a')
      .should('be.visible')
      .should('have.text', expectedValue);

  const verifyElement = (selector, index = 0) =>
    cy
      .get(container)
      .find(selector)
      .eq(index)
      .should('be.visible');

  const verifyUrl = linkUrl => cy.url().should('contain', linkUrl);

  const verifyResult = (selector, category, linkText, summary, index = 0) => {
    cy.get(container)
      .find('ul li')
      .eq(index)
      .should('exist')
      .within(() => {
        cy.get(`[id="${selector}"]`)
          .should('be.visible')
          .should('have.text', `Article type: ${category}`);

        verifyShadowText('va-link', linkText);

        cy.get('p')
          .should('be.visible')
          .should('have.text', summary);

        cy.get('va-link').click();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);

        verifyUrl(selector);

        cy.go('back');
      });
  };

  beforeEach(() => {
    cy.intercept('/resources/search/articles.json', articles);
  });

  it('shows the appropriate elements for the desktop view and searching', () => {
    cy.viewport(1000, 2000);
    cy.visit('/resources/search/?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyText('h1', 'Resources and Support Search Results');

    // Check search area
    verifyElement('va-radio');
    verifyText('va-radio-option', 'Resources and Support', 0);
    verifyText('va-radio-option', 'All VA.gov', 1);
    verifyElement('va-search-input');

    // Check search results summary
    verifyText(
      '#pagination-summary',
      'Showing 1 - 6 of 6 results for "benefits"',
    );

    // Verify first result
    const firstResult = articles[38];

    verifyResult(
      firstResult?.entityUrl?.path,
      'Question and answer',
      firstResult?.title,
      truncate(firstResult?.introText, { length: 190 }),
    );

    // Verify second result
    const secondResult = articles[31];

    verifyResult(
      secondResult?.entityUrl?.path,
      'Question and answer',
      secondResult?.title,
      truncate(secondResult?.introText, { length: 190 }),
      1,
    );

    // Verify sixth result
    const sixthResult = articles[14];

    verifyResult(
      sixthResult?.entityUrl?.path,
      'Step-by-step',
      sixthResult?.title,
      truncate(sixthResult?.introText, { length: 190 }),
      5,
    );
  });

  const expandSearchMenu = () => cy.get('va-icon[icon="add"]').click();

  const closeSearchMenu = () => cy.get('va-icon[icon="remove"]').click();

  const verifyElementNotVisible = selector =>
    cy.get(selector).should('not.be.visible');

  it('shows the appropriate elements for mobile view and searching', () => {
    cy.viewport(400, 1000);
    cy.visit('/resources/search/?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyText('h1', 'Resources and Support Search Results');

    const openIcon = 'va-icon[icon="add"]';
    const closeIcon = 'va-icon[icon="remove"]';

    verifyText('button', 'Search resources and support');
    verifyElement(openIcon);

    // Check search area
    verifyElementNotVisible('va-radio');
    verifyElementNotVisible('va-radio-option');
    verifyElementNotVisible('va-search-input');

    // Open search menu and check search area
    expandSearchMenu();

    verifyElement(closeIcon);
    verifyElement('va-radio');
    verifyText('va-radio-option', 'Resources and Support', 0);
    verifyText('va-radio-option', 'All VA.gov', 1);
    verifyElement('va-search-input');

    // Close search menu and check search area
    closeSearchMenu();

    verifyElementNotVisible('va-radio');
    verifyElementNotVisible('va-radio-option');
    verifyElementNotVisible('va-search-input');

    expandSearchMenu();

    // Check search results summary
    verifyText(
      '#pagination-summary',
      'Showing 1 - 6 of 6 results for "benefits"',
    );

    // Verify first result
    const firstResult = articles[38];

    verifyResult(
      firstResult?.entityUrl?.path,
      'Question and answer',
      firstResult?.title,
      truncate(firstResult?.introText, { length: 190 }),
    );

    // Verify second result
    const secondResult = articles[31];

    verifyResult(
      secondResult?.entityUrl?.path,
      'Question and answer',
      secondResult?.title,
      truncate(secondResult?.introText, { length: 190 }),
      1,
    );

    // Verify sixth result
    const sixthResult = articles[14];

    verifyResult(
      sixthResult?.entityUrl?.path,
      'Step-by-step',
      sixthResult?.title,
      truncate(sixthResult?.introText, { length: 190 }),
      5,
    );
  });
});
