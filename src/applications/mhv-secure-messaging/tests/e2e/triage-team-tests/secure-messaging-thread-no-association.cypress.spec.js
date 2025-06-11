import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Paths, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';
import mockOHThread from '../fixtures/thread-OH-response.json';

describe('Verify thread - No association with particular Triage Group', () => {
  const updatedData = mockRecipients.data.slice(1);
  const updatedMeta = { ...mockRecipients.meta, associatedTriageGroups: 6 };
  const removedFirstRecipientsList = {
    data: updatedData,
    meta: updatedMeta,
  };

  it('creating message view', () => {
    SecureMessagingSite.login();

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click({
      waitForAnimations: true,
    });

    cy.findByTestId(Locators.BUTTONS.CONTINUE).click({
      waitForAnimations: true,
    });

    cy.get(Locators.ALERTS.REPT_SELECT).should(
      'not.contain',
      mockRecipients.data[0].attributes.name,
    );
  });

  it('detailed view', () => {
    const threadWithNoAssociatedTG = {
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
    SecureMessagingSite.login();

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );
    PatientInboxPage.loadSingleThread(threadWithNoAssociatedTG);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .shadow()
      .find('span')
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
      .should('have.attr', 'href', Paths.FIND_LOCATIONS)
      .and('have.text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });

  it('verify OH user can send a message to no associated team', () => {
    const threadWithNoAssociatedTG = {
      ...mockOHThread,
      data: [
        {
          ...mockOHThread.data[0],
          attributes: {
            ...mockOHThread.data[0].attributes,
            recipientName: mockRecipients.data[0].attributes.name,
            triageGroupName: mockRecipients.data[0].attributes.name,
            recipientId: mockRecipients.data[0].attributes.triageTeamId,
          },
        },
        ...mockOHThread.data,
      ],
    };
    SecureMessagingSite.login();

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      removedFirstRecipientsList,
    );

    PatientInboxPage.loadSingleThread(threadWithNoAssociatedTG);

    cy.get(Locators.ALERTS.BLOCKED_GROUP).should('not.exist');
    cy.get(Locators.BUTTONS.REPLY).should('be.visible');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
