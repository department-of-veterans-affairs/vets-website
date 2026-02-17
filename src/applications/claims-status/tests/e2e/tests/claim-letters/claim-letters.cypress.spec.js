import {
  mockFeatureToggles,
  mockClaimLetterDownload,
} from '../../support/helpers/mocks';
import { setupClaimLettersTest } from '../../support/helpers/setup';
import { verifyTitleBreadcrumbsHeading } from '../../support/helpers/assertions';
import { createMultipleClaimLetters } from '../../support/fixtures/claimLetters';

describe('Claim letters', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  context('when API returns letters', () => {
    beforeEach(() => {
      setupClaimLettersTest({ letters: createMultipleClaimLetters(8) });
    });

    it('should have correct page title, breadcrumbs, and heading', () => {
      verifyTitleBreadcrumbsHeading({
        title: 'Your VA Claim Letters | Veterans Affairs',
        thirdBreadcrumb: {
          name: 'Your VA claim and appeal letters',
          href: '#content',
        },
        heading: { name: 'Your VA claim and appeal letters' },
      });

      cy.axeCheck();
    });

    it('should display all letters without pagination', () => {
      cy.get('#claim-letter-list').within(() => {
        cy.findAllByRole('listitem').should('have.length', 8);
      });
      cy.get('va-pagination').should('not.exist');

      cy.axeCheck();
    });

    it('should be able to tab to letter download links', () => {
      cy.tabToElement('va-link').should('exist');

      cy.axeCheck();
    });
  });

  context('when more than 10 letters', () => {
    beforeEach(() => {
      setupClaimLettersTest({ letters: createMultipleClaimLetters(15) });
    });

    it('should display list of 10 letters per page with pagination', () => {
      cy.get('#claim-letter-list').within(() => {
        cy.findAllByRole('listitem').should('have.length', 10);
      });

      cy.get('va-pagination').shadow().findByText('Next').click();

      cy.get('#claim-letter-list').within(() => {
        cy.findAllByRole('listitem').should('have.length', 5);
      });

      cy.axeCheck();
    });
  });

  context('when no letters exist', () => {
    beforeEach(() => {
      setupClaimLettersTest({ letters: [] });
    });

    it('should display empty state message', () => {
      cy.findByRole('heading', { name: 'No claim letters', level: 2 });
      cy.findByText('You don’t have any claim letters yet.');
      cy.get('#claim-letter-list').should('not.exist');

      cy.axeCheck();
    });
  });

  context('when API returns errors', () => {
    const ERROR_HEADING = 'We can’t load this page';

    it('should display server error for 500 status', () => {
      setupClaimLettersTest({ statusCode: 500 });

      cy.findByRole('heading', { name: ERROR_HEADING, level: 2 });
      cy.findByText('Please refresh this page or try again later', {
        exact: false,
      });

      cy.axeCheck();
    });

    it('should display auth error for 401 status', () => {
      setupClaimLettersTest({ statusCode: 401 });

      cy.findByRole('heading', { name: ERROR_HEADING, level: 2 });
      cy.findByText('Please double check the URL', { exact: false });

      cy.axeCheck();
    });

    it('should display auth error for 403 status', () => {
      setupClaimLettersTest({ statusCode: 403 });

      cy.findByRole('heading', { name: ERROR_HEADING, level: 2 });
      cy.findByText('Please double check the URL', { exact: false });

      cy.axeCheck();
    });
  });

  describe('Download functionality', () => {
    const filename = 'ClaimLetter-2022-9-22.txt';

    beforeEach(() => {
      setupClaimLettersTest({ letters: createMultipleClaimLetters(5) });
      mockClaimLetterDownload(filename);
    });

    it('should download file when link is clicked', () => {
      cy.get('va-link').first().click();

      cy.wait('@downloadFile').its('response.statusCode').should('eq', 200);

      cy.readFile(`${Cypress.config('downloadsFolder')}/${filename}`).should(
        'contain',
        'Test claim letter',
      );

      cy.axeCheck();
    });

    it('should download file with keyboard navigation', () => {
      cy.tabToElement('va-link').realPress('Enter');

      cy.wait('@downloadFile').its('response.statusCode').should('eq', 200);

      cy.readFile(`${Cypress.config('downloadsFolder')}/${filename}`).should(
        'contain',
        'Test claim letter',
      );

      cy.axeCheck();
    });
  });
});
