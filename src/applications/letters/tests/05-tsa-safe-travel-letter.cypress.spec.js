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
import { tsaLetter } from './e2e/fixtures/mocks/tsa-letter';

describe('TSA Safe Travel Letter', () => {
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
    }).as('featureToggles');
    cy.fixture(
      './applications/letters/tests/e2e/fixtures/PDFs/test.txt',
      'binary',
    ).as('letterPDFBlob');
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
    cy.visit('/records/download-va-letters/letters/');
  });

  const tsaLetterTitle = 'TSA PreCheck Application Fee Waiver Letter';

  it('allows downloading TSA letter', () => {
    cy.intercept('GET', '/v0/tsa_letter', tsaLetter).as('tsaEligibility');
    cy.wait('@tsaEligibility');
    cy.intercept('GET', '/v0/tsa_letter/*', '@letterPDFBlob');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', {
      timeout: Timeouts.slow,
    }).should('be.visible');
    cy.get('va-accordion-item')
      .last()
      .as('tsaAccordionItem')
      .shadow()
      .find('button[aria-expanded=false]')
      .click({ force: true });
    cy.get('@tsaAccordionItem')
      .find(`va-link[text="Download ${tsaLetterTitle}"]`, {
        timeout: Timeouts.slow,
      })
      .click();
    cy.get('@letterPDFBlob').then(blob => {
      expect(blob).to.exist;
    });
  });

  // not merged yet

  //   it('displays alert if determining TSA letter eligibility fails', () => {
  //     cy.intercept('GET', '/v0/tsa_letter', {
  //       statusCode: 500,
  //     }).as('tsaLetterError');
  //     cy.injectAxeThenAxeCheck();
  //     cy.get('va-alert[status="warning"]', {
  //       timeout: Timeouts.slow,
  //     })
  //       .should('be.visible')
  //       .as('warningAlert');
  //     cy.get('@warningAlert')
  //       .find('h4')
  //       .should('have.text', 'Some letters may not be available');
  //   });

  it('displays alert if downloading TSA letter fails', () => {
    cy.intercept('GET', '/v0/tsa_letter', tsaLetter).as('tsaEligibility');
    cy.wait('@tsaEligibility');
    cy.intercept('GET', '/v0/tsa_letter/*', {
      statusCode: 500,
    }).as('tsaLetterError');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', {
      timeout: Timeouts.slow,
    }).should('be.visible');
    cy.get('va-accordion-item')
      .last()
      .as('tsaAccordionItem')
      .shadow()
      .find('button[aria-expanded=false]')
      .click({ force: true });
    cy.wait('@tsaLetterError');
    cy.get('va-alert[status="error"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .as('errorAlert');
    cy.get('@errorAlert')
      .find('h4')
      .should('have.text', `Your ${tsaLetterTitle} is currently unavailable`);
  });
});
