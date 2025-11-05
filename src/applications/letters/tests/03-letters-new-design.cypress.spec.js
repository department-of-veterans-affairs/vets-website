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

  context('when TSA Safe Travel Letter feature flag is enabled', () => {
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
      }).as('featureToggles');
    });

    it('allows downloading TSA letter', () => {
      cy.intercept('GET', '/v0/tsa_letter', tsaLetter);
      cy.intercept(
        'GET',
        `/v0/tsa_letter/${tsaLetter.data[0].attributes.document_id}`,
        '@letterPDFBlob',
      );
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

    it('displays alert if determining TSA letter eligibility fails', () => {
      cy.intercept('GET', '/v0/tsa_letter', {
        statusCode: 500,
      }).as('tsaLetterError');
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
      cy.intercept(
        'GET',
        `/v0/tsa_letter/${tsaLetter.data[0].attributes.document_id}`,
        {
          statusCode: 500,
        },
      ).as('tsaLetterError');
      cy.injectAxeThenAxeCheck();
      cy.get('[data-test-id="letters-accordion"]', {
        timeout: Timeouts.slow,
      }).should('be.visible');
      cy.get('va-accordion-item')
        .last()
        .shadow()
        .find('button[aria-expanded=false]')
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
  });
});
