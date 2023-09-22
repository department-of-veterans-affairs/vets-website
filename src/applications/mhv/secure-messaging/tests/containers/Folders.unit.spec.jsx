import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { PageTitles, Paths } from '../../util/constants';
import reducer from '../../reducers';
import Folders from '../../containers/Folders';

describe('Folders Landing Page', () => {
  const customFolderList = [
    { id: 0, name: 'Inbox', count: 5, unreadCount: 0, systemFolder: true },
    { id: -2, name: 'Drafts', count: 5, unreadCount: 0, systemFolder: true },
    { id: -1, name: 'Sent', count: 5, unreadCount: 0, systemFolder: true },
    { id: -3, name: 'Deleted', count: 5, unreadCount: 0, systemFolder: true },
    {
      id: 1234567,
      name: 'NEW MEDCIAL RECORDS FOLDER',
      count: 0,
      unreadCount: 0,
      systemFolder: false,
    },
  ];

  const initialState = {
    sm: {
      folders: { folderList: customFolderList },
      search: {},
    },
  };

  const folderCount = customFolderList?.length;
  const setup = (state = initialState, path = Paths.FOLDERS) => {
    return renderWithStoreAndRouter(<Folders />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it(`verifies page title tag for 'My folders' page`, async () => {
    await waitFor(() => {
      expect(global.document.title).to.equal(
        PageTitles.MY_FOLDERS_PAGE_TITLE_TAG,
      );
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('My folders')).to.exist;
  });

  it('should verify that a custom folder exists', async () => {
    expect(folderCount).to.equal(5);
    expect(screen.getByText('NEW MEDCIAL RECORDS FOLDER')).to.exist;
    expect(screen.getByText('NEW MEDCIAL RECORDS FOLDER').tagName).to.equal(
      'SPAN',
    );
  });

  it('opens and closes Create New Folder modal', async () => {
    const createNewFolderBtn = screen.getByTestId('create-new-folder');
    fireEvent.click(createNewFolderBtn);
    const createNewFolderModal = screen.getByTestId('create-folder-modal');
    expect(createNewFolderModal).to.be.visible;

    const vaTextInput = screen.getByTestId('folder-name');
    expect(vaTextInput).to.exist;

    const createFolderButton = screen.getByTestId('create-folder-button');
    expect(createFolderButton).to.exist;

    const cancelFolderButton = screen.getByTestId('cancel-folder-button');
    expect(cancelFolderButton).to.exist;
    fireEvent.click(cancelFolderButton);
    await waitFor(() => {
      expect(createNewFolderModal.getAttribute('visible')).to.equal('false');
    });
  });

  it('should allow input field text changes in Create New Folder Modal', () => {
    // opens create new folder modal
    const createNewFolderBtn = screen.getByTestId('create-new-folder');
    fireEvent.click(createNewFolderBtn);
    const createNewFolderModal = screen.getByTestId('create-folder-modal');
    expect(createNewFolderModal).to.be.visible;

    // checks input field to be empty
    const vaTextInput = screen.queryByTestId('folder-name');
    expect(vaTextInput.getAttribute('value')).to.equal('');

    // asserts new input field text value
    vaTextInput.setAttribute('value', 'New Custom Folder');
    expect(vaTextInput.getAttribute('value')).to.equal('New Custom Folder');
  });
});
