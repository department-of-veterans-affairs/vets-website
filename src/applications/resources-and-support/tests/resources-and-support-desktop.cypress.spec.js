import { truncate } from 'lodash';
import articles from './articles.json';
import * as h from './helpers';

describe('Resources & Support (Desktop)', () => {
  beforeEach(() => {
    cy.intercept('/resources/search/articles.json', articles);
  });

  it('shows the appropriate elements for the desktop view and searching', () => {
    // Setup with search term
    cy.viewport(1000, 2000);
    cy.visit('/resources/search/?query=benefits');
    cy.injectAxeThenAxeCheck();

    // Check header
    h.verifyText('h1', 'Resources and Support Search Results');

    // Check search inputs area
    h.verifySearchInputsExist();
    h.verifyText(
      '#pagination-summary',
      'Showing 1 - 6 of 6 results for "benefits"',
    );

    // Verify first result
    const firstResult = articles[38];

    h.verifyResult(
      firstResult?.entityUrl?.path,
      'Question and answer',
      firstResult?.title,
      truncate(firstResult?.introText, { length: 190 }),
    );

    // Verify second result
    const secondResult = articles[31];

    h.verifyResult(
      secondResult?.entityUrl?.path,
      'Question and answer',
      secondResult?.title,
      truncate(secondResult?.introText, { length: 190 }),
      1,
    );

    // Verify sixth result
    const sixthResult = articles[14];

    h.verifyResult(
      sixthResult?.entityUrl?.path,
      'Step-by-step',
      sixthResult?.title,
      truncate(sixthResult?.introText, { length: 190 }),
      5,
    );

    // Use a new search term that will have paginated results
    h.clearInput('va-search-input');

    h.typeInInput('va-search-input', 'VA');
    cy.realPress('Enter');

    h.verifyText(
      '#pagination-summary',
      'Showing 1 - 10 of 25 results for "VA"',
    );

    h.goToNextPage();
    h.verifySearchInputsExist();

    // Check search results summary
    h.verifyText(
      '#pagination-summary',
      'Showing 11 - 20 of 25 results for "VA"',
    );

    // Erase search term and start over with a term with no results
    h.clearInput('va-search-input');

    h.typeInInput('va-search-input', 'discharge upgrade');
    cy.realPress('Enter');

    h.verifyText(
      '#pagination-summary',
      'We didn’t find any resources and support articles for "discharge upgrade." Try using different words or .',
    );

    // Do a sitewide search
    h.clickSitewideRadio();

    h.clearInput('va-search-input');

    h.typeInInput('va-search-input', 'benefits');
    cy.realPress('Enter');

    h.verifyUrl('/search/?query=benefits');
  });
});
