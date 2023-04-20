import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import messages from '../fixtures/search-response.json';
import folder from '../fixtures/folder-inbox-metadata.json';
import reducer from '../../reducers';
import FolderListView from '../../containers/FolderListView';

describe('FolderListView', () => {
  const initialState = {
    sm: {
      folders: { folder },
      messages: {
        messageList: messages,
      },
      search: {
        keyword: '',
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<FolderListView testing />, {
      initialState: state,
      reducers: reducer,
      path: `/`,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Inbox', { exact: true, selector: 'h1' })).to.exist;
  });

  it('displays loading indicator when messages are not yet loaded', () => {
    const state = {
      sm: {
        folders: { folder: undefined },
        messages: {
          messageList: undefined,
        },
        search: {
          keyword: '',
        },
      },
    };
    const screen = setup(state);
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
  });
});
