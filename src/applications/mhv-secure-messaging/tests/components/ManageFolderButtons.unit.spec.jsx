import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import folders from '../fixtures/folder-inbox-response.json';
import folderList from '../fixtures/folder-response.json';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import ManageFolderButtons from '../../components/ManageFolderButtons';
import * as foldersActions from '../../actions/folders';
import { inputVaTextInput } from '../../util/testUtils';

describe('Manage Folder Buttons component', () => {
  let sandbox;
  const folder = folders.customFolder;
  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
      threads: {
        threadList: [],
      },
      alerts: {
        alertVisible: false,
        alertFocusOut: null,
        alertList: [],
      },
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folders.customFolder} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.FOLDERS,
      },
    );
    expect(screen).to.exist;
  });

  it('"Remove folder" button opens a confirmation modal when no threads contained', async () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folders.customFolder} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.FOLDERS,
      },
    );
    fireEvent.click(screen.getByTestId('remove-folder-button'));
    await waitFor(() => {
      expect(screen.getByTestId('remove-this-folder')).to.have.attribute(
        'visible',
        'true',
      );
    });
    expect(screen.getByText("If you remove a folder, you can't get it back."))
      .to.exist;
    expect(screen.queryByText("You can't remove a folder with messages in it."))
      .to.not.exist;

    fireEvent.click(
      document.querySelector('va-button[text="No, keep this folder"]'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('remove-this-folder')).to.have.attribute(
        'visible',
        'false',
      );
    });
  });

  it('confirming removal of a folder with no threads contained triggers a call', async () => {
    const deleteFolderSpy = sandbox.spy(foldersActions, 'delFolder');
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('remove-folder-button'));
    fireEvent.click(
      document.querySelector('va-button[text="Yes, remove this folder"]'),
    );
    sinon.assert.calledWith(deleteFolderSpy);
  });

  it("displays inline edit form when 'Edit folder name' button is clicked", async () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const editButton = screen.getByTestId('edit-folder-button');
    expect(editButton).to.exist;

    // Form should not be visible initially
    expect(screen.queryByTestId('edit-folder-form')).to.not.exist;

    // Click button to expand inline form
    fireEvent.click(editButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('edit-folder-form')).to.exist;
    });

    // Verify cancel button closes the form
    fireEvent.click(screen.getByTestId('cancel-edit-folder-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('edit-folder-form')).to.not.exist;
    });
  });

  it('Inline edit form shows error for blank folder name', async () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );

    // Click button to expand inline form
    fireEvent.click(screen.getByTestId('edit-folder-button'));

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('edit-folder-form')).to.exist;
    });

    inputVaTextInput(
      screen.container,
      '',
      '[data-testid="edit-folder-name-input"]',
    );

    const input = screen.getByTestId('edit-folder-name-input');

    const saveButton = screen.getByTestId('save-edit-folder-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(input.getAttribute('error')).to.equal(
        'Folder name cannot be blank',
      );
    });
  });

  it('Inline edit form shows error for duplicate folder name', async () => {
    const existingFolderName = folderList.slice(-1)[0].name;
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );

    // Click button to expand inline form
    fireEvent.click(screen.getByTestId('edit-folder-button'));

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('edit-folder-form')).to.exist;
    });

    inputVaTextInput(
      screen.container,
      existingFolderName,
      '[data-testid="edit-folder-name-input"]',
    );

    const input = screen.getByTestId('edit-folder-name-input');

    const saveButton = screen.getByTestId('save-edit-folder-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(input.getAttribute('error')).to.equal(
        'Folder name already in use. Please use another name.',
      );
    });
  });

  it('Edit folder name button renders with full-width attribute', () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const editButton = screen.getByTestId('edit-folder-button');
    expect(editButton).to.have.attribute('full-width');
    expect(editButton).to.have.attribute('secondary');
  });

  it('Remove folder button renders with full-width attribute and destructive styling class', () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const removeButton = screen.getByTestId('remove-folder-button');
    expect(removeButton).to.have.attribute('full-width');
    expect(removeButton).to.have.attribute('secondary');
    expect(removeButton.getAttribute('class')).to.include(
      'sm-button-destructive',
    );
  });

  it('Save button in edit form triggers rename folder action with new name', async () => {
    const renameFolderSpy = sandbox.spy(foldersActions, 'renameFolder');
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );

    // Click button to expand inline form
    fireEvent.click(screen.getByTestId('edit-folder-button'));

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('edit-folder-form')).to.exist;
    });

    inputVaTextInput(
      screen.container,
      'New Folder Name',
      '[data-testid="edit-folder-name-input"]',
    );

    const saveButton = screen.getByTestId('save-edit-folder-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      sinon.assert.calledOnce(renameFolderSpy);
    });
  });
});
