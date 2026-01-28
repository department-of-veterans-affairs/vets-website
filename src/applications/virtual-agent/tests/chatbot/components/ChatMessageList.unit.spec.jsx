import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

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
});
