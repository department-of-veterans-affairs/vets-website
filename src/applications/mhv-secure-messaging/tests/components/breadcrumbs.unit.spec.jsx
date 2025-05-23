import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Breadcrumbs, Paths } from '../../util/constants';

let initialState;
describe('Breadcrumbs', () => {
  const defaultCrumbs = [
    {
      href: '/',
      label: 'VA.gov',
    },
    {
      href: Breadcrumbs.MYHEALTH.href,
      label: Breadcrumbs.MYHEALTH.label,
    },
    {
      href: Breadcrumbs.MESSAGES.href,
      label: Breadcrumbs.MESSAGES.label,
      isRouterLink: true,
    },
  ];

  initialState = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox },
    },
  };
  afterEach(() => cleanup());

  it('on Message Details renders without errors', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `/thread/${messageResponse.messageId}`,
    });
    expect(await screen.findByText('Back', { exact: true }));
  });

  it('on Drafts page, renders Drafts as last link in breadcrumb list', async () => {
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
          crumbsList: [...defaultCrumbs, Breadcrumbs.DRAFTS],
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialStateDrafts,
      reducers: reducer,
      path: Breadcrumbs.DRAFTS.href,
    });

    const breadcrumb = await screen.findByText('Back', { exact: true });
    expect(breadcrumb).to.have.attribute('href', '/drafts/');
  });

  it('on Compose renders as back link only', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Breadcrumbs.COMPOSE.href,
    });

    const breadcrumb = await screen.findByText('Back', { exact: true });
    expect(breadcrumb).to.have.attribute('href', '/new-message/');
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
          crumbsList: [...defaultCrumbs, Breadcrumbs.DRAFTS],
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateDrafts,
      reducers: reducer,
      path: '/thread/7155731',
    });
    expect(
      await screen.findByText('Back', {
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
          crumbsList: [...defaultCrumbs, Breadcrumbs.SENT],
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateSent,
      reducers: reducer,
      path: '/thread/7155731',
    });
    expect(
      await screen.findByText('Back', {
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
          crumbsList: [...defaultCrumbs, Breadcrumbs.TRASH],
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateTrash,
      reducers: reducer,
      path: `/thread/7155731`,
    });
    expect(
      await screen.findByText('Back', {
        exact: true,
      }),
    );
  });

  it('should navigate to the INBOX if the previousUrl is contact list', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: Paths.CONTACT_LIST,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });

    fireEvent.click(screen.getByText('Back'));
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.INBOX);
    });
  });

  it('should navigate to the previousUrl if the previousUrl is not contact list', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: Paths.DRAFTS,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });

    fireEvent.click(screen.getByText('Back'));

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.DRAFTS);
    });
  });

  it('should redirect back to draft message if an active draft is present', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        breadcrumbs: {
          previousUrl: Paths.COMPOSE,
        },
        threadDetails: {
          drafts: [{ messageId: '123123' }],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.CONTACT_LIST,
    });

    fireEvent.click(screen.getByText('Back'));

    expect(screen.history.location.pathname).to.equal(
      `${Paths.MESSAGE_THREAD}123123/`,
    );
  });
});
