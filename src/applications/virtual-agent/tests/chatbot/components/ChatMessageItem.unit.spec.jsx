import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import ChatMessageItem from '../../../chatbot/components/chatbox/ChatMessageItem';

describe('ChatMessageItem', () => {
  it('renders a VA message with the VA icon', () => {
    const message = {
      id: 'va-1',
      sender: 'va',
      text: 'Hello from VA',
    };

    const { getByText, getByTestId } = render(
      <ul>
        <ChatMessageItem message={message} />
      </ul>,
    );

    expect(getByText('Hello from VA')).to.exist;
    expect(getByTestId('chat-icon-va')).to.exist;
  });

  it('renders a user message with the user icon', () => {
    const message = {
      id: 'user-1',
      sender: 'user',
      text: 'Hello from me',
    };

    const { getByText, getByTestId } = render(
      <ul>
        <ChatMessageItem message={message} />
      </ul>,
    );

    expect(getByText('Hello from me')).to.exist;
    expect(getByTestId('chat-icon-user')).to.exist;
  });

  it('renders markdown links in the message body', () => {
    const message = {
      id: 'va-md-1',
      sender: 'va',
      text: '[Read more](https://va.gov)',
    };

    const { getByRole } = render(
      <ul>
        <ChatMessageItem message={message} />
      </ul>,
    );

    const link = getByRole('link', { name: 'Read more' });
    expect(link.getAttribute('href')).to.equal('https://va.gov');
  });
});
