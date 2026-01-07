import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts, Paths } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';

describe('Verify thread - No association at all', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
  });

  it('inbox with messages page view', () => {
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockNoRecipients,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).should(
      'not.exist',
    );
    cy.get(Locators.LINKS.GO_TO_INBOX).should('not.exist');

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('h2')
      .should('contain', Alerts.NO_ASSOCIATION.AT_ALL_HEADER);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('p')
      .should('contain', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'href', Paths.FIND_LOCATIONS);
  });

  it('detailed view', () => {
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockNoRecipients,
    );
    PatientInboxPage.loadSingleThread();

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
      .find('[class="alert-expandable warning"]')
      .should('be.visible')
      .and('include.text', Alerts.NO_ASSOCIATION.HEADER);

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
      .should('contain', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .first()
      .should('have.attr', 'text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'href', Paths.FIND_LOCATIONS);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
