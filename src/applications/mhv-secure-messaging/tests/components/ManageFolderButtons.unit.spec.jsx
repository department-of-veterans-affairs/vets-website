import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import folders from '../fixtures/folder-inbox-response.json';
import folderList from '../fixtures/folder-response.json';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import ManageFolderButtons from '../../components/ManageFolderButtons';
import * as foldersActions from '../../actions/folders';

describe('Manage Folder Buttons component', () => {
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
    const deleteFolderSpy = sinon.spy(foldersActions, 'delFolder');
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

  it("displays inline edit form when 'Edit folder' button is clicked", async () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('edit-folder-button'));

    const editForm = screen.getByTestId('edit-folder-form');
    expect(editForm).to.exist;
    fireEvent.click(screen.getByTestId('cancel-edit-folder-button'));
    expect(screen.queryByTestId('edit-folder-form')).to.not.exist;
  });

  it('Edit form shows error for blank folder name', async () => {
    const screen = renderWithStoreAndRouter(
      <ManageFolderButtons folder={folder} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('edit-folder-button'));

    await waitFor(() => {
      expect(screen.getByTestId('edit-folder-form')).to.exist;
    });

    const editForm = screen.getByTestId('edit-folder-form');
    const input = editForm.querySelector('va-text-input');

    // Clear the input to simulate blank folder name
    input.value = '';
    fireEvent(
      input,
      new CustomEvent('input', { detail: { value: '' }, bubbles: true }),
    );

    const saveButton = screen.getByTestId('save-edit-folder-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(input.getAttribute('error')).to.equal(
        'Folder name cannot be blank',
      );
    });
  });

  it.skip('test', async () => {
    const existingFolderName = folderList.slice(-1)[0].name;
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ManageFolderButtons folder={folder} />
      </Provider>,
    );

    const editButton = wrapper.find('button[data-testid="edit-folder-button"]');
    editButton.simulate('click');
    const input = wrapper.find('va-text-input');
    input.invoke('onInput')({
      target: { value: existingFolderName },
    });
    const saveButton = wrapper.find('va-button[text="Save"]');
    saveButton.simulate('click');
    expect(wrapper.find('va-text-input').prop('error')).to.equal(
      'Folder name already in use. Please use another name.',
    );
  });
});
