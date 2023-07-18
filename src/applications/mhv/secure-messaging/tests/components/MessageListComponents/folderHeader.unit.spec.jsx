import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import FolderHeader from '../../../components/MessageList/FolderHeader';
import folderResponse from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import { DefaultFolders as Folders, PageTitles } from '../../../util/constants';

describe('FolderHeader component in custom folder', () => {
  const searchProps = { searchResults: [], awaitingResults: false };
  const initialState = {
    sm: {
      folders: {
        folder: {
          folderId: 7038175,
          name: 'TEST2',
          count: 1,
          unreadCount: 0,
          systemFolder: false,
        },
        folderList: folderResponse,
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
  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <FolderHeader
        folder={{
          folderId: 7038175,
          name: 'TEST2',
          count: 1,
          unreadCount: 0,
          systemFolder: false,
        }}
        searchProps={{ ...searchProps }}
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/folders/7038175',
      },
    );
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it('must display valid custom folder name', async () => {
    expect(screen.getByText('TEST2')).to.exist;
    expect(screen.getByText(Folders.CUSTOM_FOLDER.desc)).to.exist;
  });

  it('verifies page title tag for custom folder page', async () => {
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `TEST2 ${PageTitles.PAGE_TITLE_TAG}`,
      );
    });
  });
});
