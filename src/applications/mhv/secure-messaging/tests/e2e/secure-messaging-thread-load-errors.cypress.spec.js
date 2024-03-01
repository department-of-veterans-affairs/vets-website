import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockRecipients from './fixtures/recipients-response.json';
import { Paths } from './utils/constants';
import mockCategories from './fixtures/categories-response.json';

describe('Thread list load error', () => {
  const site = new SecureMessagingSite();
  it('verify error on inbox', () => {
    site.login();

    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.CATEGORIES,
      mockCategories,
    ).as('categories');

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/*`, {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folders');

    // TODO intercept 'My folders' API call

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`,
      mockRecipients,
    ).as('recipients');

    cy.visit(Paths.UI_MAIN + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggle');
    cy.wait('@mockUser');
  });
});
