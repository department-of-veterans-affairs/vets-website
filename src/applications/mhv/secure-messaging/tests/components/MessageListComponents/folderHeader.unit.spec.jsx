import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FolderHeader from '../../../components/MessageList/FolderHeader';
import { folderList } from '../../fixtures/folder-response.json';
import messageResponse from '../../fixtures/message-response.json';

import {
  inbox,
  drafts,
  sent,
  customFolder,
} from '../../fixtures/folder-inbox-response.json';
import threadList from '../../fixtures/thread-list-response.json';
import reducer from '../../../reducers';
import {
  DefaultFolders,
  DefaultFolders as Folders,
  Paths,
} from '../../../util/constants';

const searchProps = { searchResults: [], awaitingResults: false };

describe('Folder Header component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: customFolder,
        folderList,
      },
      messageDetails: { message: messageResponse },
    },
    user: {
      profile: {
        session: {
          ssoe: true,
        },
      },
    },
  };
  const initialPath = `/folders/${customFolder.folderId}`;
  const setup = (
    state = initialState,
    path = initialPath,
    threadCount = threadList,
    folder = customFolder,
  ) => {
    return renderWithStoreAndRouter(
      <FolderHeader
        folder={folder}
        threadCount={threadCount}
        searchProps={{ ...searchProps }}
      />,
      {
        initialState: state,
        reducers: reducer,
        path,
      },
    );
  };

  describe('Folder Header component in CUSTOM FOLDER', () => {
    it('must display valid CUSTOM FOLDER name', async () => {
      const screen = setup();
      expect(screen.getByText(customFolder.name)).to.exist;
      expect(screen.getByText(Folders.CUSTOM_FOLDER.desc)).to.exist;
    });

    it('renders FilterBox with `threadCount` on CUSTOM FOLDER page', () => {
      const screen = setup();
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${customFolder.name} `,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, message ID, or subject',
      );
      expect(filterInputElement.getAttribute('aria-label')).to.equal(
        `Filter messages in ${
          customFolder.name
        } Enter information from one of these fields: to, from, message ID, or subject`,
      );
    });

    it('does not render FilterBox w/o `threadCount` on CUSTOM FOLDER page', () => {
      const screen = setup(initialState, initialPath, null);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component in INBOX', () => {
    const initialInboxState = {
      sm: {
        folders: {
          folder: inbox,
          folderList,
        },
      },
      user: {
        profile: {
          session: {
            ssoe: true,
          },
        },
      },
    };

    it('must display valid INBOX FOLDER name and page title', async () => {
      const screen = setup(initialState, Paths.INBOX, threadList, inbox);
      expect(screen.getByText(inbox.name, { selector: 'h1' })).to.exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` on INBOX FOLDER page', () => {
      const screen = setup(initialInboxState, Paths.INBOX, threadList, inbox);
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${inbox.name} `,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, message ID, or subject',
      );
      expect(filterInputElement.getAttribute('aria-label')).to.equal(
        `Filter messages in ${
          inbox.name
        } Enter information from one of these fields: to, from, message ID, or subject`,
      );
    });

    it('does not render FilterBox w/o `threadCount` on INBOX FOLDER page', () => {
      const screen = setup(initialInboxState, Paths.INBOX, null, inbox);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component in DRAFTS', () => {
    const initialDraftsState = {
      sm: {
        folders: {
          folder: drafts,
          folderList,
        },
      },
      user: {
        profile: {
          session: {
            ssoe: true,
          },
        },
      },
    };

    it('must display valid DRAFTS FOLDER name and page title', async () => {
      const screen = setup(
        initialDraftsState,
        Paths.DRAFTS,
        threadList,
        drafts,
      );
      expect(screen.getByText(drafts.name, { selector: 'h1' })).to.exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` on DRAFTS FOLDER page', () => {
      const screen = setup(
        initialDraftsState,
        Paths.DRAFTS,
        threadList,
        drafts,
      );
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${drafts.name} `,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, or subject',
      );
      expect(filterInputElement.getAttribute('aria-label')).to.equal(
        `Filter messages in ${
          drafts.name
        } Enter information from one of these fields: to, from, or subject`,
      );
    });

    it('does not render FilterBox w/o `threadCount` on DRAFTS FOLDER page', () => {
      const screen = setup(initialDraftsState, Paths.DRAFTS, null, drafts);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component in SENT', () => {
    const initialSentState = {
      sm: {
        folders: {
          folder: sent,
          folderList,
        },
      },
      user: {
        profile: {
          session: {
            ssoe: true,
          },
        },
      },
    };

    it('must display valid SENT FOLDER name and page title', async () => {
      const screen = setup(initialSentState, Paths.SENT, threadList, sent);
      expect(screen.getByText(`${sent.name} messages`, { selector: 'h1' })).to
        .exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` on SENT FOLDER page', () => {
      const screen = setup(initialSentState, Paths.SENT, threadList, sent);
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${sent.name} `,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, message ID, or subject',
      );
      expect(filterInputElement.getAttribute('aria-label')).to.equal(
        `Filter messages in ${
          sent.name
        } Enter information from one of these fields: to, from, message ID, or subject`,
      );
    });

    it('does not render FilterBox w/o `threadCount` on INBOX FOLDER page', () => {
      const screen = setup(initialSentState, Paths.SENT, null, sent);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component in TRASH', () => {
    const trash = {
      folderId: -3,
      name: DefaultFolders.DELETED.header,
      count: 55,
      unreadCount: 41,
      systemFolder: true,
    };
    const initialTrashState = {
      sm: {
        folders: {
          folder: trash,
          folderList,
        },
      },
      user: {
        profile: {
          session: {
            ssoe: true,
          },
        },
      },
    };

    it('must display valid TRASH FOLDER name and page title', async () => {
      const screen = setup(initialTrashState, Paths.DELETED, threadList, trash);
      expect(screen.getByText(trash.name, { selector: 'h1' })).to.exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` on TRASH FOLDER page', () => {
      const screen = setup(initialTrashState, Paths.DELETED, threadList, trash);
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${trash.name} `,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, message ID, or subject',
      );
      expect(filterInputElement.getAttribute('aria-label')).to.equal(
        `Filter messages in ${
          trash.name
        } Enter information from one of these fields: to, from, message ID, or subject`,
      );
    });

    it('does not render FilterBox w/o `threadCount` on TRASH FOLDER page', () => {
      const screen = setup(initialTrashState, Paths.DELETED, null, trash);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });
});
