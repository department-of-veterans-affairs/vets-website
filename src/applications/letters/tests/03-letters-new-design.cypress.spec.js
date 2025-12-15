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

describe('New letters page design', () => {
  beforeEach(() => {
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

  it('confirms non-BSL letters load asynchronously', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', { timeout: Timeouts.slow })
      .as('lettersAccordion')
      .should('be.visible');
    cy.title().should(
      'contain',
      'Your VA benefit letters and documents | Veterans Affairs',
    );
    cy.axeCheck('main');
    cy.get('@lettersAccordion')
      .shadow()
      .find('button.va-accordion__button')
      .click({ multiple: true });
    cy.get('va-link[filetype="PDF"]', { timeout: Timeouts.slow }).should(
      'have.length',
      4,
    );
    cy.axeCheck('main');
  });

  it('confirms non-BSL letters can be downloaded', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', { timeout: Timeouts.slow })
      .as('lettersAccordion')
      .should('be.visible');
    cy.get('@lettersAccordion')
      .shadow()
      .find('button.va-accordion__button')
      .click({ multiple: true });
    cy.get('va-link[filetype="PDF"]', { timeout: Timeouts.slow })
      .first()
      .click({ force: true });
    cy.get('@letterPDFBlob').then(blob => {
      expect(blob).to.exist;
    });
  });

  it('confirms BSL letter downloads with all benefits by default', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', { timeout: Timeouts.slow })
      .as('lettersAccordion')
      .should('be.visible');
    cy.get('va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button[aria-expanded=false]')
      .click({ force: true });
    cy.get('va-button')
      .shadow()
      .find('button')
      .contains(
        'Download Benefit Summary and Service Verification Letter (PDF)',
      )
      .click();
    cy.get('va-alert[status="success"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .as('successAlert');
    cy.get('@successAlert')
      .find('p')
      .first()
      .should('have.text', 'Your letter includes the 5 topics you selected.');
    cy.axeCheck('main');
  });

  it('confirms BSL letter downloads with one benefit', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-test-id="letters-accordion"]', { timeout: Timeouts.slow })
      .as('lettersAccordion')
      .should('be.visible');
    cy.get('va-accordion-item:nth-of-type(4)')
      .shadow()
      .find('button[aria-expanded=false]')
      .click({ force: true });
    // Get array of checkboxes, loop to click through all but the first one
    cy.get('input[type="checkbox"]').each(($el, index) => {
      if (index > 0) {
        cy.wrap($el).click();
      }
    });
    cy.get('va-button')
      .shadow()
      .find('button')
      .contains(
        'Download Benefit Summary and Service Verification Letter (PDF)',
      )
      .click();
    cy.get('va-alert[status="success"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .as('successAlert');
    cy.get('@successAlert')
      .find('p')
      .first()
      .should('have.text', 'Your letter includes the one topic you selected.');
    cy.axeCheck('main');
  });
});
