import {
  letters,
  benefitSummaryOptions,
  address,
  countries,
  states,
  status,
  validatedAddresses,
  mockUserData,
  benefitSummaryLetter,
} from './e2e/fixtures/mocks/lh_letters';
import featureToggleLettersNewDesign from './e2e/fixtures/mocks/featureToggleLettersNewDesign.json';

describe('New letters edit address flow', () => {
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
    cy.intercept('GET', '/v0/letters_generator', letters);
    cy.intercept('GET', '/v0/address', address);
    cy.intercept('GET', '/v0/address/countries', countries);
    cy.intercept('GET', '/v0/address/states', states);
    cy.intercept('GET', '/v0/profile/status', status);
    cy.intercept('PUT', '/v0/address', address);
    cy.intercept('PUT', '/v0/profile/addresses', address);
    cy.intercept(
      'POST',
      'v0/letters_generator/download/benefit_summary',
      benefitSummaryLetter,
    );
    cy.intercept('POST', 'v0/letters_generator/download/*', '@letterPDFBlob');
    cy.intercept('POST', '/v0/profile/address_validation', validatedAddresses);
    cy.intercept('POST', '/v0/profile/addresses', address);

    cy.login(mockUserData);
    cy.visit('/records/download-va-letters/letters/edit-address');
  });

  it('confirms user can save address as entered', () => {
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Download VA Letters and Documents | Veterans Affair',
    );
    cy.axeCheck('main');
    cy.get('button[data-testid="save-edit-button"').click();
    cy.scrollTo(0, 0);
    cy.get('div[data-testid="mailingAddress"]').should('be.visible');
    cy.get('button[data-testid="confirm-address-button"]').should(
      'have.text',
      'Use suggested address',
    );
    cy.axeCheck('main', {
      headingOrder: false,
    });
    cy.get('va-radio[label="Address you entered:"]').click();
    cy.get('button[data-testid="confirm-address-button"]')
      .should('have.text', 'Use address you entered')
      .click();

    cy.window().then(win => {
      const state = { success: true };
      win.history.pushState(
        state,
        '',
        '/records/download-va-letters/letters/letter-page',
      );
    });
    cy.visit('/records/download-va-letters/letters/letter-page');
    cy.window().then(win => {
      // This is the best proxy I've found for the client-side navigation
      // that happens when successCallback fires from EditAddress.jsx#89
      // See https://labs.madisoft.it/how-does-react-router-location-state-works/
      expect(win.history.state).to.have.property('success', true);
    });
  });

  it('confirms user can save the suggested address', () => {
    cy.injectAxeThenAxeCheck();
    cy.title().should(
      'contain',
      'Download VA Letters and Documents | Veterans Affair',
    );
    cy.axeCheck('main');
    cy.get('button[data-testid="save-edit-button"').click();
    cy.scrollTo(0, 0);
    cy.get('div[data-testid="mailingAddress"]').should('be.visible');
    cy.get('button[data-testid="confirm-address-button"]')
      .should('have.text', 'Use suggested address')
      .click();

    cy.window().then(win => {
      const state = { success: true };
      win.history.pushState(
        state,
        '',
        '/records/download-va-letters/letters/letter-page',
      );
    });
    cy.visit('/records/download-va-letters/letters/letter-page');
    cy.window().then(win => {
      expect(win.history.state).to.have.property('success', true);
    });
  });
});
