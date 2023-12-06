import featureToggleEnabled from './fixtures/mocks/claim-letters/feature-toggle-enabled.json';
import claimLetters from './fixtures/mocks/claim-letters/list.json';

describe('Claim Letters Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/claim_letters', claimLetters.data);
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggleEnabled).as(
      'featureToggleEnabled',
    );

    cy.login();
    cy.visit('track-claims/your-claim-letters');
    // adds .focus() so tests are able to work with the va-loading-indicator web component
    // cy.get('.va-header-logo').focus();
    // TO DO: remove this comment block, as it is not needed.
    cy.injectAxe();
  });

  it('Can tab to download link and pagination', () => {
    cy.tabToElement('va-link').should('exist');
    cy.tabToElement('va-pagination').should('exist');
    cy.axeCheck();
  });

  it('Pagination buttons work properly', () => {
    // 'Prev' button should not show on first page
    cy.contains(/Previous/i).should('not.exist');

    // Click 'Next' button
    cy.tabToElement('.pagination-next li .button-next').realPress('Enter');

    // Now on second page
    // 'Previous' button should now be shown
    cy.contains(/Previous/i).should('exist');

    // Click 'Prev' button
    cy.tabToElement('.pagination-prev li .button-prev', false, true) // had to use forward = false parameter to avoid a timeout error
      .realPress('Enter');

    // Back on first page
    // 'Prev' button should not show
    cy.contains(/Previous/i).should('not.exist');

    cy.axeCheck();
  });

  it('Downloads a file successfully when link is focused and enter key is pressed', () => {
    const filename = 'ClaimLetter-2022-9-22.txt';

    // Normally it would make sense to simulate downloading a PDF,
    // but Cypress doesn't handle PDF files very well. When I attempted
    // to use a PDF file as the fixture, the resulting file's contents
    // would always end up corrupted, so using a TXT file instead
    cy.intercept('GET', '/v0/claim_letters/**', {
      statusCode: 200,
      headers: {
        'Content-disposition': `attachment; filename=${filename}`,
      },
      fixture:
        'applications/claims-status/tests/e2e/fixtures/mocks/claim-letters/letter.txt',
    }).as('downloadFile');

    cy.tabToElement('va-link').realPress('Enter');

    cy.wait('@downloadFile')
      .its('response.statusCode')
      .should('eq', 200);

    cy.readFile(`${Cypress.config('downloadsFolder')}/${filename}`).should(
      'contain',
      'Test claim letter',
    );

    cy.axeCheck();
  });
});
