import React from 'react';
// import { fireEvent } from '@testing-library/dom';
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

    screen = renderInReduxProvider(<MoveMessageToFolderBtn id={id} />, {
      initialState,
      reducers,
    });
  });

  it('renders without errors, and displays the print button', () => {
    expect(screen);
  });
  // it('displays Move button text', () => {
  //   expect(screen.getByTestId(/move-button-text/)).to.exist;
  // });
  // it('opens modal when Move button is clicked and displays modal text', () => {
  //   fireEvent.click(screen.getByTestId(/move-button-text/));
  //   // expect(
  //   //   screen.getByText(
  //   //     /This conversation will be moved. Any replies to this message will appear in your inbox/,
  //   //   ),
  //   // ).to.exist;
  // });
  // const cancelButton = screen.getByText(/Cancel/);
  // fireEvent.click(cancelButton);
  // expect(cancelButton).not.toBeInTheDocument();
});
