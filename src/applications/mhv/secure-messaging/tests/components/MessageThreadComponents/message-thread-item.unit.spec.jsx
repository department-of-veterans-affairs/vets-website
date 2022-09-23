import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import messages from '../../fixtures/messages-response.json';
import MessageThreadItem from '../../../components/MessageThread/MessageThreadItem';

describe('Meesage thread item', () => {
  it('renders without errors', () => {
    const message = messages.data[0];
    const screen = render(<MessageThreadItem message={message} />);
    fireEvent.click(screen.getByTestId('expand-message-button'));
    expect(
      screen.getByTestId('message-body-attachments-label').textContent,
    ).to.equal('Attachments');
  });
});
