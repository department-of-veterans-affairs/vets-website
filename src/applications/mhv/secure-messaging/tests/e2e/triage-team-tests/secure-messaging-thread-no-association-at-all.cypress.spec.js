import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import secureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

describe('Verify thread - No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  it('landing page view', () => {
    site.login();
    secureMessagingLandingPage.loadMainPage(mockNoRecipients);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
  });

  it('inbox with messages page view', () => {
    site.login();

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

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
    cy.get(Locators.LINKS.GO_TO_INBOX).should('not.exist');
    cy.get('#track-your-status-on-mobile').should(
      'have.text',
      Alerts.NO_ASSOCIATION.AT_ALL_HEADER,
    );

    cy.get('[close-btn-aria-label="Close notification"]')
      .find('p')
      .should('have.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get('[close-btn-aria-label="Close notification"]')
      .find('a')
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get('[close-btn-aria-label="Close notification"]')
      .find('a')
      .should('have.attr', 'href', '/find-locations/');
  });

  it('inbox with no messages view', () => {
    site.login();

    landingPage.loadInboxMessages({ data: {} }, { data: {} }, mockNoRecipients);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    // cy.get('[close-btn-aria-label="Close notification"]')  // TODO find solution to close alert message
    //   .shadow()
    //   .find('[class="va-alert-close"]')
    //   .click({ waitForAnimations: true });

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
    cy.get(Locators.LINKS.GO_TO_INBOX).should('not.exist');
    cy.get('#track-your-status-on-mobile').should(
      'have.text',
      Alerts.NO_ASSOCIATION.AT_ALL_HEADER,
    );
    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('p')
      .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);
    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);
    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('have.attr', 'href', '/find-locations/');
  });

  it('detailed view', () => {
    site.login();

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

    cy.get('[class="alert-expandable-title"]')
      .should('be.visible')
      .and('include.text', `You can't send messages to`);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');

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

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');

    // TODO move these assertion up after alert text fixing

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('p')
      .should('have.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);
  });
});
