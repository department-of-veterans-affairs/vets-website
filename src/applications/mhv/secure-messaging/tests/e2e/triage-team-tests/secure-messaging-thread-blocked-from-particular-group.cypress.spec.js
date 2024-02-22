import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Constants, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockBlockedRecipients from '../fixtures/recipientsResponse/blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Verify Thread - Blocked from particular Triage Group', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockBlockedRecipients,
    );
  });

  describe('general alert', () => {
    beforeEach(() => {
      landingPage.loadSingleThread(blockedThread);
    });

    it('verify alert header', () => {
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
        .and('include.text', Alerts.BLOCKED.HEADER);
    });

    it('verify alert not expanded', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      cy.get(Constants.ALERTS.BLOCKED_GROUP)
        .shadow()
        .find('#alert-body')
        .should('have.class', 'closed');
    });
  });

  describe('expanded alert', () => {
    beforeEach(() => {
      landingPage.loadSingleThread(blockedThread);
    });

    beforeEach(() => {
      cy.get(Constants.ALERTS.BLOCKED_GROUP).click({
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

      cy.get(Constants.ALERTS.BLOCKED_GROUP)
        .shadow()
        .find('#alert-body')
        .should('have.class', 'open');
    });

    it('verify alert paragraph', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
      cy.get(Constants.ALERTS.BLOCKED_GROUP)
        .find('p')
        .should('include.text', Alerts.BLOCKED.PARAGRAPH);
    });

    it('verify link text', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
      cy.get(Constants.ALERTS.BLOCKED_GROUP)
        .find('a')
        .should('include.text', Alerts.BLOCKED.LINK);
    });

    it('verify link', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
      cy.get(Constants.ALERTS.BLOCKED_GROUP)
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

      cy.get(Constants.BUTTONS.REPLY).should('not.exist');
    });
  });

  describe('verify user can not create a message to blocked group', () => {
    it('creating message view', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      cy.get(Constants.LINKS.CREATE_NEW_MESSAGE).click({
        waitForAnimations: true,
      });
      cy.get(Constants.BUTTONS.CONTINUE).click({ waitForAnimations: true });
      cy.get('#select').should(
        'not.contain',
        mockBlockedRecipients.data[3].attributes.name,
      );
    });
  });
});
