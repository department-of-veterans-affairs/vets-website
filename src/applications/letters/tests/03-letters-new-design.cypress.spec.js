import Timeouts from 'platform/testing/e2e/timeouts';
import {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
  benefitSummaryLetter,
} from './e2e/fixtures/mocks/lh_letters';
import featureToggleLettersNewDesign from './e2e/fixtures/mocks/featureToggleLettersNewDesign.json';

describe('New letters page design', () => {
  beforeEach(() => {
    cy.fixture(
      './applications/letters/tests/e2e/fixtures/PDFs/test.txt',
      'utf-8',
    ).as('letterPDFBlob');

    cy.intercept('GET', '/v0/feature_toggles?*', featureToggleLettersNewDesign);
    cy.intercept(
      'GET',
      '/v0/letters_generator/beneficiary',
      benefitSummaryOptions,
    ).as('benefitSummaryOptions');
    cy.intercept('GET', '/v0/letters_generator', letters).as('letters');
    cy.intercept('GET', '/v0/address', address).as('address');
    cy.intercept('GET', '/v0/address/countries', countries).as('countries');
    cy.intercept('GET', '/v0/address/states', states).as('states');
    cy.intercept('PUT', '/v0/address', newAddress).as('newAddress');
    cy.intercept(
      'POST',
      'v0/letters_generator/download/benefit_summary',
      benefitSummaryLetter,
    );
    cy.intercept('POST', 'v0/letters_generator/download/*', '@letterPDFBlob');

    cy.login(mockUserData);
    cy.visit('/records/download-va-letters/letters/letter-page');
  });

  it('confirms non-BSL letters load asynchronously', () => {
    cy.get('[data-test-id="letters-accordion"]', { timeout: 3000 })
      .as('lettersAccordion')
      .should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Download VA Letters and Documents | Veterans Affair',
    );
    cy.axeCheck();
    cy.get('@lettersAccordion')
      .shadow()
      .find('button.va-accordion__button')
      .click();
    cy.get('va-link[filetype="PDF"]', { timeout: 3000 }).should(
      'have.length',
      4,
    );
    cy.axeCheck();
  });

  it('confirms non-BSL letters can be downloaded', () => {
    cy.get('[data-test-id="letters-accordion"]', { timeout: 3000 })
      .as('lettersAccordion')
      .should('be.visible');
    cy.get('@lettersAccordion')
      .shadow()
      .find('button.va-accordion__button')
      .click();
    cy.get('va-link[filetype="PDF"]', { timeout: 3000 })
      .first()
      .click();
    cy.get('@letterPDFBlob').then(blob => {
      expect(blob).to.exist;
    });
  });

  it('confirms BSL letters load asynchronously', () => {
    cy.get('[data-test-id="letters-accordion"]', { timeout: 3000 })
      .as('lettersAccordion')
      .should('be.visible');
    cy.get('va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button[aria-expanded=false]')
      .click();
    cy.get('va-button')
      .shadow()
      .find('button')
      .contains(
        'Download Benefit Summary and Service Verification Letter (PDF)',
      )
      .click();
  });
});
