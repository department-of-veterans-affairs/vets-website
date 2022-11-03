import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { messageHistory } from '../../fixtures/message-history-mock-reducer.json';
import MessageThreadItem from '../../../components/MessageThread/MessageThreadItem';

describe('Meesage thread item', () => {
  it('renders without errors', () => {
    const message = messageHistory;
    const screen = render(<MessageThreadItem message={message} />);
    waitFor(fireEvent.click(screen.getByTestId('expand-message-button')));
    expect(
      screen.getByTestId('message-body-attachments-label').textContent,
    ).to.equal('Attachments');
  });
});
