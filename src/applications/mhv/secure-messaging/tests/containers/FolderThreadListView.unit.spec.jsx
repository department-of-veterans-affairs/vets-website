import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { inbox, sent, drafts } from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import { folderList } from '../fixtures/folder-response.json';
import { PageTitles, Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';

describe('Folder Thread List View container', () => {
  it(`verifies page title tag for 'Inbox' FolderThreadListView page`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: inbox, folderList },
      },
    };
    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView />, {
        initialState: state,
        reducers: reducer,
        path: Paths.INBOX,
      });
    };
    setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Inbox ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
  });

  it(`verifies page title tag for 'Sent messages' FolderThreadListView page`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: sent, folderList },
      },
    };

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView />, {
        initialState: state,
        reducers: reducer,
        path: Paths.SENT,
      });
    };
    setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Sent ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
  });

  it(`verifies page title tag for 'Drafts' FolderThreadListView page`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: drafts, folderList },
      },
    };

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView />, {
        initialState: state,
        reducers: reducer,
        path: Paths.DRAFTS,
      });
    };
    setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Drafts ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
  });

  it(`verifies page title tag for 'Trash' FolderThreadListView page`, async () => {
    const initialState = {
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
      },
    };

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView />, {
        initialState: state,
        reducers: reducer,
        path: Paths.DELETED,
      });
    };
    setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Trash ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
  });
});
