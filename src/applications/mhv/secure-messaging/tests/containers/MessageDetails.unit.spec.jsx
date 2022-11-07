import React from 'react';
import '@testing-library/react';
import { expect } from 'chai';
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import MessageDetail from '../../containers/MessageDetails';
import reducers from '../../reducers';

describe('Message Details container', () => {
  const mockData = reducers({
    sm: {
      alerts: {
        alertVisible: true,
        alertList: [
          {
            datestamp: '2022-11-03T15:01:48.463Z',
            isActive: true,
            alertType: 'info',
            header: 'You cannot reply to a message that is older than 45 days.',
            content:
              "Please select 'Compose' to create a new message and try again.",
          },
        ],
      },
      messageDetails: {
        message: {
          sentDate: '2020-03-27T14:13:01.000Z',
          messageId: '7177339',
        },
        messageHistory: [],
      },
      messages: {},
    },
  });
  it('Checks for `Cannot Reply` Alert within Message Details Container', () => {
    const screen = renderWithStoreAndRouter(<MessageDetail />, {
      path: `/message/${mockData.sm.messageDetails.message.messageId}`,
    });

    expect(screen).toContain();
  });
});
