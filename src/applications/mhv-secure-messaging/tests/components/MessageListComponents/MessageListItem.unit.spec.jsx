import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
// import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import inbox from '../../fixtures/folder-inbox-metadata.json';
import searchResults from '../../fixtures/search-response.json';
import MessageListItem from '../../../components/MessageList/MessageListItem';

describe('MessageListItem component', () => {
  const initialState = {
    sm: {
      search: {
        searchResults,
        awaitingResults: false,
        keyword: 'test',
        folder: inbox,
      },
    },
  };

  const props = {
    activeFolder: inbox,
    message: {
      senderName: 'Tesst, Test TEST, TTESTer',
      sentDate: '2020-01-01T00:00:00.000Z',
      subject: 'testtestteest ttestt',
      readReceipt: 'READ',
      recipientName: 'BNP!!! FOO DG_SLC4',
      attachment: false,
      messageId: '1234567',
      category: 'General',
    },
    keyword: 'test',
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouterV6(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      initialEntries: ['/search/results'],
    });
    expect(screen);
  });

  it('should have contents within main div', () => {
    const screen = renderWithStoreAndRouterV6(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      initialEntries: ['/search/results'],
    });
    const messageListItemMainDiv = screen.getByTestId('message-list-item');
    expect(messageListItemMainDiv).not.to.be.empty;
  });

  it('should highlight a keyword when one is passed', async () => {
    const screen = renderWithStoreAndRouterV6(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      initialEntries: ['/search/results'],
    });

    const highlightedText = await screen.getAllByTestId('highlighted-text');
    expect(highlightedText.length).to.equal(6);
  });

  it('does not style unread messages in sent folder', async () => {
    const sent = {
      folderId: -1,
      name: 'Sent',
      count: 49,
      unreadCount: 35,
      systemFolder: true,
    };

    const customProps = {
      ...props,
      readReceipt: 'UNREAD',
      activeFolder: sent,
    };

    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        search: {
          ...initialState.sm.search,
          folder: sent,
        },
      },
    };

    const screen = renderWithStoreAndRouterV6(
      <MessageListItem {...customProps} />,
      {
        initialState: customState,
        reducers: reducer,
        initialEntries: ['/sent'],
      },
    );

    const unreadIcon = screen.queryByTestId('unread-message-icon');
    expect(unreadIcon).to.not.exist;

    const fromText = screen.getByText('From:');
    expect(fromText.parentNode.className).to.not.contain(
      'vads-u-font-weight--bold',
    );
  });
});
