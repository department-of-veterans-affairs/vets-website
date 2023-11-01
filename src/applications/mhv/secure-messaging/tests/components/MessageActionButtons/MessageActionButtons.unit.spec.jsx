import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
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
    fireEvent.click(printButton);
    const printModal = screen.getByTestId('print-modal-popup');
    await waitFor(() => {
      expect(printModal).to.have.attribute('visible', 'true');
    });

    expect(printModal).to.have.attribute(
      'modaltitle',
      'What do you want to print?',
    );
  });

  it('print button must display an error if no option is selected', () => {
    const screen = setup();
    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);
    fireEvent.click(document.querySelector('va-button[text="Print"]'));
    expect(document.querySelector('va-radio').getAttribute('error')).to.equal(
      'Please select an option to print.',
    );
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
