import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';
// import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';

describe('Verify drafts - No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  beforeEach(() => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockRecipients,
    );
  });

  it('existing draft in thread', () => {
    const mockThreadWithDraft = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            draftDate: new Date().toISOString(),
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
            sentDate: null,
          },
        },
        ...mockThread.data,
      ],
    };

    // console.log(mockThreadWithDraft.data[0].attributes)

    landingPage.loadSingleThread(
      mockThreadWithDraft,
      null,
      new Date().toISOString(),
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    // cy.get('[class="alert-expandable-title"]')
    //   .should('be.visible')
    //   .and(
    //     'include.text',
    //     `You can't send messages to ${mockRecipients.data[0].attributes.name}`,
    //   );
    //
    // cy.get('[data-testid="blocked-triage-group-alert"]')
    //   .shadow()
    //   .find('#alert-body')
    //   .should('have.class', 'closed');
    //
    // cy.get('[data-testid="blocked-triage-group-alert"]').click({
    //   waitForAnimations: true,
    // });
    //
    // cy.get('[data-testid="blocked-triage-group-alert"]')
    //   .shadow()
    //   .find('#alert-body')
    //   .should('have.class', 'open');
    //
    // cy.get('[data-testid="blocked-triage-group-alert"]')
    //   .find('a')
    //   .should('have.attr', 'href', '/find-locations/');
    //
    // cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });

  it.skip('existing single draft', () => {
    const mockSingleDraft = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            draftDate: new Date().toISOString(),
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
            sentDate: null,
          },
        },
      ],
    };

    landingPage.loadSingleThread(mockSingleDraft);

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
      .and(
        'include.text',
        `You can't send messages to ${mockRecipients.data[0].attributes.name}`,
      );

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
  });
});
