import claimLetters from './fixtures/mocks/claim-letters/list.json';

const generateErrorContent = (title, code) => {
  return {
    errors: [{ title, detail: title, code, status: code }],
  };
};

describe('Claim Letters Page', () => {
  context(
    'feature toggles claim_letters_access and cst_include_ddl_boa_letters enabled',
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/claim_letters', claimLetters.data).as(
          'defaultResponse',
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

      it('Displays a list of letters', () => {
        cy.visit('track-claims/your-claim-letters');
        cy.get('va-breadcrumbs').should('be.visible');
        cy.get('.usa-breadcrumb__list-item').should('have.length', 3);
        cy.get('h1').should('have.text', 'Your VA claim and appeal letters');
        cy.get('ol#claim-letter-list').should('exist');
        cy.get('ol#claim-letter-list > li').should('have.length', 10);

        cy.get('va-pagination').should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Paginates when there are more than 10 letters', () => {
        cy.visit('track-claims/your-claim-letters');
        cy.get('ol#claim-letter-list > li').should('have.length', 10);

        // TODO: Check the number of pages in the va-pagination component
        // We should know ahead of time how many pages should appear
        cy.get('va-pagination').should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it("Doesn't show va-pagination if there are less than 10 letters", () => {
        cy.intercept('GET', '/v0/claim_letters', claimLetters.data.slice(0, 8));
        cy.visit('track-claims/your-claim-letters');
        cy.get('ol#claim-letter-list > li').should('have.length', 8);

        cy.get('va-pagination').should('not.exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Pagination buttons work properly', () => {
        cy.visit('track-claims/your-claim-letters');

        // 'Previous' button should not show on first page
        cy.contains(/Previous/i).should('not.exist');

        // Click 'Next' button
        cy.contains(/Next/i).click();

        // Now on second page
        // 'Previous' button should now be shown
        cy.contains(/Previous/i).should('exist');

        // Click 'Previous' button
        cy.contains(/Previous/i).click();

        // Back on first page
        // 'Previous' button should not show
        cy.contains(/Previous/i).should('not.exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Displays a "No claim letters" message if there are no letters', () => {
        cy.intercept('GET', '/v0/claim_letters', []);
        cy.visit('track-claims/your-claim-letters');

        cy.findByText(/No claim letters/i).should('exist');

        // List shouldn't show
        cy.get('ol#claim-letter-list').should('not.exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Displays a server error message when status code is 500', () => {
        cy.intercept('GET', '/v0/claim_letters', {
          statusCode: 500,
          body: generateErrorContent('Internal server error', '500'),
        });
        cy.visit('track-claims/your-claim-letters');

        cy.findByText(/We can’t load this page/i).should('exist');
        cy.findByText(/Please refresh this page or try again later/i).should(
          'exist',
        );

        cy.injectAxeThenAxeCheck();
      });

      it('Displays a forbidden error message when status code is 403', () => {
        cy.intercept('GET', '/v0/claim_letters', {
          statusCode: 403,
          body: generateErrorContent('Forbidden', '403'),
        });
        cy.visit('track-claims/your-claim-letters');

        cy.findByText(/We can’t load this page/i).should('exist');
        cy.findByText(/Please double check the URL/i).should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Displays an unauthenticated error message when status code is 401', () => {
        cy.intercept('GET', '/v0/claim_letters', {
          statusCode: 401,
          body: generateErrorContent('Not authorized', '401'),
        });
        cy.visit('track-claims/your-claim-letters');

        cy.findByText(/We can’t load this page/i).should('exist');
        cy.findByText(/Please double check the URL/i).should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it('Downloads a file successfully when link is clicked', () => {
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

        cy.get('va-link')
          .first()
          .click();

        cy.wait('@downloadFile')
          .its('response.statusCode')
          .should('eq', 200);

        cy.readFile(`${Cypress.config('downloadsFolder')}/${filename}`).should(
          'contain',
          'Test claim letter',
        );

        cy.injectAxeThenAxeCheck();
      });
    },
  );

  context(
    'feature toggles claim_letters_access and cst_include_ddl_boa_letters disabled',
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            features: [
              { name: 'cst_include_ddl_boa_letters', value: false },
              { name: 'claim_letters_access', value: false },
            ],
          },
        });

        cy.login();
      });

      it('Displays an alert if the feature toggle claim_letters_access is disabled', () => {
        cy.visit('track-claims/your-claim-letters');

        cy.get('va-alert').should('exist');
        cy.findByText(
          /Decision letters aren’t available to download right now./i,
        ).should('exist');

        cy.injectAxeThenAxeCheck();
      });
    },
  );

  context(
    'feature toggles claim_letters_access enabled and cst_include_ddl_boa_letters disabled',
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/claim_letters', claimLetters.data).as(
          'defaultResponse',
        );
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            features: [
              { name: 'cst_include_ddl_boa_letters', value: false },
              { name: 'claim_letters_access', value: true },
            ],
          },
        });

        cy.login();
      });

      it('Displays a list of letters', () => {
        cy.visit('track-claims/your-claim-letters');
        cy.get('h1').should('have.text', 'Your VA claim letters');
        cy.get('ol#claim-letter-list').should('exist');
        cy.get('ol#claim-letter-list > li').should('have.length', 10);

        cy.get('va-pagination').should('exist');

        cy.injectAxeThenAxeCheck();
      });
    },
  );

  context(
    'feature toggles claim_letters_access disabled and cst_include_ddl_boa_letters enabled',
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            features: [
              { name: 'cst_include_ddl_boa_letters', value: true },
              { name: 'claim_letters_access', value: false },
            ],
          },
        });

        cy.login();
      });

      it('Displays an alert if the feature toggle claim_letters_access is disabled', () => {
        cy.visit('track-claims/your-claim-letters');
        cy.get('va-alert').should('exist');
        cy.findByText(
          /Decision letters aren’t available to download right now./i,
        ).should('exist');

        cy.injectAxeThenAxeCheck();
      });
    },
  );
});
