import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import secureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
// import mockThread from '../fixtures/thread-response.json';

describe('Verify thread - No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  it.skip('landing page view', () => {
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

  it.skip('inbox with messages page view', () => {
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
      Alerts.NO_ASSOCIATION_AT_ALL.HEADER,
    );
    cy.get('[close-btn-aria-label="Close notification"]')
      .find('p')
      .should('have.text', Alerts.NO_ASSOCIATION_AT_ALL.PARAGRAPH);
    cy.get('[close-btn-aria-label="Close notification"]')
      .find('a')
      .should('have.text', Alerts.NO_ASSOCIATION_AT_ALL.LINK);
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

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');
    cy.get(Locators.LINKS.GO_TO_INBOX).should('not.exist');
    cy.get('#track-your-status-on-mobile').should(
      'include.text',
      Alerts.NO_ASSOCIATION_AT_ALL.HEADER,
    );
    cy.get('[close-btn-aria-label="Close notification"]')
      .find('p')
      .should('include.text', Alerts.NO_ASSOCIATION_AT_ALL.PARAGRAPH);
    cy.get('[close-btn-aria-label="Close notification"]')
      .find('a')
      .should('include.text', Alerts.NO_ASSOCIATION_AT_ALL.LINK);
    cy.get('[close-btn-aria-label="Close notification"]')
      .find('a')
      .should('have.attr', 'href', '/find-locations/');
  });

  it.skip('detailed view', () => {
    // const threadWithNoAssociatedTG = {
    //   ...mockThread,
    //   data: [
    //     {
    //       ...mockThread.data[0],
    //       attributes: {
    //         ...mockThread.data[0].attributes,
    //         recipientName: mockRecipients.data[0].attributes.name,
    //         triageGroupName: mockRecipients.data[0].attributes.name,
    //         recipientId: mockRecipients.data[0].attributes.triageTeamId,
    //       },
    //     },
    //     ...mockThread.data,
    //   ],
    // };
    // site.login();
    //
    // landingPage.loadInboxMessages(
    //   mockMessages,
    //   mockSingleMessage,
    //   mockNoRecipients,
    // );
    // landingPage.loadSingleThread(threadWithNoAssociatedTG);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
