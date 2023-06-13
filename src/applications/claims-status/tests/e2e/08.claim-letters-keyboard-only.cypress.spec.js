import claimLetters from './fixtures/mocks/claim-letters/list.json';

describe('Claim Letters Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/claim_letters', claimLetters.data);

    cy.login();
    cy.visit('track-claims/your-claim-letters');
    cy.injectAxe();
  });

  it('Can tab to download link and pagination', () => {
    cy.tabToElement('va-link').should('exist');
    cy.tabToElement('va-pagination').should('exist');
    cy.axeCheck();
  });

  it('Pagination buttons work properly', { includeShadowDom: true }, () => {
    // 'Prev' button should not show on first page
    cy.contains(/Prev/i).should('not.exist');

    // Click 'Next' button
    cy.tabToElement('.pagination-next li .button-next').realPress('Enter');

    // Now on second page
    // 'Prev' button should now be shown
    cy.contains(/Prev/i).should.exist;

    // Click 'Prev' button
    cy.tabToElement('.pagination-prev li .button-prev', false, true) // had to use forward = false parameter to avoid a timeout error
      .realPress('Enter');

    // Back on first page
    // 'Prev' button should not show
    cy.contains(/Prev/i).should('not.exist');

    cy.axeCheck();
  });

  it('Downloads a file successfully when link is focused and enter key is pressed', () => {
    // Normally it would make sense to simulate downloading a PDF,
    // but Cypress doesn't handle PDF files very well. When I attempted
    // to use a PDF file as the fixture, the resulting file's contents
    // would always end up corrupted, so using a TXT file instead
    cy.intercept('GET', '/v0/claim_letters/**', {
      statusCode: 200,
      headers: {
        'Content-disposition': 'attachment; filename=ClaimLetter-2022-9-22.txt',
      },
      fixture:
        'applications/claims-status/tests/e2e/fixtures/mocks/ClaimLetter-2022-9-22.txt',
    }).as('downloadFile');

    cy.tabToElement('va-link').realPress('Enter');

    cy.wait('@downloadFile')
      .its('response.statusCode')
      .should('eq', 200);

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/ClaimLetter-2022-9-22.txt`,
    ).should('contain', 'Test claim letter');

    cy.axeCheck();
  });
});
