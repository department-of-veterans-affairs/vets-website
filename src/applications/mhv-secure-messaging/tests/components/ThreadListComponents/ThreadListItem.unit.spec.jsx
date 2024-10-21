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
    featureToggles: {},
    keyword: '',
  };

  const testThread = {
    threadId: 2609011,
    folderId: 690824,
    messageId: 2609175,
    threadPageSize: 13,
    messageCount: 3,
    category: 'OTHERS',
    subject: 'test subject',
    triageGroupName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29',
    draftDate: null,
    senderId: 257555,
    recipientId: 523757,
    proxySenderName: null,
    hasAttachment: true,
  };

  const setup = (props, partialThread) => {
    const {
      unsentDrafts,
      unreadMessages,
      recipientName,
      sentDate,
      senderName,
      path,
      featureToggles,
      keyword,
    } = props;

    const thread = {
      ...partialThread,
      unsentDrafts,
      unreadMessages,
      recipientName,
      sentDate,
      senderName,
    };

    return renderWithStoreAndRouter(
      <ThreadListItem
        keyword={keyword}
        activeFolder={activeFolder}
        thread={thread}
      />,
      {
        path,
        initialState: { ...initialState, featureToggles },
        reducers,
      },
    );
  };

  it('renders without errors', () => {
    screen = setup(options, testThread);
    expect(screen);
  });

  it('subject value is rendered', async () => {
    screen = setup(options, testThread);
    const subject = await screen.getByText('test subject', { exact: false });
    expect(subject).to.exist;
  });

  it('renders draft text if unsentDraft is true', async () => {
    screen = setup({ ...options, unsentDrafts: true }, testThread);

    const threadItem = await screen.getByText('[Draft]');
    expect(threadItem).to.exist;
  });

  it('does not render "Draft" text if unsentDraft is false', async () => {
    screen = setup({ ...options, unsentDrafts: false }, testThread);

    const threadItemDraftsText = await screen.queryByText('[Draft]');
    expect(threadItemDraftsText).to.not.exist;
  });

  it('sentDate is formatted correctly', async () => {
    screen = setup(options, testThread);

    const threadItemFormattedDate = await screen.getByText(
      dateFormat(options.sentDate, 'MMMM D, YYYY'),
    );
    const threadItemUnformattedDate = await screen.queryByText(
      options.sentDate,
    );
    expect(threadItemFormattedDate).to.exist;
    expect(threadItemUnformattedDate).to.not.exist;
  });

  it('message icon is shown when there is an unread message in thread', async () => {
    screen = setup(options, testThread);

    const threadListUnreadIcon = await screen.getByTestId(
      'thread-list-unread-icon',
    );
    expect(threadListUnreadIcon).to.exist;
  });

  it('message icon is not shown when there are no unread messages in thread', async () => {
    screen = setup({ ...options, unreadMessages: false }, testThread);

    const threadListUnreadIcon = await screen.queryByTestId(
      'thread-list-unread-icon',
    );
    expect(threadListUnreadIcon).to.not.exist;
  });

  it('when on sent messages, dont show sender name only recepient name', async () => {
    screen = setup({ ...options, path: Paths.SENT }, testThread);
    const senderName = await screen.queryByText('SENDERNAMETEST');
    const recipientName = await screen.getByText('FREEMAN', { exact: false });

    expect(senderName).to.not.exist;
    expect(recipientName).to.exist;
  });

  it('formats thread list item without triage group name', async () => {
    screen = setup(
      {
        ...options,
      },
      testThread,
    );
    const triageGroup = screen.queryByText(
      'SENDERNAMETEST (Team: EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29)Unread message',
    );
    expect(triageGroup).to.not.exist;
    const msgQty = screen.getByTestId('message-count');
    expect(msgQty.parentNode.textContent).to.equal('3 messages, [Draft]');
  });

  it('displays 1 message if messageCount = 1', async () => {
    screen = setup(
      {
        ...options,
      },
      { ...testThread, messageCount: 1 },
    );
    const triageGroup = screen.queryByText(
      'SENDERNAMETEST (Team: EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29)Unread message',
    );
    expect(triageGroup).to.not.exist;
    const msgQty = screen.getByTestId('message-count');
    expect(msgQty.parentNode.textContent).to.equal('1 message, [Draft]');
  });

  it('displays 1 message if messageCount = 1', async () => {
    screen = setup(
      {
        ...options,
        keyword: 'test',
      },
      { ...testThread, messageCount: 1 },
    );
    const triageGroup = screen.queryByText(
      'SENDERNAMETEST (Team: EXTRA_LONG_CHARACTER_TRIAGE_GROUP_369258@#%_DAYT29)Unread message',
    );
    expect(triageGroup).to.not.exist;
    const msgQty = screen.getByTestId('message-count');
    expect(msgQty.parentNode.textContent).to.equal('1 message, [Draft]');
    expect(screen.getByText('test')).to.have.attribute(
      'class',
      'keyword-highlight',
    );
  });

  it('displays recipient if in sent folder', async () => {
    screen = setup(
      {
        ...options,
        path: Paths.SENT,
        unreadMessages: false,
      },
      { ...testThread, hasAttachment: false },
    );
    expect(screen.getByText('To: FREEMAN')).to.exist;
  });

  it('does not display message count in message-info-row if inside drafts folder', async () => {
    screen = setup(
      {
        ...options,
        path: Paths.DRAFTS,
      },
      { ...testThread, draftDate: '2023-06-15T11:04:18.000Z' },
    );
    const messageInfoRow = screen.getByTestId('message-info-row');
    expect(messageInfoRow.textContent).to.equal('[Draft]');
    expect(screen.getByText('June 15, 2023')).to.exist;
  });
});
