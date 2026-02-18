import threadResponse from '../fixtures/thread-response-new-api.json';
import inboxMessages from '../fixtures/threads-response.json';
import GeneralFunctionsPage from './GeneralFunctionsPage';
import { Locators, Paths } from '../utils/constants';
import PatientInterstitialPage from './PatientInterstitialPage';

class PatientMessageDetailsPage {
  loadSingleThread = (
    singleThreadResponse = threadResponse,
    multiThreadsResponse = inboxMessages,
  ) => {
    const singleMessageResponse = { data: singleThreadResponse.data[0] };
    cy.intercept(
      `GET`,
      `${Paths.SM_API_EXTENDED}/${
        multiThreadsResponse.data[0].attributes.messageId
      }/thread*`,
      singleThreadResponse,
    ).as(`threadResponse`);

    cy.intercept(
      `GET`,
      `${Paths.SM_API_EXTENDED}/${
        singleThreadResponse.data[0].attributes.messageId
      }`,
      singleMessageResponse,
    ).as(`threadFirstMessageResponse`);

    cy.get(
      `#message-link-${multiThreadsResponse.data[0].attributes.messageId}`,
    ).click();
    cy.wait(`@threadResponse`);
  };

  loadReplyMessageThread = (singleThreadResponse = threadResponse) => {
    cy.intercept(
      `GET`,
      `${Paths.SM_API_EXTENDED}/${
        singleThreadResponse.data[0].attributes.messageId
      }/thread*`,
      singleThreadResponse,
    ).as(`threadResponse`);

    cy.get(Locators.BUTTONS.REPLY)
      .should('be.visible')
      .click({ force: true });
  };

  expandAllThreadMessages = () => {
    cy.findByTestId(Locators.ALERTS.THREAD_EXPAND)
      .should('be.visible')
      .shadow()
      .find('va-button-icon[data-testid="expand-all-accordions"]')
      .shadow()
      .find('button')
      .click({ force: true });
  };

  collapseAllThreadMessages = () => {
    cy.findByTestId(Locators.ALERTS.THREAD_EXPAND)
      .should('be.visible')
      .shadow()
      .find('va-button-icon[data-testid="collapse-all-accordions"]')
      .shadow()
      .find('button')
      .click({ force: true });
  };

  verifyMessageDetails = messageDetails => {
    cy.get(Locators.MSG_ID).should(
      'contain',
      messageDetails.data[0].attributes.messageId,
    );

    cy.get(Locators.FROM).should(
      'contain',
      messageDetails.data[0].attributes.senderName,
    );

    cy.get(Locators.TO).should(
      'contain',
      messageDetails.data[0].attributes.recipientName,
    );
  };

  verifyTrashButtonModal = () => {
    cy.get(Locators.BUTTONS.TRASH_TEXT)
      .should('be.visible')
      .click({ waitForAnimations: true });

    cy.get('[data-testid=delete-message-confirm-note] p', { timeout: 8000 })
      .contains('Messages in the trash folder')
      .should('be.visible');
    cy.get(Locators.ALERTS.DELETE_MESSAGE)
      .shadow()
      .find('h2')
      .contains('Are you sure you want to move this message to the trash?')
      .should('be.visible');
    cy.get(Locators.ALERTS.DELETE_MESSAGE)
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible');
    cy.get(Locators.ALERTS.DELETE_MESSAGE)
      .shadow()
      .find('button')
      .contains('Cancel')
      .should('be.visible')
      .click();
  };

  verifyMoveToButtonModal = () => {
    cy.findByTestId(Locators.BUTTONS.MOVE_BUTTON_TEST_ID).click();
    cy.get(Locators.ALERTS.MOVE_MODAL, { timeout: 8000 })
      .find('p')
      .contains('Any replies to this message will appear in your inbox')
      .should('be.visible');
    cy.get(Locators.BUTTONS.DELETE_RADIOBTN).should('be.visible');
    cy.get(Locators.BUTTONS.TEST2).should('be.visible');
    cy.get(Locators.BUTTONS.TESTAGAIN).should('be.visible');
    cy.get(Locators.BUTTONS.NEW_FOLDER_RADIOBTN).should('be.visible');
    cy.get(Locators.ALERTS.MOVE_MODAL)
      .find('va-button[text="Confirm"]')
      .should('be.visible');
    cy.get(Locators.ALERTS.MOVE_MODAL)
      .find('va-button[text="Cancel"]')
      .should('be.visible')
      .click();
  };

