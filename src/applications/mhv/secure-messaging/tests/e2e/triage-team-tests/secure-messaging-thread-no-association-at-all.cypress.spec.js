import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Constants, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import secureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

describe('Verify thread - No association at all', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
  });

  it('landing page view', () => {
    secureMessagingLandingPage.loadMainPage(mockNoRecipients);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Constants.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
  });

  it('inbox with messages page view', () => {
    landingPage.loadInboxMessages(
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

    cy.get(Constants.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
    cy.get(Constants.LINKS.GO_TO_INBOX).should('not.exist');

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('h2')
      .should('have.text', Alerts.NO_ASSOCIATION.AT_ALL_HEADER);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('p')
      .should('have.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');
  });

  it('detailed view', () => {
    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockNoRecipients,
    );
    landingPage.loadSingleThread();

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
      .find('[class="alert-expandable warning"]')
      .should('be.visible')
      .and('include.text', Alerts.NO_ASSOCIATION.HEADER);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');

    cy.get(Constants.ALERTS.BLOCKED_GROUP).click({
      waitForAnimations: true,
    });

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('#alert-body')
      .should('have.class', 'open');

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('p')
      .should('have.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('a')
      .first()
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Constants.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get(Constants.BUTTONS.REPLY).should('not.exist');
  });
});
