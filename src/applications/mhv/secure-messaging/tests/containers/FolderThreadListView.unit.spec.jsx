import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import {
  inbox,
  sent,
  drafts,
  customFolder,
} from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import folderList from '../fixtures/folder-response.json';
// import threadList from '../fixtures/thread-list-response.json';
import { DefaultFolders, PageTitles, Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';

describe('Folder Thread List View container', () => {
  const initialState = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox, folderList },
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

  describe(`verifies page title tag for 'Custom Folder' FolderThreadListView page`, () => {
    it('CUSTOM FOLDER', async () => {
      const initialStateCustomFolder = {
        sm: {
          messageDetails: { message: messageResponse },
          folders: { folder: customFolder },
          search: {
            searchResults: [],
            awaitingResults: false,
            keyword: '',
            searchSort: 'SENT_DATE_DESCENDING',
            query: { category: '' },
            page: 1,
          },
          threads: {
            threadList: [
              {
                threadId: 2653173,
                folderId: 2628777,
                messageId: 2756440,
                threadPageSize: 3,
                messageCount: 5,
                category: 'OTHER',
                subject: 't',
                triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
                sentDate: '2023-04-17T19:02:51.000Z',
                draftDate: null,
                senderId: 12509,
                senderName: 'GOPARAJU, BHANU ',
                recipientName: 'FREEMAN, MELVIN  V',
                recipientId: 523757,
                proxySenderName: null,
                hasAttachment: false,
                unsentDrafts: false,
                unreadMessages: false,
              },
              {
                threadId: 2733445,
                folderId: 2628777,
                messageId: 2735073,
                threadPageSize: 3,
                messageCount: 4,
                category: 'OTHER',
                subject: 'test reply -rrr',
                triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
                sentDate: '2023-04-04T15:46:34.000Z',
                draftDate: null,
                senderId: 257555,
                senderName: 'ISLAM, MOHAMMAD  RAFIQ',
                recipientName: 'FREEMAN, MELVIN  V',
                recipientId: 523757,
                proxySenderName: null,
                hasAttachment: true,
                unsentDrafts: true,
                unreadMessages: false,
              },
            ],
            threadSort: {
              value: 'SENT_DATE_DESCENDING',
              folderId: 2628777,
              page: 1,
            },
          },
        },
      };

      //   const threadCount = threadList?.length;
      //   const folderId = customFolder?.folderId;
      //   const searchResults =
      //     initialStateCustomFolder.sm.search.searchResults?.length;

      const customSetup = (
        state = initialStateCustomFolder,
        path = `/folders/${customFolder.folderId}`,
      ) => {
        return renderWithStoreAndRouter(<FolderThreadListView testing />, {
          initialState: state,
          reducers: reducer,
          path,
        });
      };

      const screen = customSetup();

      await waitFor(() => {
        expect(global.document.title).to.equal(
          `${customFolder.name} ${PageTitles.PAGE_TITLE_TAG}`,
        );
        const folderName = screen.getByRole('heading', { level: 1 });
        expect(folderName).to.exist;
        expect(folderName).to.have.text(customFolder.name);
        const folderDescription = screen.getByTestId('folder-description');
        expect(folderDescription).to.exist;
        expect(folderDescription).to.have.text(
          DefaultFolders.CUSTOM_FOLDER.desc,
        );
        expect(screen.queryByText('Start a new message')).to.not.exist;
      });

      //   console.log('threadCount: ', threadCount);
      //   console.log('folderId: ', folderId);
      //   console.log('search results: ', searchResults);
      expect(screen.getByTestId('remove-folder-button')).to.exist;

      // expect(screen.getByText('Empty this folder')).to.exist;
      // expect(
      //   screen.getByText(
      //     `You can't remove a folder with messages in it. Move all the messages to another folder. Then try removing it again.`,
      //   ),
      // ).to.exist;
    });
  });
});
