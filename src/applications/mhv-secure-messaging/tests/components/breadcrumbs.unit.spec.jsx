import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { waitFor } from '@testing-library/react';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Breadcrumbs } from '../../util/constants';

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

  it('renders breadcrumb that includes "My HealtheVet" on Landing Page', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `/`,
    });

    const breadcrumbs = $('va-breadcrumbs', screen.container);
    const { breadcrumbList } = breadcrumbs;

    // Validate the props
    expect(breadcrumbList).to.deep.equal(defaultCrumbs);
  });

  it('on Message Details renders without errors', async () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `/thread/${messageResponse.messageId}`,
    });
    expect(await screen.findByText('Back to inbox', { exact: true }));
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

    const breadcrumbs = $('va-breadcrumbs', screen.container);
    const { breadcrumbList } = breadcrumbs;

    // Validate the props
    await waitFor(() =>
      expect(breadcrumbList[breadcrumbList.length - 1]).to.deep.equal(
        Breadcrumbs.DRAFTS,
      ),
    );
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
      await screen.findByText('Back to trash', {
        exact: true,
      }),
    );
  });
});
