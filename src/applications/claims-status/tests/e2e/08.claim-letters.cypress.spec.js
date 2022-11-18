// import { cy } from 'date-fns/locale';
import claimLetters from './fixtures/mocks/claim-letters.json';

describe('Claim Letters Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/claim_letters', claimLetters.data);

    // TODO: intercept user data calls
    // Check features

    cy.login();
    cy.visit('track-claims/your-claim-letters');
    cy.injectAxe();
  });

  it('Displays a list of letters', () => {
    // cy.intercept('GET', '/v0/claim_letters', claimLetters.data.slice(0, 8));
    cy.get('h1').should('have.text', 'Your VA claim letters');
    cy.get('ol').should.exist;
    cy.get('ol > li').should('have.length', 10);

    cy.get('va-pagination').should.exist;

    cy.axeCheck();
  });

  it('Paginates when there are more than 10 letters', () => {
    cy.get('ol > li').should('have.length', 10);

    // TODO: Check the number of pages in the va-pagination component
    // We should know ahead of time how many pages should appear
    cy.get('va-pagination').should.exist;

    cy.axeCheck();
  });

  it("Doesn't show va-pagination if there are less than 10 letters", () => {
    cy.intercept('GET', '/v0/claim_letters', claimLetters.data.slice(0, 8));
    cy.get('ol > li').should('have.length', 8);

    cy.get('va-pagination').should('not.exist');

    cy.axeCheck();
  });

  it('Pagination buttons work properly', () => {
    cy.get('va-pagination')
      .shadow()
      .as('shadow');

    // 'Prev' button should not show on first page
    cy.get('@shadow')
      .findByText(/Prev/i)
      .should('not.exist');

    // Click 'Next' button
    cy.get('@shadow')
      .findByText(/Next/i)
      .click();

    // Now on second page
    // 'Prev' button should now be shown
    cy.get('@shadow').findByText(/Prev/i).should.exist;

    // Click 'Prev' button
    cy.get('@shadow')
      .findByText(/Prev/i)
      .click();

    // Back on first page
    // 'Prev' button should not show
    cy.get('@shadow')
      .findByText(/Prev/i)
      .should('not.exist');

    cy.axeCheck();
  });

  it('Displays a "No letters to show" message if there are no letters', () => {
    cy.intercept('GET', '/v0/claim_letters', []);

    cy.get('h2.vads-u-font-size--h3')
      .first()
      .should('have.text', 'No letters to show');

    // List shouldn't show
    cy.get('ol').should('not.exist');

    cy.axeCheck();
  });

  it('Displays a server error message when status code is 500', () => {
    cy.intercept('GET', '/v0/claim_letters', { statusCode: 500 });

    cy.get('h2.vads-u-font-size--h3')
      .first()
      .should('have.text', 'We can’t load this page');
    cy.get('h2.vads-u-font-size--h3 + div').contains(
      'Please refresh this page or try again later',
    );

    cy.axeCheck();
  });

  it('Displays an unauthenticated error message when status code is 403', () => {
    cy.intercept('GET', '/v0/claim_letters', { statusCode: 403 });

    cy.get('h2.vads-u-font-size--h3')
      .first()
      .should('have.text', 'We can’t load this page');
    cy.get('h2.vads-u-font-size--h3 + div').contains(
      'Please double check the URL',
    );

    cy.axeCheck();
  });

  it('Displays an unauthenticated error message when status code is 401', () => {
    cy.intercept('GET', '/v0/claim_letters', { statusCode: 401 });

    cy.get('h2.vads-u-font-size--h3')
      .first()
      .should('have.text', 'We can’t load this page');
    cy.get('h2.vads-u-font-size--h3 + div').contains(
      'Please double check the URL',
    );

    cy.axeCheck();
  });

  // it('Download links work properly')
});
