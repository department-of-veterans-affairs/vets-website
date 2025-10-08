import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Breadcrumbs, Paths } from '../../util/constants';
import manifest from '../../manifest.json';

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
    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    expect(backButton).to.have.attribute('text', 'Back');
  });

  it('on Drafts page, renders Back button with correct href', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: '/inbox/',
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Breadcrumbs.DRAFTS.href,
    });

    const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
    const expectedHref = `${manifest.rootUrl}${
      customState.sm.breadcrumbs.previousUrl
    }`;
    expect(breadcrumb).to.have.attribute('href', expectedHref);
    expect(breadcrumb).to.have.attribute('text', 'Back');
  });

  it('on Compose renders as back link only', async () => {
    const initialStateWithPreviousUrl = {
      ...initialState,
      sm: {
        ...initialState.sm,
        breadcrumbs: {
          previousUrl: Paths.INBOX,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: initialStateWithPreviousUrl,
      reducers: reducer,
      path: Breadcrumbs.COMPOSE.href,
    });

    const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
    const expectedHref = `${manifest.rootUrl}${
      initialStateWithPreviousUrl.sm.breadcrumbs.previousUrl
    }`;
    expect(breadcrumb).to.have.attribute('href', expectedHref);
    expect(breadcrumb).to.have.attribute('text', 'Back');
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
    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    expect(backButton).to.have.attribute('text', 'Back');
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
    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    expect(backButton).to.have.attribute('text', 'Back');
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
    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    expect(backButton).to.have.attribute('text', 'Back');
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

    fireEvent.click(screen.getByTestId('sm-breadcrumbs-back'));
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
      path: `${Paths.MESSAGE_THREAD}/123123`,
    });

    fireEvent.click(screen.getByTestId('sm-breadcrumbs-back'));

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

    fireEvent.click(screen.getByTestId('sm-breadcrumbs-back'));

    expect(screen.history.location.pathname).to.equal(
      `${Paths.MESSAGE_THREAD}123123/`,
    );
  });

  it('navigates back correctly from CARE_TEAM_HELP to Select care team (previousUrl)', async () => {
    const previous = `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: previous,
        },
      },
    };

    const { container, history } = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.CARE_TEAM_HELP,
    });

    await waitFor(() => {
      expect(container.querySelector('va-link')).to.have.attribute(
        'text',
        'Back',
      );
    });

    fireEvent.click(container.querySelector('va-link'));

    await waitFor(() => {
      expect(history.location.pathname).to.equal(previous);
    });
  });

  it('navigates back to recent care teams from select care team', async () => {
    const previous = Paths.RECENT_CARE_TEAMS;
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: previous,
        },
        recipients: {
          recentRecipients: [{ id: '123', name: 'Some Care Team' }],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    expect(backButton).to.have.attribute('text', 'Back');

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(previous);
    });
  });
});
