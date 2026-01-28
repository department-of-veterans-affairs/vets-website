import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import ChatboxContainer from '../../../chatbot/components/chatbox/ChatboxContainer';

describe('ChatboxContainer', () => {
  it('renders the header and children', () => {
    const { getByText, getByTestId } = render(
      <ChatboxContainer>
        <p>Chat content</p>
      </ChatboxContainer>,
    );

    expect(getByTestId('chatbox-container')).to.exist;
    expect(getByText('VA chatbot (beta)')).to.exist;
    expect(getByText('Chat content')).to.exist;
  });

  it('renders a custom title when provided', () => {
    const { getByText } = render(
      <ChatboxContainer title="Custom title">
        <span>Content</span>
      </ChatboxContainer>,
    );

    expect(getByText('Custom title')).to.exist;
  });
});
