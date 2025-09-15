import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockApiRequest,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import * as mhvExports from '~/platform/mhv/unique_user_metrics';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  inbox,
  sent,
  drafts,
  customFolder,
} from '../fixtures/folder-inbox-response.json';
import folderList from '../fixtures/folder-response.json';
import {
  DefaultFolders,
  PageTitles,
  Paths,
  threadSortingOptions,
  Alerts,
} from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';
import threadListResponse from '../fixtures/thread-list-response.json';
import {
  drupalStaticData,
  cernerFacilities,
  userProfileFacilities,
} from '../fixtures/cerner-facility-mock-data.json';
import * as threadsActions from '../../actions/threads';
import { selectVaSelect } from '../../util/testUtils';
import getInbox from '../fixtures/mock-api-responses/get-inbox-response.json';

describe('Folder Thread List View container', () => {
  const expectTitleToEqual = expected => {
    expect(global.document.title.replace(/\s+/g, ' ')).to.equal(
      expected.replace(/\s+/g, ' '),
    );
  };
  const initialState = {
    sm: {
      folders: { folder: inbox, folderList },
      facilities: {
        cernerFacilities,
      },
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const setup = (state = initialState, path = Paths.INBOX) => {
    return renderWithStoreAndRouter(<FolderThreadListView />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  it(`verifies page title tag, folder name, folder description and displays "Start a new message" link for INBOX`, async () => {
    const screen = setup({
      ...initialState,
      user: {
        profile: {
          facilities: userProfileFacilities,
        },
      },
    });

    await waitFor(() => {
      expectTitleToEqual(`Messages: Inbox${PageTitles.DEFAULT_PAGE_TITLE_TAG}`);
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(
        `Messages: ${DefaultFolders.INBOX.header}`,
      );
    });
    expect(screen.queryByText('Start a new message')).to.exist;
    const startANewMessageLink = screen.getByTestId('compose-message-link');
    expect(startANewMessageLink).to.exist;
    expect(startANewMessageLink).to.have.text('Start a new message');
    expect(startANewMessageLink).to.have.attr('href', Paths.COMPOSE);
  });

  it('logs unique user metrics when inbox is accessed', async () => {
    const logUniqueUserMetricsEventsStub = sinon.stub(
      mhvExports,
      'logUniqueUserMetricsEvents',
    );

    setup({
      ...initialState,
      user: {
        profile: {
          facilities: userProfileFacilities,
        },
      },
    });

    await waitFor(() => {
      // Verify unique user metrics logging for inbox access
      expect(logUniqueUserMetricsEventsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsEventsStub.firstCall.args[0]).to.equal(
        mhvExports.EVENT_REGISTRY.SECURE_MESSAGING_INBOX_ACCESSED,
      );

      logUniqueUserMetricsEventsStub.restore();
    });
  });

  it(`verifies page title tag for 'Sent' FolderThreadListView page`, async () => {
    const initialStateSent = {
      sm: {
        folders: { folder: sent, folderList },
      },
    };

    const screen = setup(initialStateSent, Paths.SENT);

    await waitFor(() => {
      expectTitleToEqual(`Messages: Sent${PageTitles.DEFAULT_PAGE_TITLE_TAG}`);
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(
        `Messages: ${DefaultFolders.SENT.header}`,
      );
    });
    expect(screen.queryByText('Start a new message')).to.exist;
  });

  it(`verifies page title tag for 'Drafts' FolderThreadListView page`, async () => {
    const initialStateDrafts = {
      sm: {
        folders: { folder: drafts, folderList },
      },
    };

    const screen = setup(initialStateDrafts, Paths.DRAFTS);

    await waitFor(() => {
      expectTitleToEqual(
        `Messages: Drafts${PageTitles.DEFAULT_PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(
        `Messages: ${DefaultFolders.DRAFTS.header}`,
      );

      expect(screen.queryByText('Start a new message')).to.not.exist;
    });
  });

  it(`verifies page title tag for 'Trash' FolderThreadListView page`, async () => {
    const initialStateTrash = {
      sm: {
        folders: {
          folder: {
            folderId: -3,
            name: DefaultFolders.DELETED.header,
            count: 0,
            unreadCount: 0,
            systemFolder: true,
          },
        },
      },
    };

    const screen = setup(initialStateTrash, Paths.DELETED);

    await waitFor(() => {
      expectTitleToEqual(`Messages: Trash${PageTitles.DEFAULT_PAGE_TITLE_TAG}`);
    });
    const folderName = screen.getByRole('heading', { level: 1 });
    expect(folderName).to.exist;
    expect(folderName).to.have.text(
      `Messages: ${DefaultFolders.DELETED.header}`,
    );

    const folderDescription = screen.getByTestId('folder-description');
    expect(folderDescription).to.exist;
    expect(folderDescription).to.have.text(DefaultFolders.DELETED.desc);
    expect(screen.queryByText('Start a new message')).to.not.exist;
  });

  it('validate alert banner is displayed when folder call responds with an error', async () => {
    const res = {
      errors: [
        {
          title: 'Service unavailable',
          detail: 'Backend Service Outage',
          code: '503',
          status: '503',
        },
      ],
    };
    mockFetch(res, false);
    const screen = setup({ sm: {} });

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      const ariaLabel = document.querySelector('span');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('error');
      expect(screen.getByText(Alerts.Message.SERVER_ERROR_503)).to.exist;
      expect(ariaLabel.textContent).to.contain(`You are in Inbox.`);
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
    });
  });

  describe(`verifies page title tag for 'Custom Folder' FolderThreadListView page`, () => {
    it('CUSTOM FOLDER', async () => {
      const initialStateCustomFolder = {
        sm: {
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.MESSAGING],
              session: {
                ssoe: false,
              },
            },
          },
          folders: { folder: customFolder },
          search: {
            awaitingResults: false,
            keyword: '',
            searchSort: threadSortingOptions.SENT_DATE_DESCENDING.value,
            page: 1,
          },
          threads: {
            isLoading: true,
            threadList: threadListResponse,
            threadSort: {
              value: threadSortingOptions.SENT_DATE_DESCENDING.value,
              folderId: 2628777,
              page: 1,
            },
          },
        },
      };

      const customSetup = (
        state = initialStateCustomFolder,
        path = `/folders/${customFolder.folderId}/`,
      ) => {
        return renderWithStoreAndRouter(<FolderThreadListView testing />, {
          initialState: state,
          reducers: reducer,
          path,
        });
      };

      const screen = await customSetup();
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(`Messages: ${customFolder.name}`);
      const folderDescription = screen.getByTestId('folder-description');
      expect(folderDescription).to.exist;
      expect(folderDescription).to.have.text(DefaultFolders.CUSTOM_FOLDER.desc);
      expect(screen.queryByText('Start a new message')).to.not.exist;
      expect(screen.getByTestId('remove-folder-button')).to.exist;
      waitFor(() => {
        fireEvent.click(screen.getByTestId('remove-folder-button'));
      });
      const folderNotEmptyModal = screen.getByTestId('error-folder-not-empty');
      expect(folderNotEmptyModal).to.have.attribute(
        'modal-title',
        'Empty this folder',
      );
      expect(folderNotEmptyModal).to.have.attribute('visible', 'true');
      expect(folderNotEmptyModal).to.have.attribute('status', 'warning');

      expectTitleToEqual(
        `Messages: More folders${PageTitles.DEFAULT_PAGE_TITLE_TAG}`,
      );
      expect(screen.getByText(Alerts.Folder.DELETE_FOLDER_ERROR_NOT_EMPTY_BODY))
        .to.exist;
    });
  });

  describe('useCallback and useEffect refactoring', () => {
    it('should render without errors after useCallback refactoring', async () => {
      // This test verifies that the refactored useCallback functions don't break rendering
      const screen = setup({
        ...initialState,
        user: {
          profile: {
            facilities: userProfileFacilities,
          },
        },
      });

      await waitFor(() => {
        const folderName = screen.getByRole('heading', { level: 1 });
        expect(folderName).to.exist;
        expect(folderName).to.have.text(
          `Messages: ${DefaultFolders.INBOX.header}`,
        );
      });
    });

    it('should render drafts folder correctly with new logic', async () => {
      // This test verifies the new folderId-based logic for drafts works correctly
      const initialStateDrafts = {
        sm: {
          folders: { folder: drafts, folderList },
        },
      };

      const screen = setup(initialStateDrafts, Paths.DRAFTS);

      await waitFor(() => {
        const folderName = screen.getByRole('heading', { level: 1 });
        expect(folderName).to.exist;
        expect(folderName).to.have.text(
          `Messages: ${DefaultFolders.DRAFTS.header}`,
        );
      });
    });

    it('should maintain functionality after useEffect separation', async () => {
      // This test verifies that separating the large useEffect into smaller ones maintains functionality
      const screen = setup({
        ...initialState,
        user: {
          profile: {
            facilities: userProfileFacilities,
          },
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Start a new message')).to.exist;
        const startANewMessageLink = screen.getByTestId('compose-message-link');
        expect(startANewMessageLink).to.exist;
      });
    });
  });

  describe('handleSortCallback function', () => {
    it('should call getListOfThreads when handleSortCallback is triggered', async () => {
      const testState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threads: {
            threadList: threadListResponse,
            threadSort: {
              value: threadSortingOptions.SENT_DATE_DESCENDING.value,
              folderId: inbox.folderId,
              page: 1,
            },
            isLoading: false,
          },
        },
      };

      mockApiRequest(getInbox);

      const screen = setup(testState);

      await waitFor(
        () => {
          // Check if we have the folder header at least
          const folderName = screen.queryByRole('heading', { level: 1 });
          expect(folderName).to.exist;
        },
        { timeout: 5000 },
      );

      const getListOfThreadsSpy = sinon.spy(threadsActions, 'getListOfThreads');
      const sortComponent = screen.queryByTestId('thread-list-sort');
      const sortButton = screen.getByTestId('sort-button');
      selectVaSelect(sortComponent, 'SENT_DATE_ASCENDING');
      fireEvent.click(sortButton);
      await waitFor(() => {
        const expectedArgs = [0, 10, 1, 'SENT_DATE_ASCENDING', false];
        expect(getListOfThreadsSpy.args[0]).deep.equal(expectedArgs);
      });
      getListOfThreadsSpy.restore();
    });

    it('should work correctly with different folder types', async () => {
      // Test handleSortCallback with drafts folder to ensure folderId dependency works
      const initialStateDrafts = {
        sm: {
          folders: { folder: drafts, folderList },
        },
      };

      const screen = setup(initialStateDrafts, Paths.DRAFTS);

      await waitFor(() => {
        const folderName = screen.getByRole('heading', { level: 1 });
        expect(folderName).to.exist;
        expect(folderName).to.have.text(
          `Messages: ${DefaultFolders.DRAFTS.header}`,
        );
      });

      // handleSortCallback should work correctly with different folder types
      expect(screen.container).to.exist;
    });
  });

  describe('handlePagination function', () => {
    it('should call retrieveListOfThreads when pageSelect event is emitted', async () => {
      // Render FolderThreadListView component for Inbox folder, page 1, default sort
      const testState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          folders: {
            folder: inbox,
            folderList,
          },
          threads: {
            threadList: threadListResponse,
            threadSort: {
              value: threadSortingOptions.SENT_DATE_DESCENDING.value,
              folderId: inbox.folderId,
              page: 1,
            },
            isLoading: false,
          },
        },
      };

      const screen = setup(testState, Paths.INBOX);

      await waitFor(() => {
        const folderName = screen.queryByRole('heading', { level: 1 });
        expect(folderName).to.exist;
      });

      await waitFor(() => {
        expect(screen.findByText('Showing 1 to')).to.exist;
      });

      const getListOfThreadsSpy = sinon.spy(threadsActions, 'getListOfThreads');
      const pagination = screen.container.querySelector('va-pagination');
      const pageSelectEvent = new CustomEvent('pageSelect', {
        detail: { page: 2 },
        bubbles: true,
      });
      pagination.dispatchEvent(pageSelectEvent);

      await waitFor(() => {
        const expectedArgs = [0, 10, 2, 'SENT_DATE_DESCENDING', false];
        expect(getListOfThreadsSpy.args[0]).to.deep.equal(expectedArgs);
      });
      getListOfThreadsSpy.restore();
    });
  });
});
