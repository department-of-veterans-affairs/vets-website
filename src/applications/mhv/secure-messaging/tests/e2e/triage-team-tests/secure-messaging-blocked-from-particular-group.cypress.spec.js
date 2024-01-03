import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
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

  describe('general alert', () => {
    it('verify alert message', () => {
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
        .and('include.text', Alerts.NO_ASSOCIATION.HEADER);
    });

    // TODO add test trying to create a message to blocked group / probably in a new spec

    it('verify alert not expanded', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      cy.get('[data-testid="blocked-triage-group-alert"]')
        .shadow()
        .find('#alert-body')
        .should('have.class', 'closed');
    });
  });

  describe('expanded alert', () => {
    beforeEach(() => {
      cy.get('[data-testid="blocked-triage-group-alert"]').click({
        waitForAnimations: true,
      });
    });
    it('alert expanded', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      cy.get('[data-testid="blocked-triage-group-alert"]')
        .shadow()
        .find('#alert-body')
        .should('have.class', 'open');
    });

    it('verify alert paragraph', () => {
      cy.get('[data-testid="blocked-triage-group-alert"]')
        .find('p')
        .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);
    });

    it('verify link text', () => {
      cy.get('[data-testid="blocked-triage-group-alert"]')
        .find('a')
        .should('include.text', Alerts.NO_ASSOCIATION.LINK);
    });

    it('verify link', () => {
      cy.get('[data-testid="blocked-triage-group-alert"]')
        .find('a')
        .should('have.attr', 'href', '/find-locations/');
    });

    it('reply btn does not exist', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      cy.get(Locators.BUTTONS.REPLY).should('not.exist');
    });
  });
});
