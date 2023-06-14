import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import reducers from '../../../reducers';
import inbox from '../../fixtures/folder-inbox-response.json';
import MessageList from '../../../components/MessageList/MessageList';
import { Paths } from '../../../util/constants';

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
const initialState = {
  sm: {
    folders: { folder: inbox },
    messages: [],
  },
};
describe('Message List component', () => {
  let screen;
  it('renders without errors', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/',
        initialState,
        reducers,
      },
    );
    expect(screen);
  });
  it('sorting list is present', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/',
        initialState,
        reducers,
      },
    );
    const dropDownListItem = screen.getByText('Newest to oldest');
    expect(dropDownListItem).to.exist;
  });
  it('sorting list doesnt display recipient sorting option when the url path is "/" only displays sender sorting options', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/',
        initialState,
        reducers,
      },
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Sender’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient when the url path is "/drafts"', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/drafts',
        initialState,
        reducers,
      },
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient when the url path is "/sent"', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: '/sent',
        initialState,
        reducers,
      },
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient on a custom folder', () => {
    screen = renderWithStoreAndRouter(
      <MessageList messages={mockMessages} folder={inbox} />,
      {
        path: `${Paths.FOLDERS}12345`,
        initialState,
        reducers,
      },
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).to.exist;
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
  });
});
