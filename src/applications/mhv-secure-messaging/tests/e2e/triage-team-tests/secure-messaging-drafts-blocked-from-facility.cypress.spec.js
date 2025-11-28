import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Alerts, Paths } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockFacilityBlockedRecipients from '../fixtures/recipientsResponse/facility-blocked-recipients-response.json';
import mockThread from '../fixtures/thread-response.json';

describe('verify drafts - blocked from facility', () => {
  const newDate = new Date().toISOString();

  beforeEach(() => {
    SecureMessagingSite.login();

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockFacilityBlockedRecipients,
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
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
        ...mockThread.data,
      ],
    };

    PatientInboxPage.loadSingleThread(mockThreadWithDraft, newDate, newDate);

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
        `${Alerts.BLOCKED.HEADER} ${mockRecipients.data[0].attributes.name}`,
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
      .should('include.text', Alerts.BLOCKED.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'text', Alerts.BLOCKED.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'href', Paths.FIND_LOCATIONS);

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
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
      ],
    };

    PatientInboxPage.loadSingleThread(mockSingleDraft, newDate, newDate);

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
        `${Alerts.BLOCKED.HEADER} ${mockRecipients.data[0].attributes.name}`,
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
      .should('include.text', Alerts.BLOCKED.PARAGRAPH);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'text', Alerts.BLOCKED.LINK);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find('va-link-action')
      .should('have.attr', 'href', Paths.FIND_LOCATIONS);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
