import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import ThreadListItem from '../../../components/ThreadList/ThreadListItem';
import { dateFormat } from '../../../util/helpers';
import { Paths } from '../../../util/constants';

describe('Thread List component', () => {
  const initialState = {
    sm: {
      folders: {},
      threads: [],
    },
  };

  const keyword = '';
  let screen;

  const activeFolder = {
    folderId: 0,
    name: 'Inbox',
    count: 260,
    unreadCount: 67,
    systemFolder: true,
  };

  const options = {
    unsentDrafts: true,
    unreadMessages: true,
    recipientName: 'FREEMAN',
    senderName: 'SENDERNAMETEST',
    sentDate: '2023-02-14T16:03:32.000Z',
    path: '/inbox',
  };

  const setup = props => {
    const {
      unsentDrafts,
      unreadMessages,
      recipientName,
      sentDate,
      senderName,
      path,
    } = props;

    const thread = {
      threadId: 2609011,
      folderId: 690824,
      messageId: 2609175,
      threadPageSize: 13,
      messageCount: 3,
      category: 'OTHERS',
      subject: 'test subject',
      triageGroupName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29',
      sentDate,
      draftDate: null,
      senderId: 257555,
      senderName,
      recipientName,
      recipientId: 523757,
      proxySenderName: null,
      hasAttachment: true,
      unsentDrafts,
      unreadMessages,
    };

    return renderWithStoreAndRouter(
      <ThreadListItem
        keyword={keyword}
        activeFolder={activeFolder}
        thread={thread}
      />,
      {
        path,
        state: initialState,
        reducers,
      },
    );
  };

  it('renders without errors', () => {
    screen = setup(options);
    expect(screen);
  });

  it('subject value is rendered', async () => {
    screen = setup(options);
    const subject = await screen.getByText('test subject', { exact: false });
    expect(subject).to.exist;
  });

  it('renders draft text if unsentDraft is true', async () => {
    screen = setup({ ...options, unsentDrafts: true });

    const threadItem = await screen.getByText('(Draft)');
    expect(threadItem).to.exist;
  });

  it('does not render "Draft" text if unsentDraft is false', async () => {
    screen = setup({ ...options, unsentDrafts: false });

    const threadItemDraftsText = await screen.queryByText('(Draft)');
    expect(threadItemDraftsText).to.not.exist;
  });

  it('sentDate is formatted correctly', async () => {
    screen = setup(options);

    const threadItemFormattedDate = await screen.getByText(
      dateFormat(options.sentDate, 'MMMM D, YYYY [at] h:mm a z'),
    );
    const threadItemUnformattedDate = await screen.queryByText(
      options.sentDate,
    );
    expect(threadItemFormattedDate).to.exist;
    expect(threadItemUnformattedDate).to.not.exist;
  });

  it('message icon is shown when there is an unread message in thread', async () => {
    screen = setup(options);

    const threadListUnreadIcon = await screen.getByTestId(
      'thread-list-unread-icon',
    );
    expect(threadListUnreadIcon).to.exist;
  });

  it('message icon is not shown when there are no unread messages in thread', async () => {
    screen = setup({ ...options, unreadMessages: false });

    const threadListUnreadIcon = await screen.queryByTestId(
      'thread-list-unread-icon',
    );
    expect(threadListUnreadIcon).to.not.exist;
  });

  it('when on sent messages, dont show sender name only recepient name', async () => {
    screen = setup({ ...options, path: Paths.SENT });
    const senderName = await screen.queryByText('SENDERNAMETEST');
    const recipientName = await screen.getByText('FREEMAN', { exact: false });

    expect(senderName).to.not.exist;
    expect(recipientName).to.exist;
  });
});
