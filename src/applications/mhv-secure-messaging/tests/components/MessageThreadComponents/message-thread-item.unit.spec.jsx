import React from 'react';
import { waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import MessageThreadItem from '../../../components/MessageThread/MessageThreadItem';
import { dateFormat } from '../../../util/helpers';
import { DefaultFolders, MessageReadStatus } from '../../../util/constants';

describe('Message thread item', () => {
  const setup = (message = messageResponse) => {
    return renderWithStoreAndRouter(<MessageThreadItem message={message} />, {
      reducers: reducer,
    });
  };

  it('renders without errors', () => {
    const screen = setup();

    const accordion = document.querySelector('va-accordion-item');
    expect(
      screen.findByText(
        dateFormat(messageResponse.sentDate, 'MMMM D [at] h:mm a z'),
        { selector: 'h6' },
      ),
    ).to.exist;

    expect(screen.queryByTestId('attachment-icon')).to.exist;

    waitFor(
      fireEvent.click(
        screen.getByTestId(
          `expand-message-button-${messageResponse.messageId}`,
        ),
      ),
    );
    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );
    const attachmentIcon = screen.getByTestId('attachment-icon');
    expect(attachmentIcon).to.exist;
    expect(attachmentIcon.getAttribute('slot')).to.equal('subheader-icon');
    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName} (${
        messageResponse.triageGroupName
      })`,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.recipientName}`,
    );
    expect(
      accordion
        .querySelector(
          `[data-testid="message-body-${messageResponse.messageId}"]`,
        )
        .textContent.trim(),
    ).to.equal(messageResponse.body);
    expect(screen.getByText(messageResponse.attachments[0].name)).to.exist;
  });

  it('message from patient renders without errors', () => {
    const message = {
      ...messageResponse,
      recipientName: messageResponse.triageGroupName,
    };
    const screen = setup(message);
    const accordion = document.querySelector('va-accordion-item');
    expect(accordion.getAttribute('aria-label')).to.equal(
      `message sent ${dateFormat(
        message.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}, with attachment from ${message.senderName}.`,
    );
    expect(
      screen.getByText(
        dateFormat(messageResponse.sentDate, 'MMMM D [at] h:mm a z'),
        { selector: 'h3' },
      ),
    ).to.exist;

    expect(
      document.querySelector('va-accordion-item').getAttribute('subheader'),
    ).to.equal('Me');
    expect(screen.getByTestId('message-date').textContent).to.equal(
      `Date: ${dateFormat(
        messageResponse.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}`,
    );
    // message from patient, no triage group name in 'from' field
    expect(screen.getByTestId('from').textContent).to.equal(
      `From: ${messageResponse.senderName} `,
    );
    expect(screen.getByTestId('to').textContent).to.equal(
      `To: ${messageResponse.triageGroupName}`,
    );
    expect(
      accordion
        .querySelector(
          `[data-testid="message-body-${messageResponse.messageId}"]`,
        )
        .textContent.trim(),
    ).to.equal(messageResponse.body);
    expect(screen.getByText(messageResponse.attachments[0].name)).to.exist;
  });

  it('message without attachment does not render attachment icon', () => {
    const messageNoAttachment = {
      ...messageResponse,
      attachments: [],
      attachment: false,
    };
    const screen = setup(messageNoAttachment);
    expect(screen.queryByTestId('attachment-icon')).to.not.exist;
    const accordionButton = screen.getByTestId(
      `expand-message-button-${messageResponse.messageId}`,
    );
    expect(accordionButton.getAttribute('aria-label')).to.equal(
      `message received ${dateFormat(
        messageNoAttachment.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )},  from ${messageNoAttachment.senderName}.`,
    );
    waitFor(fireEvent.click(accordionButton));
    expect(screen.queryByTestId('attachment-icon')).to.not.exist;
  });

  it('unread message render "unread" circle icon', () => {
    const messageNoAttachment = {
      ...messageResponse,
      readReceipt: MessageReadStatus.UNREAD,
    };
    const screen = setup(messageNoAttachment);
    expect(screen.getByTestId('unread-icon')).to.exist;
    const accordionButton = screen.getByTestId(
      `expand-message-button-${messageResponse.messageId}`,
    );
    expect(accordionButton.getAttribute('aria-label')).to.equal(
      `New message received ${dateFormat(
        messageNoAttachment.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}, with attachment from ${messageNoAttachment.senderName}.`,
    );
    waitFor(fireEvent.click(accordionButton));
    const icon = screen.getByTestId('unread-icon');
    expect(icon).to.exist;
    expect(icon.getAttribute('slot')).to.equal('icon');
  });

  it('should not render "unread" circle icon if message is sent by user', () => {
    const messageInSentFolder = {
      ...messageResponse,
      readReceipt: MessageReadStatus.UNREAD,
      folderId: DefaultFolders.SENT.id,
    };
    const screen = setup(messageInSentFolder);

    expect(screen.queryByTestId('unread-icon')).to.not.exist;
  });

  it('should not render "unread" circle icon if message is "read"', () => {
    const messageReadByUser = {
      ...messageResponse,
      readReceipt: MessageReadStatus.READ,
    };
    const screen = setup(messageReadByUser);

    expect(screen.queryByTestId('unread-icon')).to.not.exist;
  });

  it('should call handleExpand with correct args', () => {
    const isPreloaded = false;
    const mockDispatch = sinon.spy();
    const dispatch = mockDispatch;

    const markMessageAsRead = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <MessageThreadItem
        message={{ ...messageResponse }}
        isPreloaded={isPreloaded}
        dispatch={dispatch}
        markMessageAsRead={markMessageAsRead}
      />,
      {
        reducers: reducer,
      },
    );
    const accordionButton = screen.getByTestId(
      `expand-message-button-${messageResponse.messageId}`,
    );
    waitFor(fireEvent.click(accordionButton));
    expect(mockDispatch.called).to.be.false;
  });
});
