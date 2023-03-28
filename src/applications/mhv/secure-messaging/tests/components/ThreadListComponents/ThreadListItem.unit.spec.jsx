import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import ThreadListItem from '../../../components/ThreadList/ThreadListItem';

describe('Thread List component', () => {
  const initialState = {
    sm: {
      folders: {},
      threads: [],
    },
  };

  const thread = {
    threadId: 2609011,
    folderId: 690824,
    messageId: 2609175,
    threadPageSize: 13,
    messageCount: 3,
    category: 'OTHERS',
    subject: 'test subject',
    triageGroupName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29',
    sentDate: '2023-01-10T17:18:18.000Z',
    draftDate: null,
    senderId: 257555,
    senderName: 'ISLAM, MOHAMMAD  RAFIQ',
    recipientName: 'FREEMAN, MELVIN  V',
    recipientId: 523757,
    proxySenderName: null,
    hasAttachment: true,
    unsentDrafts: true,
    unreadMessages: false,
  };
  const activeFolder = {
    folderId: 0,
    name: 'Inbox',
    count: 260,
    unreadCount: 67,
    systemFolder: true,
  };
  const keyword = '';

  let screen;
  const setup = () => {
    return renderWithStoreAndRouter(
      <ThreadListItem
        keyword={keyword}
        activeFolder={activeFolder}
        thread={thread}
      />,
      {
        path: `/inbox`,
        state: initialState,
        reducers,
      },
    );
  };
  it('renders without errors', () => {
    screen = setup();
    expect(screen);
  });
  it('renders subject', async () => {
    screen = setup();

    const threadItem = await screen.getByText('(Drafts)');
    expect(threadItem).to.exist;
  });
});
