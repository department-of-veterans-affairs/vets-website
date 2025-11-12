import Timeouts from 'platform/testing/e2e/timeouts';
import {
  letters,
  benefitSummaryOptions,
  mockUserData,
} from './e2e/fixtures/mocks/lh_letters';
import { tsaLetter } from './e2e/fixtures/mocks/tsa_letter';

describe('TSA Safe Travel Letter', () => {
  const lettersPage = '/records/download-va-letters/letters/';
  const tsaLetterTitle = 'TSA PreCheck Application Fee Waiver Letter';

  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'tsa_safe_travel_letter',
            value: true,
          },
        ],
      },
    });
    cy.intercept(
      'GET',
      '/v0/letters_generator/beneficiary',
      benefitSummaryOptions,
    );
    cy.intercept('GET', '/v0/letters_generator', letters);
    cy.fixture(
      './applications/letters/tests/e2e/fixtures/PDFs/test.txt',
      'binary',
    ).as('tsaLetterPdf');
    cy.login(mockUserData);
  });

  it('allows downloading TSA letter', () => {
    cy.intercept('GET', '/v0/tsa_letter', tsaLetter);
    cy.intercept('GET', '/v0/tsa_letter/*', '@tsaLetterPdf');
    cy.visit(lettersPage);
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="tsa-letter-accordion"]')
      .as('tsaAccordionItem')
      .should('be.visible')
      .shadow()
      .find('button[aria-expanded=false]')
      .should('be.visible')
      .click({ force: true });
    cy.get('@tsaAccordionItem')
      .find(`va-link[text="Download ${tsaLetterTitle}"]`, {
        timeout: Timeouts.slow,
      })
      .click();
    cy.get('@tsaLetterPdf').then(blob => {
      expect(blob).to.exist;
    });
  });

  it('displays alert if determining TSA letter eligibility fails', () => {
    cy.intercept('GET', '/v0/tsa_letter', {
      statusCode: 500,
    });
    cy.visit(lettersPage);
    cy.injectAxeThenAxeCheck();
    cy.get('va-alert[status="warning"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .as('warningAlert');
    cy.get('@warningAlert')
      .find('h4')
      .should('have.text', 'Some letters may not be available');
  });

  it('displays alert if downloading TSA letter fails', () => {
    cy.intercept('GET', '/v0/tsa_letter', tsaLetter);
    cy.intercept('GET', '/v0/tsa_letter/*', {
      statusCode: 500,
    });
    cy.visit(lettersPage);
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="tsa-letter-accordion"]')
      .as('tsaAccordionItem')
      .should('be.visible')
      .shadow()
      .find('button[aria-expanded=false]')
      .should('be.visible')
      .click({ force: true });
    cy.get('va-alert[status="error"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .as('errorAlert');
    cy.get('@errorAlert')
      .find('h4')
      .should('have.text', `Your ${tsaLetterTitle} is currently unavailable`);
  });

  it('does not display letter for ineligible users', () => {
    cy.intercept('GET', '/v0/tsa_letter', { data: [] });
    cy.visit(lettersPage);
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="tsa-letter-accordion"]').should('not.exist');
  });
});
