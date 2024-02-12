import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';

describe('Verify drafts - No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  const newDate = new Date().toISOString();

  const updatedData = mockRecipients.data.slice(1);
  const updatedMeta = { ...mockRecipients.meta, associatedTriageGroups: 6 };
  const removedFirstRecipientsList = {
    data: updatedData,
    meta: updatedMeta,
  };

  beforeEach(() => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );
  });

  it('draft in thread', () => {
    const mockThreadWithDraft = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
        ...mockThread.data,
      ],
    };

    landingPage.loadSingleThread(mockThreadWithDraft, newDate, newDate);

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
        `${Alerts.NO_ASSOCIATION.HEADER} ${
          mockRecipients.data[0].attributes.name
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
      .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('include.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get(Locators.BUTTONS.SEND).should('not.exist');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should('not.exist');
  });

  it('single reply draft', () => {
    const mockSingleDraft = {
      ...mockThread,
      data: [
        {
          ...mockThread.data[0],
          attributes: {
            ...mockThread.data[0].attributes,
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
      ],
    };

    landingPage.loadSingleThread(mockSingleDraft, newDate, newDate);

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
        `${Alerts.NO_ASSOCIATION.HEADER} ${
          mockRecipients.data[0].attributes.name
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
      .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('include.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get(Locators.BUTTONS.SEND).should('not.exist');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should('not.exist');
  });

  it('single new draft', () => {
    const mockSingleDraftThread = {
      ...mockMessages,
      data: [
        {
          ...mockMessages.data[0],
          attributes: {
            ...mockMessages.data[0].attributes,
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
      ],
    };

    const mockSingeDraft = { data: mockSingleDraftThread.data[0] };
    mockSingeDraft.data.attributes.draftDate = newDate;
    mockSingeDraft.data.attributes.sentDate = null;

    draftPage.loadSingleDraft(mockSingleDraftThread, mockSingeDraft);

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
        `${Alerts.NO_ASSOCIATION.HEADER} ${
          mockRecipients.data[0].attributes.name
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
      .should('include.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('include.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get('#select').should(
      'not.contain',
      mockRecipients.data[0].attributes.name,
    );
  });
});
