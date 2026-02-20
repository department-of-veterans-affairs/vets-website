import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Breadcrumbs, Paths } from '../../util/constants';
import manifest from '../../manifest.json';
import { assertBackBreadcrumbLabel } from '../util/helpers.breadcrumbs';

let initialState;
describe('Breadcrumbs', () => {
  const getBackLink = container =>
    container.querySelector('[data-testid="sm-breadcrumbs-back"]');

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

    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
  });

  it('on Drafts page, renders Back button with correct href to Folders', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          list: {
            href: Paths.FOLDERS,
            label: 'Folders',
            isRouterLink: true,
          },
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
    const expectedHref = `${manifest.rootUrl}${Paths.FOLDERS}`;
    expect(breadcrumb).to.have.attribute('href', expectedHref);
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
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
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
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
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
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
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
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
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });
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
      const backLink = getBackLink(container);
      assertBackBreadcrumbLabel(backLink);
    });

    fireEvent.click(getBackLink(container));

    await waitFor(() => {
      expect(history.location.pathname).to.equal(previous);
    });
  });

  it('navigates back to recent care teams from select care team when feature flag is enabled', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: Paths.RECENT_CARE_TEAMS,
        },
        recipients: {
          recentRecipients: [{ id: '123', name: 'Some Care Team' }],
        },
      },
      featureToggles: {
        loading: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: true,
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(
        Paths.RECENT_CARE_TEAMS,
      );
    });
  });

  it('navigates back to compose interstitial from select care team when feature flag is disabled', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          previousUrl: Paths.INBOX,
        },
        recipients: {
          recentRecipients: [{ id: '123', name: 'Some Care Team' }],
        },
      },
      featureToggles: {
        loading: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: false,
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    await waitFor(() => {
      assertBackBreadcrumbLabel(screen.container);
    });

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.COMPOSE);
    });
  });

  describe('Custom folder breadcrumb setup', () => {
    it('should set breadcrumbs correctly when viewing a custom folder', async () => {
      const customFolderName = 'My Custom Folder';
      const customFolderId = 123;
      const customState = {
        sm: {
          folders: {
            folder: {
              folderId: customFolderId,
              name: customFolderName,
            },
            folderList: [
              { id: customFolderId, name: customFolderName },
              { id: 456, name: 'Another Folder' },
            ],
          },
          breadcrumbs: {
            previousUrl: Paths.FOLDERS,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.FOLDERS}${customFolderId}/`,
      });

      const backButton = await screen.findByTestId('sm-breadcrumbs-back');
      expect(backButton).to.have.attribute(
        'href',
        `${manifest.rootUrl}${Paths.FOLDERS}`,
      );
      await waitFor(() => {
        assertBackBreadcrumbLabel(screen.container);
      });
    });
  });

  describe('Prescription Renewal Flow Breadcrumbs', () => {
    const rxRedirectPath = 'https://example.va.gov/my-health/medications';

    beforeEach(() => {
      sessionStorage.clear();
    });

    afterEach(() => {
      sessionStorage.clear();
      cleanup();
    });

    it('should use urlRedirectPath for Back link on interstitial page when coming from inbox', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.INBOX,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
      await waitFor(() => {
        assertBackBreadcrumbLabel(screen.container);
      });
    });

    it('should use urlRedirectPath for Back link on select care team page when coming from inbox', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.COMPOSE,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
      await waitFor(() => {
        assertBackBreadcrumbLabel(screen.container);
      });
    });

    it('should use urlRedirectPath for Back link on recent care teams page when coming from inbox', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.COMPOSE,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
          recipients: {
            recentRecipients: [{ id: 1, name: 'Test Team' }],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.RECENT_CARE_TEAMS,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
      await waitFor(() => {
        assertBackBreadcrumbLabel(screen.container);
      });
    });

    it('should navigate to urlRedirectPath when back button is clicked on interstitial page', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.INBOX,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
      await waitFor(() => {
        assertBackBreadcrumbLabel(screen.container);
      });
    });

    it('should NOT use urlRedirectPath when composeEntryUrl is not inbox', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.SENT);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.SENT,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      const expectedHref = `${manifest.rootUrl}${Paths.SENT}`;
      expect(breadcrumb).to.have.attribute('href', expectedHref);
      expect(breadcrumb).to.not.have.attribute('href', rxRedirectPath);
    });

    it('should NOT use urlRedirectPath when urlRedirectPath is not present', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.INBOX,
          },
          prescription: {
            redirectPath: null,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      const expectedHref = `${manifest.rootUrl}${Paths.INBOX}`;
      expect(breadcrumb).to.have.attribute('href', expectedHref);
    });

    it('should NOT use urlRedirectPath on select care team when recent recipients exist and user navigated from recent page', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.RECENT_CARE_TEAMS,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
          recipients: {
            recentRecipients: [
              { id: 1, name: 'Test Team 1' },
              { id: 2, name: 'Test Team 2' },
            ],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      const expectedHref = `${manifest.rootUrl}${Paths.RECENT_CARE_TEAMS}`;
      expect(breadcrumb).to.have.attribute('href', expectedHref);
      expect(breadcrumb).to.not.have.attribute('href', rxRedirectPath);
    });

    it('should use urlRedirectPath on select care team when no recent recipients', async () => {
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.COMPOSE,
          },
          prescription: {
            redirectPath: rxRedirectPath,
          },
          recipients: {
            recentRecipients: [],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
      });

      const breadcrumb = await screen.findByTestId('sm-breadcrumbs-back');
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
    });
  });
});
