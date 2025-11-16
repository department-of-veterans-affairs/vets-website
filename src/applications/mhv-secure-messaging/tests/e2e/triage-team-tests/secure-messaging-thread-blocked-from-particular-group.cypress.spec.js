import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Paths, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockBlockedRecipients from '../fixtures/recipientsResponse/group-blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Verify Thread - Blocked from particular Triage Group', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockBlockedRecipients,
    );
  });

  describe('general alert', () => {
    beforeEach(() => {
      PatientInboxPage.loadSingleThread(blockedThread);
    });

    it('verify alert header', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

      cy.get(Locators.ALERTS.EXPANDABLE_TITLE)
        .should('be.visible')
        .and('include.text', Alerts.BLOCKED.HEADER);
    });

    it('verify alert not expanded', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

      cy.get(Locators.ALERTS.BLOCKED_GROUP)
        .shadow()
        .find('#alert-body')
        .should('have.class', 'closed');
    });
  });

  describe('expanded alert', () => {
    beforeEach(() => {
      PatientInboxPage.loadSingleThread(blockedThread);
    });

    beforeEach(() => {
      cy.get(Locators.ALERTS.BLOCKED_GROUP).click({
        waitForAnimations: true,
      });
    });
    it('alert expanded', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

      cy.get(Locators.ALERTS.BLOCKED_GROUP)
        .shadow()
        .find('#alert-body')
        .should('have.class', 'open');
    });

    it('verify alert paragraph', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
      cy.get(Locators.ALERTS.BLOCKED_GROUP)
        .find('p')
        .should('include.text', Alerts.BLOCKED.PARAGRAPH);
    });

    it('verify link text', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
      cy.get(Locators.ALERTS.BLOCKED_GROUP)
        .find('va-link-action')
        .should('have.attr', 'text', Alerts.BLOCKED.LINK);
    });

    it('verify link', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
      cy.get(Locators.ALERTS.BLOCKED_GROUP)
        .find('va-link-action')
        .should('have.attr', 'href', Paths.FIND_LOCATIONS);
    });

    it('reply btn does not exist', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

      cy.get(Locators.BUTTONS.REPLY).should('not.exist');
    });
  });

  describe('verify user can not create a message to blocked group', () => {
    it('creating message view', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

      cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click({
        waitForAnimations: true,
      });
      cy.findByTestId(Locators.INTERSTITIAL_CONTINUE_BUTTON).click({
        waitForAnimations: true,
      });
      cy.get(Locators.ALERTS.REPT_SELECT).should(
        'not.contain',
        mockBlockedRecipients.data[3].attributes.name,
      );
    });
  });
});
