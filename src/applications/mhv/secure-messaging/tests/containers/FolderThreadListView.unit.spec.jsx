import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  inbox,
  sent,
  drafts,
  customFolder,
} from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
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

describe('Folder Thread List View container', () => {
  const initialState = {
    sm: {
      messageDetails: { message: messageResponse },
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
    return renderWithStoreAndRouter(<FolderThreadListView testing />, {
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
      expect(global.document.title).to.equal(
        `Inbox ${PageTitles.PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(DefaultFolders.INBOX.header);
    });
    expect(screen.queryByText('Start a new message')).to.exist;
    const startANewMessageLink = screen.getByTestId('compose-message-link');
    expect(startANewMessageLink).to.exist;
    expect(startANewMessageLink).to.have.text('Start a new message');
    expect(startANewMessageLink).to.have.attr('href', Paths.COMPOSE);
  });

  it(`verifies page title tag for 'Sent' FolderThreadListView page`, async () => {
    const initialStateSent = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: sent, folderList },
      },
    };

    const screen = setup(initialStateSent, Paths.SENT);

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Sent ${PageTitles.PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(DefaultFolders.SENT.header);
    });
    expect(screen.queryByText('Start a new message')).to.not.exist;
  });

  it(`verifies page title tag for 'Drafts' FolderThreadListView page`, async () => {
    const initialStateDrafts = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: drafts, folderList },
      },
    };

    const screen = setup(initialStateDrafts, Paths.DRAFTS);

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Drafts ${PageTitles.PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(DefaultFolders.DRAFTS.header);

      expect(screen.queryByText('Start a new message')).to.not.exist;
    });
  });

  it(`verifies page title tag for 'Trash' FolderThreadListView page`, async () => {
    const initialStateTrash = {
      sm: {
        messageDetails: { message: messageResponse },
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
      expect(global.document.title).to.equal(
        `Trash ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
    const folderName = screen.getByRole('heading', { level: 1 });
    expect(folderName).to.exist;
    expect(folderName).to.have.text(DefaultFolders.DELETED.header);

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
      expect(alert)
        .to.have.attribute('status')
        .to.equal('error');
      expect(screen.getByText(res.errors[0].detail)).to.exist;
      expect(document.querySelector('h1')).to.not.exist;
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
      expect(folderName).to.have.text(customFolder.name);
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

      expect(global.document.title).to.equal(
        `${customFolder.name} ${PageTitles.PAGE_TITLE_TAG}`,
      );
      expect(screen.getByText(Alerts.Folder.DELETE_FOLDER_ERROR_NOT_EMPTY_BODY))
        .to.exist;
    });
  });
});
