import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import folderList from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import CreateFolderInline from '../../../components/FoldersList/CreateFolderInline';
import { Alerts } from '../../../util/constants';

describe('CreateFolderInline component', () => {
  let sandbox;

  const initialState = {
    sm: {
      folders: {
        folderList,
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
    cleanup();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      folders: folderList,
      onConfirm: sandbox.stub(),
      onFolderCreated: sandbox.stub(),
    };
    return renderWithStoreAndRouter(
      <CreateFolderInline {...defaultProps} {...props} />,
      {
        initialState,
        reducers: reducer,
      },
    );
  };

  it('renders the "Create new folder" button when not expanded', () => {
    const screen = setup();
    expect(screen.getByTestId('create-new-folder')).to.exist;
    expect(screen.queryByTestId('create-folder-inline')).to.be.null;
  });

  it('expands inline form when "Create new folder" button is clicked', async () => {
    const screen = setup();

    const createNewFolderBtn = screen.getByTestId('create-new-folder');
    fireEvent.click(createNewFolderBtn);

    await waitFor(() => {
      expect(screen.getByTestId('create-folder-inline')).to.exist;
      expect(screen.getByTestId('folder-name')).to.exist;
      expect(screen.getByTestId('create-folder-button')).to.exist;
      expect(screen.getByTestId('cancel-folder-button')).to.exist;
    });
  });

  it('collapses inline form when Cancel button is clicked', async () => {
    const screen = setup();

    // Expand the form
    const createNewFolderBtn = screen.getByTestId('create-new-folder');
    fireEvent.click(createNewFolderBtn);
    expect(screen.getByTestId('create-folder-inline')).to.exist;

    // Click cancel button
    const cancelBtn = document.querySelector('va-button[text="Cancel"]');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('create-folder-inline')).to.be.null;
    });
  });

  it('shows validation error when folder name is empty and Create is clicked', async () => {
    const screen = setup();

    // Expand the form
    fireEvent.click(screen.getByTestId('create-new-folder'));

    // Try to create without entering a name
    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'error',
        Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
      );
    });
  });

  it('displays text input with proper attributes for folder name entry', async () => {
    const screen = setup();

    // Expand the form
    fireEvent.click(screen.getByTestId('create-new-folder'));

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute('label', 'Folder name');
      expect(textInput).to.have.attribute('maxlength', '50');
      expect(textInput).to.have.attribute('charcount', 'true');
    });
  });

  it('allows text input value to be set', async () => {
    const screen = setup();

    // Expand and enter a valid new name
    fireEvent.click(screen.getByTestId('create-new-folder'));
    inputVaTextInput(screen.container, 'My New Folder');

    await waitFor(() => {
      expect(document.querySelector('va-text-input[value="My New Folder"]')).to
        .exist;
    });
  });

  it('renders Create and Cancel buttons with correct text', async () => {
    const screen = setup();

    fireEvent.click(screen.getByTestId('create-new-folder'));

    await waitFor(() => {
      const createBtn = document.querySelector('va-button[text="Create"]');
      const cancelBtn = document.querySelector('va-button[text="Cancel"]');
      expect(createBtn).to.exist;
      expect(cancelBtn).to.exist;
      expect(cancelBtn).to.have.attribute('secondary', 'true');
    });
  });
});
