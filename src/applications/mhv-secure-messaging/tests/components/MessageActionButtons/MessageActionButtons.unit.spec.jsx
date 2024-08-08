import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import MessageActionButtons from '../../../components/MessageActionButtons';
import reducer from '../../../reducers';
import folders from '../../fixtures/folder-inbox-response.json';
import folderList from '../../fixtures/folder-response.json';

describe('MessageActionButtons component', () => {
  const folder = folders.customFolder;
  const threadId = '7171715';
  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <MessageActionButtons threadId={threadId} />,
      {
        initialState: state,
        reducers: reducer,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders the print button', async () => {
    const screen = setup();
    const printButton = screen.getByText('Print');
    expect(printButton).to.exist;
  });

  it('renders in Sent folder', () => {
    const mockState = {
      sm: {
        folders: {
          folderList,
          folder: folders.sent,
        },
      },
    };

    const screen = setup(mockState);
    expect(screen.getByText('Print')).to.exist;
    expect(screen.queryByText('Move')).to.not.exist;
    expect(screen.queryByText('Trash')).to.not.exist;
  });
});
