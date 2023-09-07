import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import * as Constants from '../../util/constants';

let initialState;
describe('Breadcrumbs', () => {
  initialState = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox },
    },
  };

  it('finds parent breadcrumb that displays the label "Back to messages"', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `${Constants.Breadcrumbs.INBOX.path}`,
    });
    const breadcrumb = await screen.findByText('Back to messages', {
      exact: true,
    });
    expect(breadcrumb);
  });

  it('on Message Details renders without errors', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `/thread/${messageResponse.messageId}`,
    });
    expect(await screen.findByText('Back to inbox', { exact: true }));
  });

  it('on Compose renders without errors', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.COMPOSE.path,
    });
    expect(
      await screen.findByText('Back to inbox', {
        exact: true,
      }),
    );
  });

  it('on Drafts Folder renders without errors', async () => {
    const initialStateDrafts = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: {
          folder: {
            folderId: -2,
            name: 'Drafts',
            count: 49,
            unreadCount: 49,
            systemFolder: true,
          },
        },
        breadcrumbs: {
          list: [],
          location: {},
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateDrafts,
      reducers: reducer,
      path: '/thread/7155731',
    });
    expect(
      await screen.findByText('Back to drafts', {
        exact: true,
      }),
    );
  });

  it('on Sent Folder renders without errors', async () => {
    const initialStateSent = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: {
          folder: {
            folderId: -1,
            name: 'Sent',
            count: 20,
            unreadCount: 0,
            systemFolder: true,
          },
        },
        breadcrumbs: {
          list: [],
          location: {},
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateSent,
      reducers: reducer,
      path: '/thread/7155731',
    });
    expect(
      await screen.findByText('Back to sent', {
        exact: true,
      }),
    );
  });

  it('on Trash Folder renders without errors', async () => {
    const initialStateTrash = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: {
          folder: {
            folderId: -3,
            name: 'Trash',
            count: 0,
            unreadCount: 0,
            systemFolder: true,
          },
        },
        breadcrumbs: {
          list: [],
          location: {},
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateTrash,
      reducers: reducer,
      path: `/thread/7155731`,
    });
    expect(
      await screen.findByText('Back to trash', {
        exact: true,
      }),
    );
  });
});
