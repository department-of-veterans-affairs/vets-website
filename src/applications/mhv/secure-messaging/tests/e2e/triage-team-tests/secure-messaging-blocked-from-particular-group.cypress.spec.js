import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockBlockedRecipients from '../fixtures/recipientsResponse/blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Blocked Triage Group', () => {
  beforeEach(() => {
    // TODO get new array with blocked first recipient / update blockedThread accordingly / this will reduce quantity of mock responses

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

  // TODO add test trying to create a message to blocked group / probably in a new spec

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
      .and('include.text', Alerts.NO_ASSOCIATION.HEADER);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');
  });

  it('alert message expandable', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[data-testid="blocked-triage-group-alert"]').click({
      waitForAnimations: true,
    });

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'open');

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('p')
      .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('include.text', Alerts.NO_ASSOCIATION.LINK);

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
