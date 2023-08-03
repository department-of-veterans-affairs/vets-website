import claimLetters from './fixtures/mocks/claim-letters/list.json';
import featureToggleEnabled from './fixtures/mocks/claim-letters/feature-toggle-enabled.json';
import featureToggleDisabled from './fixtures/mocks/claim-letters/feature-toggle-disabled.json';

const generateErrorContent = (title, code) => {
  return {
    errors: [{ title, detail: title, code, status: code }],
  };
};

describe('Claim Letters Page', () => {
  context('feature toggle enabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/claim_letters', claimLetters.data);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggleEnabled);

      cy.login();
      cy.visit('track-claims/your-claim-letters');
      cy.injectAxe();
    });

    it('Displays a list of letters', () => {
      cy.get('h1').should('have.text', 'Your VA claim letters');
      cy.get('ol').should('exist');
      cy.get('ol > li').should('have.length', 10);

      cy.get('va-pagination').should('exist');

      cy.axeCheck();
    });

    it('Paginates when there are more than 10 letters', () => {
      cy.get('ol > li').should('have.length', 10);

      // TODO: Check the number of pages in the va-pagination component
      // We should know ahead of time how many pages should appear
      cy.get('va-pagination').should('exist');

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

    it('Displays a "No claim letters" message if there are no letters', () => {
      cy.intercept('GET', '/v0/claim_letters', []);

      cy.findByText(/No claim letters/i).should('exist');

      // List shouldn't show
      cy.get('ol').should('not.exist');

      cy.axeCheck();
    });

    it('Displays a server error message when status code is 500', () => {
      cy.intercept('GET', '/v0/claim_letters', {
        statusCode: 500,
        body: generateErrorContent('Internal server error', '500'),
      });

      cy.findByText(/We can’t load this page/i).should('exist');
      cy.findByText(/Please refresh this page or try again later/i).should(
        'exist',
      );

      cy.axeCheck();
    });

    it('Displays a forbidden error message when status code is 403', () => {
      cy.intercept('GET', '/v0/claim_letters', {
        statusCode: 403,
        body: generateErrorContent('Forbidden', '403'),
      });

      cy.findByText(/We can’t load this page/i).should('exist');
      cy.findByText(/Please double check the URL/i).should('exist');

      cy.axeCheck();
    });

    it('Displays an unauthenticated error message when status code is 401', () => {
      cy.intercept('GET', '/v0/claim_letters', {
        statusCode: 401,
        body: generateErrorContent('Not authorized', '401'),
      });

      cy.findByText(/We can’t load this page/i).should('exist');
      cy.findByText(/Please double check the URL/i).should('exist');

      cy.axeCheck();
    });

    it('Downloads a file successfully when link is clicked', () => {
      // Normally it would make sense to simulate downloading a PDF,
      // but Cypress doesn't handle PDF files very well. When I attempted
      // to use a PDF file as the fixture, the resulting file's contents
      // would always end up corrupted, so using a TXT file instead
      cy.intercept('GET', '/v0/claim_letters/**', {
        statusCode: 200,
        headers: {
          'Content-disposition': 'attachment; filename=ClaimLetter.txt',
        },
        fixture:
          'applications/claims-status/tests/e2e/fixtures/mocks/claim-letters/letter.txt',
      }).as('downloadFile');

      cy.get('va-link')
        .first()
        .click();

      cy.wait('@downloadFile')
        .its('response.statusCode')
        .should('eq', 200);

      cy.readFile(
        `${Cypress.config('downloadsFolder')}/ClaimLetter.txt`,
      ).should('contain', 'Test claim letter');

      cy.axeCheck();
    });
  });

  context('feature toggle disabled', () => {
    it('Displays an alert if the feature toggle is disabled', () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggleDisabled);

      cy.login();
      cy.visit('track-claims/your-claim-letters');
      cy.injectAxe();

      cy.get('va-alert').should('exist');
      cy.findByText(/We’re still working on this feature/i).should('exist');

      cy.axeCheck();
    });
  });
});
