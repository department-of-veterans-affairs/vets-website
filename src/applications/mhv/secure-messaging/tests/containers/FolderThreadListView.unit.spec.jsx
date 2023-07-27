import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { inbox, sent, drafts } from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import { folderList } from '../fixtures/folder-response.json';
import { DefaultFolders, PageTitles, Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';

describe('Folder Thread List View container', () => {
  it(`displays 'Start a new message' link`, () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: inbox, folderList },
      },
    };
    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView testing />, {
        initialState: state,
        reducers: reducer,
        path: Paths.INBOX,
      });
    };
    const screen = setup();

    const startANewMessageLink = screen.getByTestId('compose-message-link');
    expect(startANewMessageLink).to.exist;
    expect(startANewMessageLink).to.have.text('Start a new message');
    expect(startANewMessageLink).to.have.attr('href', Paths.COMPOSE);
  });

  it(`verifies page title tag and displays valid folder name for 'Inbox'`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: inbox, folderList },
      },
    };
    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView testing />, {
        initialState: state,
        reducers: reducer,
        path: Paths.INBOX,
      });
    };
    const screen = setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Inbox ${PageTitles.PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(DefaultFolders.INBOX.header);
    });
    expect(screen.queryByText('Start a new message')).to.exist;
  });

  it(`verifies page title tag and displays valid folder name for 'Sent messages'`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: sent, folderList },
      },
    };

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView testing />, {
        initialState: state,
        reducers: reducer,
        path: Paths.SENT,
      });
    };
    const screen = setup();

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Sent messages ${PageTitles.PAGE_TITLE_TAG}`,
      );
      const folderName = screen.getByRole('heading', { level: 1 });
      expect(folderName).to.exist;
      expect(folderName).to.have.text(DefaultFolders.SENT.header);
    });
    expect(screen.queryByText('Start a new message')).to.not.exist;
  });

  it(`verifies page title tag and displays valid folder name for 'Drafts'`, async () => {
    const initialState = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: drafts, folderList },
      },
    };

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView testing />, {
        initialState: state,
        reducers: reducer,
        path: Paths.DRAFTS,
      });
    };
    const screen = setup();

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

  it(`verifies page title tag and displays valid folder name for 'Trash'`, async () => {
    const initialState = {
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

    const setup = (state = initialState) => {
      return renderWithStoreAndRouter(<FolderThreadListView testing />, {
        initialState: state,
        reducers: reducer,
        path: Paths.DELETED,
      });
    };
    const screen = setup();

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
});
