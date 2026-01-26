import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import ChatMessageError from '../../../chatbot/components/chatbox/ChatMessageError';

describe('ChatMessageError', () => {
  it('renders the error alert with message text', () => {
    const { getByText } = render(
      <ul>
        <ChatMessageError message="Unable to connect" />
      </ul>,
    );

    expect(getByText('We ran into a problem')).to.exist;
    expect(getByText('Unable to connect')).to.exist;
  });
});
