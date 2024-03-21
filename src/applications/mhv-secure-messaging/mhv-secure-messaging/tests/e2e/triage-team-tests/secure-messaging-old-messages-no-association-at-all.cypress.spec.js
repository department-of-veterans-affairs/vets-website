import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';

describe('Verify old messages - No association with particular Triage Group', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();

  const currentDate = new Date();
  const fortyFiveDaysAgo = new Date();
  fortyFiveDaysAgo.setDate(currentDate.getDate() - 46);

  beforeEach(() => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockNoRecipients,
    );
  });

  it('detailed view - older than 45 day', () => {
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

    landingPage.loadSingleThread(oldThreadWithNoAssociatedTG, fortyFiveDaysAgo);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.ALERTS.EXPANDABLE_TITLE)
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
      .should('have.text', Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .first()
      .should('have.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });

  it('existing draft - older than 45 days', () => {
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

    landingPage.loadSingleThread(mockThreadWithOldDraft, fortyFiveDaysAgo);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.ALERTS.EXPANDABLE_TITLE)
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

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should('not.exist');
  });
});
