import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';

describe('No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  const updatedData = mockRecipients.data.slice(1);
  const updatedMeta = { ...mockRecipients.meta, associatedTriageGroups: 6 };
  const removedFirstRecipientsList = {
    data: updatedData,
    meta: updatedMeta,
  };

  const threadWithNoAssociatedTG = {
    ...blockedThread,
    data: [
      {
        ...blockedThread.data[0],
        attributes: {
          ...blockedThread.data[0].attributes,
          recipientName: mockRecipients.data[0].attributes.name,
          triageGroupName: mockRecipients.data[0].attributes.name,
          recipientId: mockRecipients.data[0].attributes.triageTeamId,
        },
      },
    ],
  };

  it('inbox view', () => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
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
    cy.get('#select').should(
      'not.contain',
      mockRecipients.data[0].attributes.name,
    );
  });

  it('detailed view', () => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );
    landingPage.loadSingleThread(threadWithNoAssociatedTG);

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

    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );

    landingPage.loadSingleThread(mockThreadWithDraft);

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

  it('existing single draft', () => {
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

    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );

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

  it('detailed view - older than 45 day', () => {
    const currentDate = new Date();
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(currentDate.getDate() - 46);

    const oldThreadWithNoAssociatedTG = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            sentDate: fortyFiveDaysAgo.toISOString(),
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
        ...mockThread.data,
      ],
    };

    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );
    landingPage.loadSingleThread(oldThreadWithNoAssociatedTG, fortyFiveDaysAgo);

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

  it('existing draft - older than 45 days', () => {
    const currentDate = new Date();
    const fortyFiveDaysAgo = new Date();

    fortyFiveDaysAgo.setDate(currentDate.getDate() - 46);
    const mockThreadWithOldDraft = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            draftDate: fortyFiveDaysAgo.toISOString(),
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
            sentDate: null,
          },
        },
        ...mockThread.data,
      ],
    };

    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );

    landingPage.loadSingleThread(
      mockThreadWithOldDraft,
      fortyFiveDaysAgo,
      fortyFiveDaysAgo,
    );

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
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should('not.exist');
  });
});
