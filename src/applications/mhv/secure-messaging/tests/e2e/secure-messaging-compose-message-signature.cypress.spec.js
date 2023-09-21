import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockSingleThread from './fixtures/inboxResponse/single-thread-response.json';
import mockMessageDetails from './fixtures/messages-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('verify signature', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it.skip('signature added on composing', () => {
    landingPage.navigateToComposePage();
    landingPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('signature added on replying', () => {
    // check intercepts

    cy.intercept('GET', `${Paths.SM_API_BASE}/folders*`, mockFolders);
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        mockMessageDetails.data[0].attributes.messageId
      }/thread`,
      mockSingleThread,
    ).as('singleThread');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        mockMessageDetails.data[0].attributes.messageId
      }`,
      mockSingleThread,
    ).as('singleThread');

    cy.get('[data-testid="thread-list-item"]')
      .first()
      .find(`#message-link-${mockMessageDetails.data[0].attributes.messageId}`)
      .click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
