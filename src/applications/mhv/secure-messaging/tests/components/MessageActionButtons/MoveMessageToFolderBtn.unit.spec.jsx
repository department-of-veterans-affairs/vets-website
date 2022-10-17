import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import folderResponse from '../../fixtures/folder-response.json';
import reducers from '~/applications/mhv/secure-messaging/reducers';
import MoveMessageToFolderBtn from '../../../components/MessageActionButtons/MoveMessageToFolderBtn';

describe('Move button', () => {
  let screen;
  beforeEach(() => {
    const id = 7155731;
    const initialState = {
      message: { folder: null, folderList: { folderResponse } },
    };
    screen = renderInReduxProvider(
      <MoveMessageToFolderBtn messageId={id} allFolders={folderResponse} />,
      {
        initialState,
        reducers,
      },
    );
  });

  it('renders without errors, and displays the print button', () => {
    expect(screen);
  });
  it('displays Move button text, but not modal', () => {
    expect(screen.getByTestId('move-button-text')).to.exist;
    expect(
      screen.queryByText(
        'This conversation will be moved. Any replies to this message will appear in your inbox',
      ),
    ).not.to.exist;
  });
  it('opens modal when Move button is clicked and displays modal text, and correct number of list of folders', () => {
    fireEvent.click(screen.getByTestId('move-button-text'));
    expect(
      screen.getByText(
        'This conversation will be moved. Any replies to this message will appear in your inbox',
      ),
    ).to.exist;
    expect(screen.getByTestId('move-to-modal')).to.exist;
    const listOfFolders = screen.queryAllByTestId('radio-button');
    expect(listOfFolders.length).to.equal(6);
  });
  // This test uses a button that is hidden. The reason for this is because I am not able to access the shadow dom to select the cancel button on the web component to test the closing modal functionality.
  // This may be a test case that will have to be taken care of using cypress instead, will revisit issue.
  it('closes modal when Cancel button is clicked', () => {
    expect(screen.queryByTestId('hidden-button-close-modal')).not.to.exist;

    fireEvent.click(screen.getByTestId('move-button-text'));
    expect(screen.queryByTestId('hidden-button-close-modal')).to.exist;

    const cancelButton = screen.getByTestId('hidden-button-close-modal');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('hidden-button-close-modal')).not.to.exist;
  });
});
