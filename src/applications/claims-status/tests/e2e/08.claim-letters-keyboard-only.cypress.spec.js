import claimLetters from './fixtures/mocks/claim-letters/list.json';

describe('Claim Letters Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/claim_letters', claimLetters.data).as(
      'claimLetters',
    );

    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'cst_include_ddl_boa_letters', value: true },
          { name: 'claim_letters_access', value: true },
        ],
      },
    });

    cy.login();
  });

  it('Can tab to download link and pagination', () => {
    cy.visit('track-claims/your-claim-letters');
    cy.wait(['@claimLetters']);
    cy.tabToElement('#claim-letter-list va-link').should('exist');
    cy.tabToElement('va-pagination').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('Pagination buttons work properly', () => {
    cy.visit('track-claims/your-claim-letters');
    cy.wait(['@claimLetters']);

    // 'Prev' button should not show on first page
    cy.contains(/Previous/i).should('not.exist');

    // Click 'Next' button
    cy.tabToElement('.usa-pagination__next-page').realPress('Enter');

    // Now on second page
    // 'Previous' button should now be shown
    cy.contains(/Previous/i).should('exist');

    // Click 'Prev' button
    cy.tabToElement('.usa-pagination__previous-page', false, true) // had to use forward = false parameter to avoid a timeout error
      .realPress('Enter');

    // Back on first page
    // 'Prev' button should not show
    cy.contains(/Previous/i).should('not.exist');

    cy.injectAxeThenAxeCheck();
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
    cy.visit('track-claims/your-claim-letters');
    cy.wait(['@claimLetters']);

    cy.tabToElement('#claim-letter-list va-link').realPress('Enter');

    cy.wait('@downloadFile')
      .its('response.statusCode')
      .should('eq', 200);

    cy.readFile(`${Cypress.config('downloadsFolder')}/${filename}`).should(
      'contain',
      'Test claim letter',
    );

    cy.injectAxeThenAxeCheck();
  });
});
