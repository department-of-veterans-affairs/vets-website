import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import reducers from '../../../reducers';
import {
  inbox,
  sent,
  drafts,
  customFolder,
} from '../../fixtures/folder-inbox-response.json';
import MessageList from '../../../components/MessageList/MessageList';
import { Paths, threadSortingOptions } from '../../../util/constants';

const mockMessages = [
  {
    messageId: 2817226,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: true,
    sentDate: '2023-05-17T16:11:26.000Z',
    senderId: 2708253,
    senderName: 'TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'MHVDAYMARK, MARK ',
    readReceipt: 'READ',
    triageGroupName: null,
    proxySenderName: null,
  },
  {
    messageId: 2817221,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: false,
    sentDate: '2023-05-17T16:11:00.000Z',
    senderId: 2708253,
    senderName: 'TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'MHVDAYMARK, MARK ',
    readReceipt: 'READ',
    triageGroupName: null,
    proxySenderName: null,
  },
  {
    messageId: 2817217,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: true,
    sentDate: '2023-05-17T16:10:24.000Z',
    senderId: 2708253,
    senderName: 'TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'MHVDAYMARK, MARK ',
    readReceipt: 'READ',
    triageGroupName: null,
    proxySenderName: null,
  },
  {
    messageId: 2817178,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: false,
    sentDate: '2023-05-17T16:05:27.000Z',
    senderId: 2708253,
    senderName: 'TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'MHVDAYMARK, MARK ',
    readReceipt: 'READ',
    triageGroupName: null,
    proxySenderName: null,
  },
];
const initialState = {
  sm: {
    folders: { folder: inbox },
    messages: [],
  },
};

const setup = (folder, sortOrder, path, messages = mockMessages) => {
  return renderWithStoreAndRouter(
    <MessageList
      messages={messages}
      folder={folder}
      keyword="test"
      sortOrder={sortOrder}
    />,
    {
      path,
      initialState,
      reducers,
    },
  );
};
describe('Message List component', () => {
  it('renders without errors', () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    expect(screen);
  });

  it('sorting list is present', () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    const dropDownListItem = screen.getByText('Newest to oldest');
    expect(dropDownListItem).to.exist;
  });
  it('sorting list doesnt display recipient sorting option when the url path is "/" only displays sender sorting options', () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Sender’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient when the url path is "/drafts"', () => {
    const screen = setup(
      drafts,
      threadSortingOptions.DRAFT_DATE_DESCENDING.value,
      Paths.DRAFTS,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient when the url path is "/sent"', () => {
    const screen = setup(
      sent,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.SENT,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });
  it('sorting list doesnt display sender sorting option only recipient on a custom folder', () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).to.exist;
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
  });
});
