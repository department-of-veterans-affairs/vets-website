import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
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
    senderName: 'Tesst, Test TEST, TTESTer',
    sentDate: '2020-01-01T00:00:00.000Z',
    subject: 'testtestteest ttestt',
    readReceipt: 'READ',
    recipientName: 'BNP!!! FOO DG_SLC4',
    attachment: false,
    messageId: '1234567',
    keyword: 'test',
    category: 'General',
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      path: `/search/results`,
    });
    expect(screen);
  });

  it('should have contents within main div', () => {
    const screen = renderWithStoreAndRouter(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      path: `/search/results`,
    });
    const messageListItemMainDiv = screen.getByTestId('message-list-item');
    expect(messageListItemMainDiv).not.to.be.empty;
  });

  it('should highlight a keyword when one is passed', async () => {
    const screen = renderWithStoreAndRouter(<MessageListItem {...props} />, {
      initialState,
      reducers: reducer,
      path: `/search/results`,
    });

    const highlightedText = await screen.getAllByTestId('highlighted-text');
    expect(highlightedText.length).to.equal(6);
  });
});
