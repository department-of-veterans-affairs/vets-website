import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockBlockedRecipients from '../fixtures/recipientsResponse/blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Blocked Triage Group', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockBlockedRecipients,
    );

    landingPage.loadSingleThread(blockedThread);
  });
  it('alert message', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[class="alert-expandable-title"]')
      .should('be.visible')
      .and('include.text', `You can't send messages to`);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');
  });

  it('alert message expandable', () => {
    cy.get('[data-testid="blocked-triage-group-alert"]').click({
      waitForAnimations: true,
    });

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'open');

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('have.attr', 'href', '/find-locations/');
  });

  it('reply btn does not exist', () => {
    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
