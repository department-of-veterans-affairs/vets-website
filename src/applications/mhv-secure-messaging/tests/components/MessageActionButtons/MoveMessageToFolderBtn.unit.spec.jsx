import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { cleanup } from '@testing-library/react';
import sinon from 'sinon';
import {
  mockApiRequest,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import reducers from '~/applications/mhv-secure-messaging/reducers';
import folderResponse from '../../fixtures/folder-response.json';
import folderInboxResponse from '../../fixtures/folder-inbox-response.json';
import MoveMessageToFolderBtn from '../../../components/MessageActionButtons/MoveMessageToFolderBtn';
import * as Constants from '../../../util/constants';
import { DefaultFolders } from '../../../util/constants';
import { selectVaRadio } from '../../../util/testUtils';
import newFolderResponse from '../../e2e/fixtures/customResponse/created-folder-response.json';

describe('Move button', () => {
  const folderName = folderInboxResponse.inbox.name || 'Inbox';
  const activeFolder = {
    folderId: folderResponse[folderResponse.length - 1].id,
    ...folderResponse[folderResponse.length - 1],
  };

  const id = 7155731;
  const threadId = 1234567;
  
  let setIsCreateNewModalVisibleSpy;
  let isCreateNewModalVisible;

  beforeEach(() => {
    setIsCreateNewModalVisibleSpy = sinon.spy();
    isCreateNewModalVisible = false;
  });

  const initialState = {
    sm: {
      folders: {
        folder: {
          folderId: 0,
          name: folderName,
          count: 55,
          unreadCount: 41,
          systemFolder: true,
        },
        folderList: folderResponse,
      },
    },
  };

  const setup = (props = {}) => {
    const defaultProps = {
      activeFolder,
      key: 'moveMessageToFolderBtn',
      isVisible: true,
      threadId,
      messageId: id,
      allFolders: folderResponse,
      setIsCreateNewModalVisible: setIsCreateNewModalVisibleSpy,
      isCreateNewModalVisible,
      ...props,
    };

    return renderWithStoreAndRouter(
      <MoveMessageToFolderBtn {...defaultProps} />,
      {
        initialState,
        reducers,
        path: `/thread/${id}`,
      },
    );
  };

  afterEach(() => {
    cleanup();
    sinon.restore();
  });

  it('renders without errors, and displays the move button', async () => {
    const screen = setup();
    expect(screen.getByText(/Move/)).to.exist;
  });

  it('does not render when isVisible is false', () => {
    const { container } = setup({ isVisible: false });
    expect(container.firstChild).to.be.null;
  });

  it('displays Move button text, but not modal', async () => {
    const screen = setup();
    expect(screen).to.exist;
    expect(await screen.getByTestId('move-button-text')).to.exist;

    expect(
      screen.queryByText(
        'Any replies to this message will appear in your inbox',
      ),
    ).not.to.exist;
  });

  it('opens modal when Move button is clicked and displays modal text, and correct number of list of folders', async () => {
    const screen = setup();
    fireEvent.click(await screen.getByTestId('move-button-text'));
    expect(
      screen.getByText(
        'Any replies to this message will appear in your inbox.',
      ),
    ).to.exist;
    expect(screen.getByTestId('move-to-modal')).to.exist;

    const selectFolderRadio = screen.getByTestId('select-folder-radio-group');
    expect(selectFolderRadio).to.have.attribute('label', 'Select a folder');

    const listOfFolders = screen.queryAllByTestId(/radiobutton-*/);

    // Test should print 4 folders (inbox is not included in dropdown list)
    const renderedFolders = listOfFolders.map(el => el.value);
    const expectedFolders = folderResponse
      .filter(
        folder =>
          folder.id !== activeFolder.folderId &&
          folder.id !== DefaultFolders.DRAFTS.id &&
          folder.id !== DefaultFolders.SENT.id,
      )
      .map(folder => folder.id);

    expect(renderedFolders).to.deep.equal(expectedFolders);
  });

  it('closes modal when Cancel button is clicked', async () => {
    const screen = setup();
    fireEvent.click(await screen.getByText('Move'));
    expect(document.querySelector('va-modal')).to.have.attribute(
      'visible',
      'true',
    );

    const cancelButton = document.querySelector('va-button[text="Cancel"]');
    expect(cancelButton).to.exist;
    fireEvent.click(cancelButton);
    expect(document.querySelector('va-modal[modaltitle="Move to"]')).to.not
      .exist;
  });

  it('changes value on radio button selection', async () => {
    const screen = setup();
    const folder = folderResponse[0];
    fireEvent.click(screen.getByText('Move'));
    expect(screen.getByTestId('radiobutton-Inbox')).to.exist;

    await waitFor(() => {
      selectVaRadio(screen.container, '0');
      expect(
        document.querySelector(`va-radio-option[value="${folder.id}"]`),
      ).to.have.attribute('checked', 'true');
    });
    mockApiRequest({ status: 204, method: 'PATCH' });
    fireEvent.click(document.querySelector('va-button[text="Confirm"]'));
    expect(document.querySelector('va-modal[modaltitle="Move to"]')).to.not
      .exist;
  });

  it('displays an error when folder is not selected', async () => {
    const screen = setup();
    fireEvent.click(screen.getByText('Move'));
    screen.getByTestId('radiobutton-Inbox');
    fireEvent.click(document.querySelector('va-button[text="Confirm"]'));
    expect(document.querySelector('va-radio')).to.have.attribute(
      'error',
      Constants.ErrorMessages.MoveConversation.FOLDER_REQUIRED,
    );
  });

  it('displays Create New Folder modal on valid new folder value selection', async () => {
    const screen = setup();

    fireEvent.click(screen.getByText('Move'));
    screen.getByTestId('radiobutton-Inbox');

    await waitFor(() => {
      selectVaRadio(screen.container, 'newFolder');
      expect(
        document.querySelector(`va-radio-option[value="newFolder"]`),
      ).to.have.attribute('checked', 'true');
    });
    fireEvent.click(document.querySelector('va-button[text="Confirm"]'));
    expect(
      document.querySelector('va-modal[modal-title="Create a new folder"]'),
    ).to.have.attribute(
      'modal-title',
      Constants.Alerts.Folder.CREATE_FOLDER_MODAL_HEADER,
    );

    const newFolderName = 'New Folder name';
    inputVaTextInput(screen.container, newFolderName);

    expect(document.querySelector(`va-text-input[value="${newFolderName}"]`)).to
      .exist;

    const createButton = document.querySelector('va-button[text="Create"]');
    mockApiRequest(newFolderResponse);
    fireEvent.click(createButton);
  });

  it('displays errors in Create New Folder modal on invalid value selections', async () => {
    const { container, getByTestId, getByText } = setup();

    fireEvent.click(getByText('Move'));
    getByTestId('radiobutton-Inbox');

    await waitFor(() => {
      selectVaRadio(container, 'newFolder');
    });
    fireEvent.click(container.querySelector('va-button[text="Confirm"]'));

    const createButton = container.querySelector('va-button[text="Create"]');
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(container.querySelector('va-text-input')).to.have.attribute(
        'error',
        Constants.Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
      );
    });

    const newFolderName = folderResponse[0].name;
    inputVaTextInput(container, newFolderName);

    fireEvent.click(createButton);
    await waitFor(() => {
      expect(container.querySelector('va-text-input')).to.have.attribute(
        'error',
        Constants.Alerts.Folder.CREATE_FOLDER_ERROR_EXSISTING_NAME,
      );
    });

    inputVaTextInput(container, '&');

    fireEvent.click(createButton);
    await waitFor(() => {
      expect(container.querySelector('va-text-input')).to.have.attribute(
        'error',
        Constants.Alerts.Folder.CREATE_FOLDER_ERROR_CHAR_TYPE,
      );
    });
  });

  it('has correct button attributes and styling', () => {
    const screen = setup();
    const button = screen.container.querySelector('#move-button');
    expect(button).to.exist;
    expect(button).to.have.attribute('type', 'button');
    expect(button).to.have.class('usa-button-secondary');
    expect(button).to.have.class('mobile-lg:vads-u-flex--3');
    expect(button).to.have.class('vads-u-display--flex');
    expect(button).to.have.class('message-action-button');
    expect(button).to.have.attribute('data-dd-action-name', 'Move Button');
  });

  it('contains va-icon with correct icon', () => {
    const screen = setup();
    const icon = screen.container.querySelector('va-icon[icon="folder"]');
    expect(icon).to.exist;
    expect(icon).to.have.attribute('aria-hidden', 'true');
  });

  it('handles missing allFolders prop', () => {
    const screen = setup({ allFolders: null });
    expect(screen).to.exist;
    expect(screen.getByText('Move')).to.exist;
  });

  it('handles empty allFolders array', () => {
    const screen = setup({ allFolders: [] });
    expect(screen).to.exist;
    expect(screen.getByText('Move')).to.exist;
  });

  it('handles missing activeFolder prop', () => {
    const screen = setup({ activeFolder: null });
    expect(screen).to.exist;
    expect(screen.getByText('Move')).to.exist;
  });

  it('filters out current folder, drafts, and sent folders from list', () => {
    const screen = setup();
    fireEvent.click(screen.getByTestId('move-button-text'));
    
    const listOfFolders = screen.queryAllByTestId(/radiobutton-*/);
    const renderedFolderIds = listOfFolders.map(el => el.value);
    
    // Should not include current folder, drafts, or sent
    expect(renderedFolderIds).to.not.include(activeFolder.folderId);
    expect(renderedFolderIds).to.not.include(DefaultFolders.DRAFTS.id);
    expect(renderedFolderIds).to.not.include(DefaultFolders.SENT.id);
  });

  it('modal has correct title and attributes', () => {
    const screen = setup();
    fireEvent.click(screen.getByTestId('move-button-text'));
    
    const modal = screen.getByTestId('move-to-modal');
    expect(modal).to.have.attribute('modal-title', 'Move conversation');
    expect(modal).to.have.attribute('data-dd-action-name', 'Move Conversation Modal');
  });

  it('radio group has required and enable-analytics attributes', () => {
    const screen = setup();
    fireEvent.click(screen.getByTestId('move-button-text'));
    
    const radioGroup = screen.getByTestId('select-folder-radio-group');
    expect(radioGroup).to.have.attribute('required');
    expect(radioGroup).to.have.attribute('enable-analytics');
    expect(radioGroup).to.have.attribute('data-dd-action-name', 'Select Move to Radio Button');
  });

  it('handles missing threadId prop', () => {
    const screen = setup({ threadId: null });
    expect(screen).to.exist;
    expect(screen.getByText('Move')).to.exist;
  });

  it('handles missing setIsCreateNewModalVisible prop', () => {
    const screen = setup({ setIsCreateNewModalVisible: null });
    expect(screen).to.exist;
    expect(screen.getByText('Move')).to.exist;
  });

  it('displays correct help text in modal', () => {
    const screen = setup();
    fireEvent.click(screen.getByTestId('move-button-text'));
    
    expect(screen.getByText('Any replies to this message will appear in your inbox.')).to.exist;
  });

  it('button text container has correct styling', () => {
    const screen = setup();
    const buttonText = screen.getByTestId('move-button-text');
    expect(buttonText).to.have.class('message-action-button-text');
  });

  it('icon container has correct margin class', () => {
    const screen = setup();
    const iconContainer = screen.container.querySelector('.vads-u-margin-right--0p5');
    expect(iconContainer).to.exist;
    expect(iconContainer.querySelector('va-icon')).to.exist;
  });
});
