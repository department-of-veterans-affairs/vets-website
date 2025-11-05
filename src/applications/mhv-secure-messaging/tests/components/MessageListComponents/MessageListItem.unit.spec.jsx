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

    const screen = renderWithStoreAndRouter(
      <MessageListItem {...customProps} />,
      {
        customState,
        reducers: reducer,
        path: `/sent`,
      },
    );

    const unreadIcon = screen.queryByTestId('unread-message-icon');
    expect(unreadIcon).to.not.exist;

    const fromText = screen.getByText('From:');
    expect(fromText.parentNode.className).to.not.contain(
      'vads-u-font-weight--bold',
    );
  });

  describe('Datadog RUM action names', () => {
    it('should have data-dd-action-name on message subject link', () => {
      const customProps = {
        ...props,
        message: {
          ...props.message,
          category: 'OTHER',
        },
      };

      const screen = renderWithStoreAndRouter(
        <MessageListItem {...customProps} />,
        {
          initialState,
          reducers: reducer,
          path: `/search/results`,
        },
      );

      const subjectLink = screen.getByRole('link');
      expect(subjectLink.getAttribute('data-dd-action-name')).to.equal(
        'Link to Message Subject Details',
      );
    });

    it('should have data-dd-action-name on recipient info in sent folder', () => {
      const sent = {
        folderId: -1,
        name: 'Sent',
        count: 49,
        unreadCount: 35,
        systemFolder: true,
      };

      const customProps = {
        ...props,
        activeFolder: sent,
        message: {
          ...props.message,
          category: 'OTHER',
        },
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

      const screen = renderWithStoreAndRouter(
        <MessageListItem {...customProps} />,
        {
          customState,
          reducers: reducer,
          path: `/sent/`,
        },
      );

      const recipientDiv = screen.getByText((content, element) => {
        return (
          element.getAttribute('data-dd-action-name') ===
          'Message List Item Recipient and Sender Info'
        );
      });
      expect(recipientDiv).to.exist;
      expect(recipientDiv.textContent).to.include('To:');
    });

    it('should have data-dd-action-name on sender info in sent folder', () => {
      const sent = {
        folderId: -1,
        name: 'Sent',
        count: 49,
        unreadCount: 35,
        systemFolder: true,
      };

      const customProps = {
        ...props,
        activeFolder: sent,
        message: {
          ...props.message,
          category: 'OTHER',
        },
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

      const screen = renderWithStoreAndRouter(
        <MessageListItem {...customProps} />,
        {
          customState,
          reducers: reducer,
          path: `/sent/`,
        },
      );

      const senderDiv = screen.getByText((content, element) => {
        return (
          element.getAttribute('data-dd-action-name') ===
          'Message List Item Sender Info'
        );
      });
      expect(senderDiv).to.exist;
      expect(senderDiv.textContent).to.include('From:');
    });

    it('should have data-dd-action-name on recipient info in drafts folder', () => {
      const drafts = {
        folderId: -2,
        name: 'Drafts',
        count: 5,
        unreadCount: 0,
        systemFolder: true,
      };

      const customProps = {
        ...props,
        activeFolder: drafts,
        message: {
          ...props.message,
          category: 'OTHER',
        },
      };

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          search: {
            ...initialState.sm.search,
            folder: drafts,
          },
        },
      };

      const screen = renderWithStoreAndRouter(
        <MessageListItem {...customProps} />,
        {
          customState,
          reducers: reducer,
          path: `/drafts/`,
        },
      );

      const recipientDiv = screen.getByText((content, element) => {
        return (
          element.getAttribute('data-dd-action-name') ===
          'Message List Item Recipient and Sender Info'
        );
      });
      expect(recipientDiv).to.exist;
      expect(recipientDiv.textContent).to.include('To:');
    });

    it('should show draft label in drafts folder', () => {
      const drafts = {
        folderId: -2,
        name: 'Drafts',
        count: 5,
        unreadCount: 0,
        systemFolder: true,
      };

      const customProps = {
        ...props,
        activeFolder: drafts,
        message: {
          ...props.message,
          category: 'OTHER',
        },
      };

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          search: {
            ...initialState.sm.search,
            folder: drafts,
          },
        },
      };

      const screen = renderWithStoreAndRouter(
        <MessageListItem {...customProps} />,
        {
          customState,
          reducers: reducer,
          path: `/drafts/`,
        },
      );

      const draftLabel = screen.getByText('(Draft)');
      expect(draftLabel).to.exist;
    });
  });
});
