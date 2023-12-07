import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import mockMessages from './fixtures/messages-response.json';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  it('verify headers', () => {
    site.login();
    landingPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/2666253/thread',
      mockMultiDraftsResponse,
    ).as('multiDraft');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMultiDraftsResponse.data[0].attributes.messageId
      }`,
      mockMultiDraftsResponse.data[0],
    ).as('firstDraft');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMultiDraftsResponse.data[1].attributes.messageId
      }`,
      mockMultiDraftsResponse.data[1],
    ).as('secondDraft');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });

    cy.wait('@multiDraft');
    cy.wait('@firstDraft');
    cy.wait('@secondDraft');
  });
});
