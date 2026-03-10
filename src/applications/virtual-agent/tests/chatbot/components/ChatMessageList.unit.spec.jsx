import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import ChatMessageList from '../../../chatbot/components/chatbox/ChatMessageList';

describe('ChatMessageList', () => {
  it('renders messages and the error message at the end', () => {
    const messages = [
      { id: '1', sender: 'va', text: 'First message' },
      { id: '2', sender: 'user', text: 'Second message' },
    ];

    const { container, getByTestId, getByText } = render(
      <ChatMessageList
        messages={messages}
        errorMessage="Something went wrong"
      />,
    );

    expect(getByTestId('chat-message-list')).to.exist;
    expect(getByText('First message')).to.exist;
    expect(getByText('Second message')).to.exist;
    expect(getByTestId('chat-message-error')).to.exist;

    const listItems = container.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1];
    expect(lastItem.getAttribute('data-testid')).to.equal('chat-message-error');
  });

  it('renders only messages when there is no error', () => {
    const messages = [{ id: '1', sender: 'va', text: 'All good' }];

    const { queryByTestId, getByText } = render(
      <ChatMessageList messages={messages} />,
    );

    expect(getByText('All good')).to.exist;
    expect(queryByTestId('chat-message-error')).to.be.null;
  });

  it('renders quick reply buttons for the last message and sends payload on click', () => {
    const onQuickReply = payload => payload;
    const onQuickReplySpy = sinon.spy(onQuickReply);
    const messages = [
      { id: '1', sender: 'user', text: 'Question' },
      {
        id: '2',
        sender: 'va',
        text: 'Choose an option',
        quickReplies: [
          { text: 'Continue', payload: 'Continue' },
          { text: 'View Full Article', payload: 'View Full Article' },
        ],
      },
    ];

    const { getByTestId, getAllByTestId } = render(
      <ChatMessageList messages={messages} onQuickReply={onQuickReplySpy} />,
    );

    expect(getByTestId('chat-quick-replies')).to.exist;

    const buttons = getAllByTestId('chat-quick-reply-button');
    expect(buttons).to.have.lengthOf(2);

    fireEvent.click(buttons[0]);
    expect(onQuickReplySpy.calledOnce).to.be.true;
    expect(onQuickReplySpy.firstCall.args[0]).to.equal('Continue');
  });
});
