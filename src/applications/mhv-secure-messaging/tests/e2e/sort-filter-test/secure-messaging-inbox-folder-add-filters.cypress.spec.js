import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import mockCategories from '../fixtures/categories-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Folder add filter checks', () => {
  const dateRange = [
    'ANY',
    'LAST 3 MONTHS',
    'LAST 6 MONTHS',
    'LAST 12 MONTHS',
    'CUSTOM',
  ];

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify filter buttons and dropdowns', () => {
    // verify filter buttons visible
    cy.get(`[data-testid="search-form"]`)
      .find(`va-button`)
      .each(el => {
        cy.wrap(el).should(`be.visible`);
      });

    // verify dropdown not visible
    cy.get(`#content`).should('have.attr', 'hidden');

    // verify add filters
    cy.get(`.va-accordion__header`).click({ false: true });

    // verify category dropdown
    cy.get(`[data-testid="category-dropdown"]>option`).each(option => {
      cy.wrap(option)
        .invoke('text')
        .then(el => {
          expect(el.toUpperCase()).to.be.oneOf(
            mockCategories.data.attributes.messageCategoryType,
          );
        });
    });

    // verify date range dropdown
    cy.get('[data-testid="date-range-dropdown"]>option').each(option => {
      cy.wrap(option)
        .invoke('text')
        .then(el => {
          expect(el.toUpperCase()).to.be.oneOf(dateRange);
        });
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
