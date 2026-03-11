import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { mockMultipleApiRequests } from '@department-of-veterans-affairs/platform-testing/helpers';
import reducers from '../../../reducers';
import TrashButton from '../../../components/MessageActionButtons/TrashButton';

describe('TrashButton component', () => {
  const threadId = 1234567;
  const messageId = 7155731;
  const activeFolder = {
    folderId: 0,
    name: 'Inbox',
    count: 55,
    unreadCount: 41,
    systemFolder: true,
  };

  const initialState = {
    sm: {
      threads: {
        threadSort: {
          page: 1,
          value: 'sentDate',
        },
      },
      folders: {
        folder: activeFolder,
        folderList: [],
      },
    },
  };

  const setup = (props = {}, state = initialState) => {
    const defaultProps = {
      activeFolder,
      messageId,
      threadId,
      visible: true,
      ...props,
    };

    return renderWithStoreAndRouter(<TrashButton {...defaultProps} />, {
      initialState: state,
      reducers,
      path: `/thread/${threadId}`,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays Trash button text when visible', () => {
    const screen = setup();
    expect(screen.getByTestId('trash-button-text')).to.exist;
    expect(screen.getByText('Trash')).to.exist;
  });

  it('does not render when visible is false', () => {
    const screen = setup({ visible: false });
    expect(screen.queryByText('Trash')).to.not.exist;
  });

  it('renders the trash button with correct id', () => {
    const { container } = setup();
    const trashBtn = container.querySelector('#trash-button');
    expect(trashBtn).to.exist;
  });

  it('renders a va-icon with delete icon', () => {
    const { container } = setup();
    const icon = container.querySelector('va-icon[icon="delete"]');
    expect(icon).to.exist;
  });

  it('opens the delete confirmation modal when Trash button is clicked', () => {
    const { container } = setup();
    const trashBtn = container.querySelector('#trash-button');
    fireEvent.click(trashBtn);
    const modal = container.querySelector('#delete-message-modal');
    expect(modal).to.exist;
    expect(modal).to.have.attribute('visible', 'true');
  });

  it('closes the modal when onClose is triggered via close event', async () => {
    const { container } = setup();
    const trashBtn = container.querySelector('#trash-button');
    fireEvent.click(trashBtn);

    const modal = container.querySelector('#delete-message-modal');
    expect(modal).to.exist;

    // Trigger close event on VaModal
    modal.__events.closeEvent();

    await waitFor(() => {
      expect(container.querySelector('#delete-message-modal')).to.not.exist;
    });
  });

  it('calls handleDeleteMessageConfirm when delete is confirmed', async () => {
    mockMultipleApiRequests([
      { response: {}, shouldResolve: true },
      { response: { data: [] }, shouldResolve: true },
    ]);
    const { container } = setup();
    const trashBtn = container.querySelector('#trash-button');
    fireEvent.click(trashBtn);

    const modal = container.querySelector('#delete-message-modal');
    expect(modal).to.exist;

    // Trigger the primary button click (delete confirmation)
    modal.__events.primaryButtonClick();

    await waitFor(() => {
      expect(container.querySelector('#delete-message-modal')).to.not.exist;
    });
  });

  it('closes the modal via secondary button click', async () => {
    const { container } = setup();
    const trashBtn = container.querySelector('#trash-button');
    fireEvent.click(trashBtn);

    const modal = container.querySelector('#delete-message-modal');
    expect(modal).to.exist;

    // Trigger the secondary button click (cancel)
    modal.__events.secondaryButtonClick();

    await waitFor(() => {
      expect(container.querySelector('#delete-message-modal')).to.not.exist;
    });
  });

  it('uses DefaultFolders.INBOX.id when activeFolder is null', async () => {
    mockMultipleApiRequests([
      { response: {}, shouldResolve: true },
      { response: { data: [] }, shouldResolve: true },
    ]);
    const { container, history } = setup({ activeFolder: null });
    const trashBtn = container.querySelector('#trash-button');
    expect(trashBtn).to.exist;
    fireEvent.click(trashBtn);

    const modal = container.querySelector('#delete-message-modal');
    expect(modal).to.exist;

    modal.__events.primaryButtonClick();

    await waitFor(() => {
      expect(history.location.pathname).to.equal('/inbox/');
    });
  });
});
