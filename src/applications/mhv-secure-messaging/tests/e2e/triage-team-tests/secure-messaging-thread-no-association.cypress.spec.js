import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Paths, Locators, Alerts } from '../utils/constants';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockThread from '../fixtures/thread-response.json';

describe('SM NO ASSOCIATION WITH PARTICULAR TG', () => {
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

    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click({
      waitForAnimations: true,
    });

    cy.findByTestId(Locators.INTERSTITIAL_CONTINUE_BUTTON).click({
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
      .find('va-link-action')
      .first()
      .should('have.attr', 'href', Paths.FIND_LOCATIONS)
      .and('have.attr', 'text', Alerts.NO_ASSOCIATION.LINK);

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
