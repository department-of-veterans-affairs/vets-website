import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../../../reducers';

import inbox from '../../fixtures/folder-inbox-response.json';
import MessageList from '../../../components/MessageList/MessageList';

const mockMessages = {
  data: [
    {
      id: '7181007',
      type: 'messages',
      attributes: {
        messageId: 7181007,
        category: 'TEST_RESULTS',
        subject: 'Test Inquiry',
        body: null,
        attachment: false,
        sentDate: '2022-09-13T16:09:26.000Z',
        senderId: 20029,
        senderName: 'bbbbbbbbbbbbbbbbbbbb',
        recipientId: 6820911,
        recipientName: 'ddddddddddd, ',
        readReceipt: 'READ',
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/messages/7181007',
      },
    },
    {
      id: '7180407',
      type: 'messages',
      attributes: {
        messageId: 7180407,
        category: 'COVID',
        subject: 'Covid-Inquiry-17',
        body: null,
        attachment: false,
        sentDate: '2022-09-13T12:53:37.000Z',
        senderId: 6177,
        senderName: 'cccccccccccccccccc',
        recipientId: 6820911,
        recipientName: 'bbbbbbbbbbbbbb ',
        readReceipt: 'READ',
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/messages/7180407',
      },
    },
  ],
  links: {
    self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/0/messages?',
    first:
      'http://127.0.0.1:3000/my_health/v1/messaging/folders/0/messages?page=1&per_page=10',
    prev: null,
    next:
      'http://127.0.0.1:3000/my_health/v1/messaging/folders/0/messages?page=2&per_page=10',
    last:
      'http://127.0.0.1:3000/my_health/v1/messaging/folders/0/messages?page=5&per_page=10',
  },
  meta: {
    sort: {
      sentDate: 'DESC',
    },
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 5,
      totalEntries: 46,
    },
  },
};

describe('FolderListView', () => {
  it('renders without errors', () => {
    const initialState = {
      sm: {
        folders: { folder: inbox },
        messages: [],
      },
    };

    const screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/',
        initialState,
        reducers,
      },
    );

    expect(screen);
  });
});
