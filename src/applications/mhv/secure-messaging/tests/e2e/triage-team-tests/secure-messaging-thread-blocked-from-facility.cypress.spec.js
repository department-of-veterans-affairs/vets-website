import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockFacilityBlockedRecipients from '../fixtures/recipientsResponse/facility-blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Verify Thread - Blocked from Facility', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  it('create message view - verify user can not create a message to any group in blocked facility', () => {
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockFacilityBlockedRecipients,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click({
      waitForAnimations: true,
    });
    cy.get(Locators.BUTTONS.CONTINUE).click({ waitForAnimations: true });

    // TODO create a loop to check all triageGroups in facility

    cy.get('#select').should(
      'not.contain',
      mockFacilityBlockedRecipients.data[3].attributes.name,
    );
  });

  it('detailed view', () => {
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockFacilityBlockedRecipients,
    );

    landingPage.loadSingleThread(blockedThread);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('span')
      .should('be.visible')
      .and(
        'include.text',
        `${Alerts.BLOCKED.HEADER} ${
          mockFacilityBlockedRecipients.data[3].attributes.name
        }`,
      );

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');

    cy.get(Locators.ALERTS.BLOCKED_GROUP).click({
      waitForAnimations: true,
    });

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('#alert-body')
      .should('have.class', 'open');

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('p')
      .should('have.text', Alerts.BLOCKED.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .first()
      .should('have.attr', 'href', '/find-locations/')
      .and('have.text', Alerts.BLOCKED.LINK);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
