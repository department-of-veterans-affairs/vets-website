import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { cleanup } from '@testing-library/react';
import folderResponse from '../../fixtures/folder-response.json';
import folderInboxResponse from '../../fixtures/folder-inbox-response.json';
import reducers from '~/applications/mhv/secure-messaging/reducers';
import MoveMessageToFolderBtn from '../../../components/MessageActionButtons/MoveMessageToFolderBtn';
import { DefaultFolders } from '../../../util/constants';

describe('Move button', () => {
  let container;
  const folderName = folderInboxResponse.inbox.name || 'Inbox';
  const activeFolder = {
    folderId: folderResponse[folderResponse.length - 1].id,
    ...folderResponse[folderResponse.length - 1],
  };

  beforeEach(() => {
    const id = 7155731;
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

    container = renderInReduxProvider(
      <MoveMessageToFolderBtn
        activeFolder={activeFolder}
        key="moveMessageToFolderBtn"
        isVisible
        messageId={id}
        allFolders={folderResponse}
      />,
      {
        initialState,
        reducers,
      },
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without errors, and displays the move button', () => {
    expect(container.getByText(/Move/)).to.exist;
  });

  it('displays Move button text, but not modal', () => {
    expect(container).to.exist;
    expect(container.getByTestId('move-button-text')).to.exist;
    expect(
      container.queryByText(
        'This conversation will be moved. Any replies to this message will appear in your inbox',
      ),
    ).not.to.exist;
  });
  it('opens modal when Move button is clicked and displays modal text, and correct number of list of folders', () => {
    fireEvent.click(container.getByTestId('move-button-text'));
    expect(
      container.getByText(
        'This conversation will be moved. Any replies to this message will appear in your inbox',
      ),
    ).to.exist;
    expect(container.getByTestId('move-to-modal')).to.exist;

    const listOfFolders = container.queryAllByTestId(/radiobutton-*/);

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
  // This test uses a button that is hidden. The reason for this is because I am not able to access the shadow dom to select the cancel button on the web component to test the closing modal functionality.
  // This may be a test case that will have to be taken care of using cypress instead, will revisit issue.
  // it.only('closes modal when Cancel button is clicked', () => {
  //   expect(screen.queryByText('Cancel')).not.to.exist;
  //   fireEvent.click(screen.getByText('Move'));
  //   screen.debug();
  //   const modal = screen.getByTestId('move-to-modal');
  //   console.log(modal.getAttribute('onPrimaryButtonClick'));
  //   // expect(modal.getAttribut).to.exist;
  //   const cancelButton = screen.getByTestId('hidden-button-close-modal');
  //   fireEvent.click(cancelButton);
  //   expect(screen.queryByTestId('hidden-button-close-modal')).not.to.exist;
  // });
});