  openMoveToButtonModal = () => {
    cy.findByTestId(Locators.BUTTONS.MOVE_BUTTON_TEST_ID).click();
    cy.get(Locators.ALERTS.MOVE_MODAL, { timeout: 8000 })
      .find('p')
      .contains('Any replies to this message will appear in your inbox')
      .should('be.visible');
    cy.get(Locators.BUTTONS.DELETE_RADIOBTN).should('be.visible');
    cy.get(Locators.BUTTONS.TEST2).should('be.visible');
    cy.get(Locators.BUTTONS.TESTAGAIN)
      .should('be.visible')
      .click();
    cy.get(Locators.BUTTONS.NEW_FOLDER_RADIOBTN).should('be.visible');
    cy.get(Locators.ALERTS.MOVE_MODAL)
      .find('va-button[text="Confirm"]')
      .should('be.visible')
      .click();
  };

  loadReplyPage = mockMessageDetails => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockMessageDetails.data.attributes.messageId
      }`,
      mockMessageDetails,
    ).as('reply-message');
    cy.get('[data-testid=reply-button-text]').click();
  };

  verifyUnexpandedMessageAttachment = (messageIndex = 0) => {
    cy.log(
      `message has attachments = ${
        this.currentThread.data.at(messageIndex).attributes.hasAttachments
      }`,
    );
    if (
      this.currentThread.data.at(messageIndex + 1).attributes.hasAttachments
    ) {
      cy.log('message has attachment... checking for image');
      cy.get('[data-testid="message-attachment-img')
        .eq(messageIndex)
        .should('be.visible');
    }
    cy.log('message does not have attachment');
  };

  verifyUnexpandedMessageFrom = (messageDetails, messageIndex = 0) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${messageDetails.data.attributes.messageId}`,
      messageDetails,
    );
    cy.get('.older-message')
      .eq(messageIndex)
      .should(
        'contain',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  verifyExpandedThreadAttachment = (
    messageThread,
    messageIndex = 0,
    attachmentIndex = 0,
  ) => {
    cy.get(
      `[data-testid="expand-message-button-${
        messageThread.data[messageIndex].id
      }"]`,
    )
      .find(
        `[data-testid="has-attachment-${
          messageThread.data[messageIndex].attributes.attachments[
            attachmentIndex
          ].id
        }"]`,
      )
      .should(
        'have.text',
        `${
          messageThread.data[messageIndex].attributes.attachments[
            attachmentIndex
          ].name
        }`,
      );
  };

  verifyExpandedMessageFrom = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.FROM)
      .eq(messageIndex)
      .should(
        'have.text',
        `From: ${messageDetails.data[messageIndex].attributes.senderName}`,
      );
  };

  verifyExpandedMessageTo = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.TO)
      .eq(messageIndex)
      .should(
        'have.text',
        `To: ${messageDetails.data[messageIndex].attributes.recipientName}`,
      );
  };

  verifyExpandedMessageId = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.MSG_ID)
      .eq(messageIndex)
      .should(
        'have.text',
        `Message ID: ${messageDetails.data[messageIndex].attributes.messageId}`,
      );
  };

  verifyExpandedMessageDate = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.MSG_DATE)
      .eq(messageIndex)
      .should(
        'include.text',
        `Date: ${GeneralFunctionsPage.formatToReadableDate(
          messageDetails.data[messageIndex].attributes.sentDate,
        )}`,
      );
  };

  verifyExpandedThreadBody = (messageThread, messageIndex = 0) => {
    cy.findByTestId(
      `expand-message-button-${messageThread.data[messageIndex].id}`,
    ).within(() => {
      cy.findByTestId(
        `message-body-${messageThread.data[messageIndex].id}`,
      ).should(
        'have.text',
        `${messageThread.data[messageIndex].attributes.body}`,
      );
    });
  };

  replyToMessageTo = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.REPLY_TO)
      .eq(messageIndex)
      .should(
        'have.text',
        `Draft To: ${messageDetails.data.attributes.senderName}\n(Team: ${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  replyToMessageSenderName = (messageDetails, messageIndex = 0) => {
    cy.log('testing message from sender');
    cy.get(Locators.FROM)
      .eq(messageIndex)
      .should(
        'have.text',
        `From: ${messageDetails.data.attributes.senderName}`,
      );
  };

  replyToMessageRecipientName = (messageDetails, messageIndex = 0) => {
    cy.log('testing message to recipient');
    cy.get(Locators.TO)
      .eq(messageIndex)
      .should('contain', `To: ${messageDetails.data.attributes.recipientName}`);
  };

  replyToMessageDate = (messageDetails, messageIndex = 0) => {
    cy.get(Locators.MSG_DATE)
      .eq(messageIndex)
      .should(
        'include.text',
        `Date: ${GeneralFunctionsPage.formatToReadableDate(
          messageDetails.data.attributes.sentDate,
        )}`,
      );
  };

  replyToMessageId = messageDetails => {
    cy.get(Locators.MSG_ID).should(
      'contain',
      `Message ID: ${messageDetails.data.attributes.messageId}`,
    );
  };

  verifySingleButton = text => {
    cy.get(`[data-testid*=${text}]`).should(`be.visible`);
  };

  verifyReplyButtonByKeyboard = text => {
    cy.tabToElement(`[data-testid*=${text}]`);
    cy.get(`[data-testid*=${text}]`).should('be.focused');
  };

  verifySingleButtonByKeyboard = text => {
    cy.tabToElement(`#${text}-button`);
    cy.get(`#${text}-button`).then(el => {
      cy.wrap(el)
        .invoke('text')
        .should('match', new RegExp(text, 'i'));
      cy.wrap(el).should('be.focused');
    });
  };

  verifyButtonsKeyboardNavigation = () => {
    cy.get('.message-detail-block')
      .find('button')
      .each(btn => {
        cy.tabToElement(btn).should(`be.focused`);
      });
  };

  verifyMessageExpandAndFocusByKeyboard = () => {
    cy.tabToElement(Locators.BUTTONS.THREAD_EXPAND_MESSAGES);
    cy.realPress('Enter');

    cy.get(Locators.BUTTONS.THREAD_EXPAND_MESSAGES).each(el => {
      cy.tabToElement(el);
      cy.wrap(el)
        .should('be.visible')
        .and('have.focus');
      cy.realPress(`Enter`);
      cy.wrap(el)
        .find(Locators.MESSAGE_THREAD_META)
        .should('be.visible');
      // line below was added because focus jump out to header from fist message after pressing the Enter btn
      cy.tabToElement(el);
      cy.realPress(`Enter`);
      cy.wrap(el)
        .find(Locators.MESSAGE_THREAD_META)
        .should('not.be.visible');
    });
  };

  replyToMessageBody = testMessage => {
    cy.get(`[data-testid="message-body-${testMessage.data.id}"]`).should(
      'contain',
      testMessage.data.attributes.body,
    );
  };

  clickReplyButton = singleThreadData => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${singleThreadData.data[0].id}/thread*`,
      singleThreadData,
    ).as('replyThread');

    cy.get(Locators.BUTTONS.REPLY).click({ force: true });
    PatientInterstitialPage.getContinueButton().click();
  };

  clickReplyButtonCuratedFlow = singleThreadData => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${singleThreadData.data[0].id}/thread*`,
      singleThreadData,
    ).as('replyThread');

    cy.get(Locators.BUTTONS.REPLY).click({ force: true });
    PatientInterstitialPage.getStartMessageLink().click();
  };

  verifyMessageAttachment = (messageDetails, messageIndex = 0) => {
    if (messageDetails.data.at(messageIndex).attributes.hasAttachments) {
      cy.log('message has attachment... checking for image');
      cy.get(
        `[data-testid="expand-message-button-${
          messageDetails.data[messageIndex].attributes.messageId
        }"]`,
      )
        .find(Locators.ICONS.ATTCH_ICON)
        .should('be.visible');
    } else {
      cy.log('message does not have attachment');
    }
  };

  verifyAccordionStatus = value => {
    // First, wait for at least one accordion to have the expected state - fixes flakiness to split these up.
    cy.findByTestId(Locators.BUTTONS.THREAD_EXPAND)
      .find(`va-accordion-item`)
      .should('have.length.greaterThan', 0)
      .first()
      .invoke('prop', 'open')
      .should('eq', value);

    // Then check all accordions
    cy.findByTestId(Locators.BUTTONS.THREAD_EXPAND)
      .find(`va-accordion-item`)
      .each(el => {
        cy.wrap(el)
          .invoke(`prop`, 'open')
          .should(`eq`, value);
      });
  };
}

export default new PatientMessageDetailsPage();
