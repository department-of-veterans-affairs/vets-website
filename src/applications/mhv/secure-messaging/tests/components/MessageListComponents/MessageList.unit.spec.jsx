import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import reducers from '../../../reducers';
import {
  inbox,
  sent,
  drafts,
  customFolder,
} from '../../fixtures/folder-inbox-response.json';
import MessageList from '../../../components/MessageList/MessageList';
import { Paths, threadSortingOptions } from '../../../util/constants';
import { selectVaSelect } from '../../../util/testUtils';
import searchMessages from '../../fixtures/props/search-result-messages.json';

const mockMessages = [
  {
    messageId: 2817226,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: true,
    sentDate: '2023-05-17T16:11:26.000Z',
    senderId: 2708253,
    senderName: 'C TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'C-MHVDAYMARK, MARK ',
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
    senderName: 'Z TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'Z-MHVDAYMARK, MARK ',
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
    senderName: 'A TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'A-MHVDAYMARK, MARK ',
    readReceipt: 'READ',
    triageGroupName: null,
    proxySenderName: null,
  },
  {
    messageId: 2817239,
    category: 'TEST_RESULTS',
    subject: 'test',
    body: null,
    attachment: true,
    sentDate: '2023-05-17T07:10:24.000Z',
    senderId: 2708253,
    senderName: 'A TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'A-MHVDAYMARK, MARK ',
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
    senderName: 'B TESTER, TEST ',
    recipientId: 251391,
    recipientName: 'B-MHVDAYMARK, MARK ',
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
      page={1}
    />,
    {
      path,
      initialState,
      reducers,
    },
  );
};

afterEach(() => {
  cleanup();
});

describe('Message List component', () => {
  it('renders without errors', async () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    expect(screen);
  });

  it('sorting list is present', async () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    const dropDownListItem = screen.getByText('Newest to oldest');
    expect(dropDownListItem).to.exist;
  });

  it('sorting list doesnt display recipient sorting option when the url path is "/" only displays sender sorting options', async () => {
    const screen = setup(
      inbox,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.INBOX,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Sender’s name')).to.exist;
  });

  it('sorting list doesnt display sender sorting option only recipient when the url path is "/drafts"', async () => {
    const screen = setup(
      drafts,
      threadSortingOptions.DRAFT_DATE_DESCENDING.value,
      Paths.DRAFTS,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });

  it('sorting list doesnt display sender sorting option only recipient when the url path is "/sent"', async () => {
    const screen = setup(
      sent,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      Paths.SENT,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).not.to.exist;
    expect(screen.getByText('A to Z - Recipient’s name')).to.exist;
  });

  it('sorting list doesnt display sender sorting option only recipient on a custom folder', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    fireEvent.click(screen.getByText('Newest to oldest'));
    expect(screen.queryByText('A to Z - Sender’s name')).to.exist;
    expect(screen.queryByText('A to Z - Recipient’s name')).not.to.exist;
  });

  it('sorts messages in descending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENT_DATE_DESCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRenderedDesc = screen.getAllByTestId('message-list-item');
    const firstMessage = mockMessages.sort((a, b) => {
      // sort by sentDate descending
      return b.sentDate > a.sentDate ? 1 : -1;
    })[0];
    expect(messagesRenderedDesc[0].textContent).to.contain(
      firstMessage.senderName,
    );
  });

  it('sorts messages in ascending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENT_DATE_ASCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRenderedAsc = screen.getAllByTestId('message-list-item');
    const firstMessageAsc = mockMessages.sort((a, b) => {
      return b.sentDate < a.sentDate ? 1 : -1;
    })[0];
    expect(messagesRenderedAsc[0].textContent).to.contain(
      firstMessageAsc.senderName,
    );
  });

  it('sorts messages in SENDER ALPHA ascending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENDER_ALPHA_ASCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRendered = screen.getAllByTestId('message-list-item');
    const firstMessage = mockMessages.sort((a, b) => {
      return a.senderName.toLowerCase() > b.senderName.toLowerCase() ? 1 : -1;
    })[0];
    expect(messagesRendered[0].textContent).to.contain(firstMessage.senderName);
  });

  it('sorts messages in SENDER ALPHA descending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.SENDER_ALPHA_DESCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRendered = screen.getAllByTestId('message-list-item');
    const firstMessage = mockMessages.sort((a, b) => {
      return a.senderName.toLowerCase() < b.senderName.toLowerCase() ? 1 : -1;
    })[0];
    expect(messagesRendered[0].textContent).to.contain(firstMessage.senderName);
  });

  it('sorts messages in RECIPIENT ALPHA descending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.value,
      `${Paths.FOLDERS}12345`,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRendered = screen.getAllByTestId('message-list-item');
    const firstMessage = mockMessages.sort((a, b) => {
      if (a.recipientName === b.recipientName) {
        return b.sentDate > a.sentDate ? 1 : -1;
      }
      return a.recipientName.toLowerCase() < b.recipientName.toLowerCase()
        ? 1
        : -1;
    })[0];
    expect(messagesRendered[0].textContent).to.contain(firstMessage.senderName);
  });

  it('sorts messages in RECIPIENT ALPHA ascending order', async () => {
    const screen = setup(
      customFolder,
      threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value,
      `${Paths.FOLDERS}12345`,
    );

    selectVaSelect(
      screen.container,
      threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value,
    );
    fireEvent.click(document.querySelector('va-button[text="Sort"]'));
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const messagesRendered = await screen.getAllByTestId('message-list-item');
    const firstMessage = mockMessages.sort((a, b) => {
      return a.recipientName.toLowerCase() > b.recipientName.toLowerCase()
        ? 1
        : -1;
    })[0];
    expect(messagesRendered[0].textContent).to.contain(firstMessage.senderName);
  });

  it('responds to pagination changes', async () => {
    const screen = await setup(
      customFolder,
      threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value,
      `${Paths.FOLDERS}12345`,
      searchMessages,
    );
    await waitFor(() => {
      screen.getAllByTestId('message-list-item');
    });
    const pagination = await $('va-pagination', screen.container);
    const event = new CustomEvent('pageSelect', {
      bubbles: true,
      detail: { page: 2 },
    });
    pagination.dispatchEvent(event);
    const firstMessageLink = document.querySelectorAll(
      'a.message-subject-link',
    )[0];
    expect(firstMessageLink).to.have.attribute(
      'href',
      `/thread/${searchMessages[10].messageId}`,
    );
  });
});
