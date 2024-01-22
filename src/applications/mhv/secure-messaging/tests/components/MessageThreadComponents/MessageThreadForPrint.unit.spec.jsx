import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import { messages } from '../../fixtures/message-thread-with-full-body-response.json';
import MessageThreadForPrint from '../../../components/MessageThread/MessageThreadForPrint';
import { getSize } from '../../../util/helpers';

describe('MessageThreadForPrint component', () => {
  const initialState = {
    sm: {
      threadDetails: { messages, printOption: 'PRINT_THREAD' },
    },
  };
  const initialPath = `/thread/${messages[0].messageId}`;
  const setup = (
    state = initialState,
    path = initialPath,
    messageHistory = messages,
  ) => {
    return renderWithStoreAndRouter(
      <MessageThreadForPrint messageHistory={messageHistory} printThread />,
      {
        initialState: state,
        reducers: reducer,
        path,
      },
    );
  };

  it('Renders component layout to display extended messages, word count that`s greater than 200, and attachment metadata for print', () => {
    const screen = setup();

    expect(screen.getByTestId('message-thread-for-print')).to.exist;
    expect(document.querySelector('h2').textContent).to.equal(
      `${messages.length} Messages in this conversation`,
    );

    const extendedMessages = messages.map(
      m => `expand-message-button-${m.messageId}`,
    );

    expect(extendedMessages).to.have.lengthOf(messages.length);

    const messageBody = screen.getAllByTestId('message-body');
    const wordCount = messageBody[0].textContent.split(/\s+/).length;
    expect(wordCount).to.equal(500);

    const attachmentFile = screen.getByTestId(
      `attachment-name-${messages[1]?.attachments[0].messageId}`,
    );
    const attachmentName = messages[1]?.attachments[0].name;
    const attachmentSize = messages[1]?.attachments[0].attachmentSize;

    expect(attachmentFile).to.exist;
    expect(screen.queryByText(attachmentName)).to.exist;
    expect(screen.getByTestId('attachment-link-metadata').textContent).to.equal(
      `${attachmentName}(${getSize(attachmentSize)})Has attachment`,
    );
  });
});
