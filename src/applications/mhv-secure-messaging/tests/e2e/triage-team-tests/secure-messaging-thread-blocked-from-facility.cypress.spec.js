import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Paths, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockFacilityBlockedRecipients from '../fixtures/recipientsResponse/facility-blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Verify Thread - Blocked from Facility', () => {
  it('create message view - verify user can not create a message to any group in blocked facility', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
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

    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click({
      waitForAnimations: true,
    });
    cy.findByTestId(Locators.INTERSTITIAL_CONTINUE_BUTTON).click({
      waitForAnimations: true,
    });

    // TODO create a loop to check all triageGroups in facility

    cy.get(Locators.ALERTS.REPT_SELECT).should(
      'not.contain',
      mockFacilityBlockedRecipients.data[3].attributes.name,
    );
  });

  it('detailed view', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockFacilityBlockedRecipients,
    );

    PatientInboxPage.loadSingleThread(blockedThread);

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
        `${Alerts.BLOCKED.HEADER} ${mockFacilityBlockedRecipients.data[3].attributes.name}`,
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

    cy.get(Locators.ALERTS.BLOCKED_GROUP);
    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .first()
      .should('have.attr', 'href', Paths.FIND_LOCATIONS)
      .and('have.attr', 'text', Alerts.BLOCKED.LINK);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
