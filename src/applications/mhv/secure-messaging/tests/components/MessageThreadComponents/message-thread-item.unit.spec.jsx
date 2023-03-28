import React from 'react';
import { waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import MessageThreadItem from '../../../components/MessageThread/MessageThreadItem';

describe('Meesage thread item', () => {
  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(
      <MessageThreadItem message={messageResponse} />,
      {
        initialState: {
          sm: {
            messageDetails: {
              message: messageResponse,
              messageHistory: [],
            },
          },
        },
        reducers: reducer,
      },
    );

    waitFor(
      fireEvent.click(
        screen.getByTestId(
          `expand-message-button-${messageResponse.messageId}`,
        ),
      ),
    );
    expect(
      screen.getByTestId('message-body-attachments-label').textContent,
    ).to.equal('Attachments');
  });
});
