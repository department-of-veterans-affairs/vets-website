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
import { folderList } from '../fixtures/folder-response.json';
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

  it(`verifies page title tag, folder name, folder description and "Start a new message" link should NOT exist for SENT`, async () => {
    const initialStateSent = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: sent, folderList },
      },
    };

    const screen = setup(initialStateSent, Paths.SENT);

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Sent messages ${PageTitles.PAGE_TITLE_TAG}`,
      );
      expect(screen.getByText(DefaultFolders.SENT.header, { selector: 'h1' }))
        .to.exist;
    });
    expect(screen.queryByText('Start a new message')).to.not.exist;
  });

  it(`verifies page title tag, folder name, folder description and "Start a new message" link should NOT exist for DRAFTS`, async () => {
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
      expect(screen.getByText(DefaultFolders.DRAFTS.header, { selector: 'h1' }))
        .to.exist;
      expect(screen.queryByText('Start a new message')).to.not.exist;
    });
  });

  it(`verifies page title tag, folder name, folder description and "Start a new message" link should NOT exist for TRASH`, async () => {
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

    expect(screen.getByText(DefaultFolders.DELETED.header, { selector: 'h1' }))
      .to.exist;
    expect(screen.getByText(DefaultFolders.DELETED.desc, { selector: 'p' })).to
      .exist;
    expect(screen.queryByText('Start a new message')).to.not.exist;
  });

  it(`verifies page title tag, folder name, folder description and "Start a new message" link should NOT exist for CUSTOM FOLDER`, async () => {
    const initialStateDrafts = {
      sm: {
        messageDetails: { message: messageResponse },
        folders: { folder: customFolder, folderList },
      },
    };

    const screen = setup(
      initialStateDrafts,
      `/folders/${customFolder.folderId}`,
    );

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `${customFolder.name} ${PageTitles.PAGE_TITLE_TAG}`,
      );
      expect(screen.getByText(customFolder.name, { selector: 'h1' })).to.exist;
      expect(
        screen.getByText(DefaultFolders.CUSTOM_FOLDER.desc, { selector: 'p' }),
      ).to.exist;
      expect(screen.queryByText('Start a new message')).to.not.exist;
    });
  });
});
