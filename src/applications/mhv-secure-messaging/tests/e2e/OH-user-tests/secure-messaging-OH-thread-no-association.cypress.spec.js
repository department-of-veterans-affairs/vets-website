import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { Alerts, AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockOHThread from '../fixtures/thread-OH-response.json';

describe('SM OH USER NO ASSOCIATION WITH PARTICULAR TG', () => {
  const updatedData = mockRecipients.data.slice(1);
  const updatedMeta = { ...mockRecipients.meta, associatedTriageGroups: 6 };
  const removedFirstRecipientsList = {
    data: updatedData,
    meta: updatedMeta,
  };

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

  it('verify OH user old message behavior', () => {
    const currentDate = new Date();
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(currentDate.getDate() - 46);

    const oldThreadWithNoAssociatedTG = {
      ...mockOHThread,
      data: [
        {
          ...mockOHThread.data[0],
          attributes: {
            ...mockOHThread.data[0].attributes,
            sentDate: fortyFiveDaysAgo.toISOString(),
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

    PatientInboxPage.loadSingleThread(
      oldThreadWithNoAssociatedTG,
      fortyFiveDaysAgo,
    );

    cy.get(Locators.ALERTS.EXPIRED_MESSAGE)
      .should('be.visible')
      .and('contain', Alerts.OH_OLD_MSG.HEADER);

    cy.get(`va-alert> :nth-child(2)`).should(
      'have.text',
      Alerts.OH_OLD_MSG.P_1,
    );

    cy.get(`va-alert> :nth-child(3)`).should(
      'have.text',
      Alerts.OH_OLD_MSG.P_2,
    );

    cy.get(`va-alert> :nth-child(4)`)
      .find(`a`)
      .should('have.attr', `href`, `/find-locations`);

    cy.get(`va-alert> :nth-child(5)`).should(
      'have.text',
      Alerts.OH_OLD_MSG.P_3,
    );

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
