import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockSingleThread from './fixtures/inboxResponse/single-thread-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockMessageDetails from './fixtures/messages-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import { AXE_CONTEXT, Paths, Locators } from './utils/constants';

describe('verify signature', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('signature added on composing', () => {
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
      mockSingleMessage,
    ).as('singleThread');

    cy.get(Locators.THREADS)
      .first()
      .find(`#message-link-${mockMessageDetails.data[0].attributes.messageId}`)
      .click();

    cy.get(Locators.BUTTONS.REPLY).click({
      waitForAnimations: true,
    });
    cy.get(Locators.BUTTONS.CONTINUE).click();
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
});
