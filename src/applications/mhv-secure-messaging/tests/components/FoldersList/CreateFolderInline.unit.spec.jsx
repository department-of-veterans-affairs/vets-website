import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import { datadogRum } from '@datadog/browser-rum';
import * as recordEventModule from 'platform/monitoring/record-event';
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
    sandbox.stub(datadogRum, 'addAction');
    sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      folders: folderList,
      onConfirm: sandbox.stub().resolves(),
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
    const { getByTestId, queryByTestId } = setup();
    expect(getByTestId('create-new-folder')).to.exist;
    expect(queryByTestId('create-folder-inline')).to.be.null;
  });

  it('expands inline form when "Create new folder" button is clicked', async () => {
    const { getByTestId } = setup();

    const createNewFolderBtn = getByTestId('create-new-folder');
    fireEvent.click(createNewFolderBtn);

    await waitFor(() => {
      expect(getByTestId('create-folder-inline')).to.exist;
      expect(getByTestId('folder-name')).to.exist;
      expect(getByTestId('create-folder-button')).to.exist;
      expect(getByTestId('cancel-folder-button')).to.exist;
    });
  });

  it('records analytics event and Datadog action when expanded', async () => {
    const { getByTestId } = setup();

    fireEvent.click(getByTestId('create-new-folder'));

    await waitFor(() => {
      expect(recordEventModule.default.calledOnce).to.be.true;
      expect(
        recordEventModule.default.calledWith({
          event: 'cta-button-click',
          'button-type': 'primary',
          'button-click-label': 'Create new folder',
        }),
      ).to.be.true;
      expect(
        datadogRum.addAction.calledWith('Create New Folder Inline Expanded'),
      ).to.be.true;
    });
  });

  it('collapses inline form when Cancel button is clicked', async () => {
    const { getByTestId, queryByTestId } = setup();

    // Expand the form
    fireEvent.click(getByTestId('create-new-folder'));
    expect(getByTestId('create-folder-inline')).to.exist;

    // Click cancel button
    const cancelBtn = document.querySelector('va-button[text="Cancel"]');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(queryByTestId('create-folder-inline')).to.be.null;
    });
  });

  it('records Datadog action when Cancel is clicked', async () => {
    const { getByTestId } = setup();

    fireEvent.click(getByTestId('create-new-folder'));
    const cancelBtn = document.querySelector('va-button[text="Cancel"]');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(
        datadogRum.addAction.calledWith('Create New Folder Inline Cancelled'),
      ).to.be.true;
    });
  });

  it('shows validation error when folder name is empty and Create is clicked', async () => {
    const { getByTestId } = setup();

    // Expand the form
    fireEvent.click(getByTestId('create-new-folder'));

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

  it('shows validation error when folder name is whitespace only', async () => {
    const { getByTestId, container } = setup();

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, '   ');

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

  it('shows validation error when folder name already exists', async () => {
    const existingFolderName = folderList[0].name;
    const { getByTestId, container } = setup();

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, existingFolderName);

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'error',
        Alerts.Folder.CREATE_FOLDER_ERROR_EXSISTING_NAME,
      );
    });
  });

  it('shows validation error when folder name contains invalid characters', async () => {
    const { getByTestId, container } = setup();

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'Invalid@Folder#Name!');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'error',
        Alerts.Folder.CREATE_FOLDER_ERROR_CHAR_TYPE,
      );
    });
  });

  it('calls onConfirm with folder name when valid name is submitted', async () => {
    const onConfirm = sandbox.stub().callsFake((name, callback) => callback());
    const onFolderCreated = sandbox.stub();
    const { getByTestId, container } = setup({ onConfirm, onFolderCreated });

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'New Valid Folder');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(onConfirm.calledOnce).to.be.true;
      expect(onConfirm.firstCall.args[0]).to.equal('New Valid Folder');
    });
  });

  it('calls onFolderCreated callback after successful folder creation', async () => {
    const onConfirm = sandbox.stub().callsFake((name, callback) => callback());
    const onFolderCreated = sandbox.stub();
    const { getByTestId, container } = setup({ onConfirm, onFolderCreated });

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'New Valid Folder');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(onFolderCreated.calledOnce).to.be.true;
      expect(onFolderCreated.calledWith('New Valid Folder')).to.be.true;
    });
  });

  it('does not call onFolderCreated if it is null', async () => {
    const onConfirm = sandbox.stub().callsFake((name, callback) => callback());
    const { getByTestId, container } = setup({
      onConfirm,
      onFolderCreated: null,
    });

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'New Valid Folder');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(onConfirm.calledOnce).to.be.true;
    });
    // No error should be thrown when onFolderCreated is null
  });

  it('resets form state after successful folder creation', async () => {
    const onConfirm = sandbox.stub().callsFake((name, callback) => callback());
    const { getByTestId, queryByTestId, container } = setup({ onConfirm });

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'New Valid Folder');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(queryByTestId('create-folder-inline')).to.be.null;
      expect(getByTestId('create-new-folder')).to.exist;
    });
  });

  it('clears error when user starts typing', async () => {
    const { getByTestId, container } = setup();

    fireEvent.click(getByTestId('create-new-folder'));

    // Create empty error first
    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'error',
        Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
      );
    });

    // Start typing to clear error
    inputVaTextInput(container, 'New Folder');

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute('error', '');
    });
  });

  it('sets error when input value is cleared', async () => {
    const { getByTestId, container } = setup();

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'Some Folder');

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute('error', '');
    });

    // Clear the input
    inputVaTextInput(container, '');

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute(
        'error',
        Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
      );
    });
  });

  it('displays text input with proper attributes for folder name entry', async () => {
    const { getByTestId } = setup();

    // Expand the form
    fireEvent.click(getByTestId('create-new-folder'));

    await waitFor(() => {
      const textInput = document.querySelector('va-text-input');
      expect(textInput).to.have.attribute('label', 'Folder name');
      expect(textInput).to.have.attribute('maxlength', '50');
      expect(textInput).to.have.attribute('charcount', 'true');
      expect(textInput).to.have.attribute('data-dd-privacy', 'mask');
    });
  });

  it('allows text input value to be set', async () => {
    const { getByTestId, container } = setup();

    // Expand and enter a valid new name
    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'My New Folder');

    await waitFor(() => {
      expect(document.querySelector('va-text-input[value="My New Folder"]')).to
        .exist;
    });
  });

  it('renders Create and Cancel buttons with correct text', async () => {
    const { getByTestId } = setup();

    fireEvent.click(getByTestId('create-new-folder'));

    await waitFor(() => {
      const createBtn = document.querySelector('va-button[text="Create"]');
      const cancelBtn = document.querySelector('va-button[text="Cancel"]');
      expect(createBtn).to.exist;
      expect(cancelBtn).to.exist;
      expect(cancelBtn).to.have.attribute('secondary', 'true');
    });
  });

  it('accepts alphanumeric folder names with spaces', async () => {
    const onConfirm = sandbox.stub().callsFake((name, callback) => callback());
    const { getByTestId, container } = setup({ onConfirm });

    fireEvent.click(getByTestId('create-new-folder'));
    inputVaTextInput(container, 'My Folder 123');

    const createBtn = document.querySelector('va-button[text="Create"]');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(onConfirm.calledOnce).to.be.true;
      expect(onConfirm.firstCall.args[0]).to.equal('My Folder 123');
    });
  });
});
