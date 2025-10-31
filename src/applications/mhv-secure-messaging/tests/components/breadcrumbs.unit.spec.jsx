import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Breadcrumbs, DefaultFolders, Paths } from '../../util/constants';
import * as helpers from '../../util/helpers';
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
    // Drafts page should go back to Folders, not previousUrl
    const expectedHref = `${manifest.rootUrl}${Paths.FOLDERS}`;
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
          list: {
            href: Paths.SENT,
            label: 'Sent',
          },
          previousUrl: Paths.SENT,
        },
        folders: {
          folder: {
            folderId: DefaultFolders.SENT.id,
            name: 'Sent',
          },
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
      expect(screen.history.location.pathname).to.equal(Paths.SENT);
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
    expect(backButton).to.have.attribute('text', 'Back');

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
    expect(backButton).to.have.attribute('text', 'Back');

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.COMPOSE);
    });
  });

  it('should navigate to Sent folder when clicking back from Sent folder thread', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          list: {
            href: `${Paths.FOLDERS}${DefaultFolders.SENT.id}`,
            label: 'Sent',
          },
          previousUrl: Paths.INBOX,
        },
        folders: {
          folder: {
            folderId: DefaultFolders.SENT.id,
            name: 'Sent',
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: `${Paths.MESSAGE_THREAD}12345/`,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.SENT);
    });
  });

  it('should navigate to Inbox folder when clicking back from Inbox folder thread', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          list: {
            href: `${Paths.FOLDERS}${DefaultFolders.INBOX.id}`,
            label: 'Inbox',
          },
          previousUrl: Paths.SENT,
        },
        folders: {
          folder: {
            folderId: DefaultFolders.INBOX.id,
            name: 'Inbox',
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: `${Paths.MESSAGE_THREAD}67890/`,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.INBOX);
    });
  });

  it('should navigate to Folders page when clicking back from Drafts page', async () => {
    const customState = {
      sm: {
        breadcrumbs: {
          list: {
            href: Paths.FOLDERS,
            label: 'Folders',
            isRouterLink: true,
          },
          previousUrl: Paths.FOLDERS,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.DRAFTS,
    });

    const backButton = await screen.findByTestId('sm-breadcrumbs-back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(Paths.FOLDERS);
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
      expect(backButton).to.exist;
      expect(backButton).to.have.attribute('text', 'Back');
      expect(backButton).to.have.attribute(
        'href',
        `${manifest.rootUrl}${Paths.FOLDERS}`,
      );
    });
  });

  describe('Invalid folder ID redirects', () => {
    let navigateToFolderByFolderIdStub;

    beforeEach(() => {
      navigateToFolderByFolderIdStub = sinon.stub(
        helpers,
        'navigateToFolderByFolderId',
      );
    });

    afterEach(() => {
      navigateToFolderByFolderIdStub.restore();
    });

    it('should redirect when accessing system folder INBOX via /folders/0', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.FOLDERS,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.FOLDERS}0/`,
      });

      await waitFor(() => {
        expect(navigateToFolderByFolderIdStub.calledOnce).to.be.true;
        expect(navigateToFolderByFolderIdStub.firstCall.args[0]).to.equal('0');
      });
    });

    it('should redirect when accessing system folder SENT via /folders/-1', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.FOLDERS,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.FOLDERS}-1/`,
      });

      await waitFor(() => {
        expect(navigateToFolderByFolderIdStub.calledOnce).to.be.true;
        expect(navigateToFolderByFolderIdStub.firstCall.args[0]).to.equal('-1');
      });
    });

    it('should redirect when accessing system folder DRAFTS via /folders/-2', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.FOLDERS,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.FOLDERS}-2/`,
      });

      await waitFor(() => {
        expect(navigateToFolderByFolderIdStub.calledOnce).to.be.true;
        expect(navigateToFolderByFolderIdStub.firstCall.args[0]).to.equal('-2');
      });
    });

    it('should NOT redirect when accessing valid custom folder', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.FOLDERS,
          },
          folders: {
            folder: {
              folderId: 123,
              name: 'My Custom Folder',
            },
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.FOLDERS}123/`,
      });

      await waitFor(() => {
        expect(navigateToFolderByFolderIdStub.called).to.be.false;
      });
    });
  });

  describe('SessionStorage - Compose Entry URL Management', () => {
    beforeEach(() => {
      // Clear sessionStorage before each test
      sessionStorage.clear();
    });

    afterEach(() => {
      sessionStorage.clear();
    });

    it('captures entry URL in sessionStorage when entering compose from INBOX', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.INBOX,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE, // Now in compose flow
      });

      await waitFor(() => {
        expect(sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          Paths.INBOX,
        );
      });
    });

    it('captures entry URL when entering compose from other valid folder paths', async () => {
      // Test SENT path
      const sentState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.SENT,
          },
        },
      };

      const { unmount: unmountSent } = renderWithStoreAndRouter(
        <SmBreadcrumbs />,
        {
          initialState: sentState,
          reducers: reducer,
          path: Paths.COMPOSE,
        },
      );

      await waitFor(() => {
        expect(sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          Paths.SENT,
        );
      });

      unmountSent();
      sessionStorage.clear();

      // Test custom FOLDERS path
      const customFolderPath = `${Paths.FOLDERS}123/`;
      const foldersState = {
        sm: {
          breadcrumbs: {
            previousUrl: customFolderPath,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: foldersState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      await waitFor(() => {
        expect(sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          customFolderPath,
        );
      });
    });

    it('does NOT capture entry URL when entering compose from non-folder paths', async () => {
      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: Paths.DRAFTS,
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      await waitFor(() => {
        expect(sessionStorage.getItem('sm_composeEntryUrl')).to.be.null;
      });
    });

    it('does NOT overwrite entry URL when navigating within compose flow', async () => {
      // Simulate having already entered compose flow from INBOX
      sessionStorage.setItem('sm_composeEntryUrl', Paths.INBOX);

      const customState = {
        sm: {
          breadcrumbs: {
            previousUrl: `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`, // Previous was select care team
          },
        },
      };

      renderWithStoreAndRouter(<SmBreadcrumbs />, {
        initialState: customState,
        reducers: reducer,
        path: `${Paths.COMPOSE}${Paths.START_MESSAGE}`, // Now at start message
      });

      // Should NOT overwrite - entry URL should still be INBOX
      await waitFor(() => {
        expect(sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          Paths.INBOX,
        );
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
      expect(breadcrumb).to.have.attribute('text', 'Back');
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
      expect(breadcrumb).to.have.attribute('text', 'Back');
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
      expect(breadcrumb).to.have.attribute('text', 'Back');
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

      // Verify that the breadcrumb has the correct href pointing to the redirect path
      expect(breadcrumb).to.have.attribute('href', rxRedirectPath);
      expect(breadcrumb).to.have.attribute('text', 'Back');
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
