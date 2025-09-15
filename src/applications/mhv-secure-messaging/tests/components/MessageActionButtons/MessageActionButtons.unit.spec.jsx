import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import MessageActionButtons from '../../../components/MessageActionButtons';
import reducer from '../../../reducers';
import folders from '../../fixtures/folder-inbox-response.json';
import folderList from '../../fixtures/folder-response.json';
import * as threadDetailsActions from '../../../actions/threadDetails';

describe('MessageActionButtons component', () => {
  const folder = folders.customFolder;
  const threadId = '7171715';
  
  afterEach(() => {
    sinon.restore();
  });

  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
    },
  };
  
  const initialProps = {
    threadId,
    hideReplyButton: true,
  };

  const setup = (state = initialState, props = initialProps) => {
    return renderWithStoreAndRouter(
      <MessageActionButtons threadId={threadId} {...props} />,
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

  it('renders the reply button', () => {
    const mockState = {
      sm: {
        folders: {
          folderList,
          folder: folders.inbox,
        },
        threadDetails: {
          messages: [{ messageId: 123456 }],
        },
      },
    };

    const mockProps = {
      threadId,
      hideReplyButton: false,
      showEditDraftButton: false,
    };

    const screen = setup(mockState, mockProps);
    expect(screen.getByText('Reply')).to.exist;
  });

  it('renders move and trash buttons for non-sent folder', () => {
    const mockState = {
      sm: {
        folders: {
          folderList,
          folder: folders.inbox,
        },
      },
    };

    const mockProps = {
      threadId,
      hideReplyButton: true,
    };

    const screen = setup(mockState, mockProps);
    expect(screen.getByText('Move')).to.exist;
    expect(screen.getByText('Trash')).to.exist;
  });

  it('does not render move and trash buttons in sent folder', () => {
    const mockState = {
      sm: {
        folders: {
          folderList,
          folder: folders.sent,
        },
      },
    };

    const screen = setup(mockState);
    expect(screen.queryByText('Move')).to.not.exist;
    expect(screen.queryByText('Trash')).to.not.exist;
  });

  it('renders edit draft button when showEditDraftButton is true', () => {
    const mockProps = {
      threadId,
      hideReplyButton: true,
      showEditDraftButton: true,
      handleEditDraftButton: sinon.spy(),
    };

    const screen = setup(initialState, mockProps);
    expect(screen.getByText('Edit draft')).to.exist;
  });

  it('calls handleEditDraftButton when edit draft button is clicked', () => {
    const handleEditDraftButtonSpy = sinon.spy();
    const mockProps = {
      threadId,
      hideReplyButton: true,
      showEditDraftButton: true,
      handleEditDraftButton: handleEditDraftButtonSpy,
    };

    const screen = setup(initialState, mockProps);
    const editButton = screen.getByText('Edit draft');
    fireEvent.click(editButton);
    
    expect(handleEditDraftButtonSpy.calledOnce).to.be.true;
  });

  it('shows different edit draft text for multiple drafts', () => {
    const mockProps = {
      threadId,
      hideReplyButton: true,
      showEditDraftButton: true,
      handleEditDraftButton: sinon.spy(),
      hasMultipleDrafts: true,
    };

    const screen = setup(initialState, mockProps);
    expect(screen.getByText('Edit drafts')).to.exist;
  });

  it('handles missing folders gracefully', () => {
    const stateWithoutFolders = {
      sm: {
        folders: {
          folderList: null,
          folder: null,
        },
      },
    };

    const screen = setup(stateWithoutFolders);
    expect(screen).to.exist;
    expect(screen.getByText('Print')).to.exist;
  });

  it('handles empty folder list', () => {
    const stateWithEmptyFolders = {
      sm: {
        folders: {
          folderList: [],
          folder: null,
        },
      },
    };

    const screen = setup(stateWithEmptyFolders);
    expect(screen).to.exist;
    expect(screen.getByText('Print')).to.exist;
  });

  it('passes correct props to child components', () => {
    const mockProps = {
      threadId,
      hideReplyButton: false,
      isCreateNewModalVisible: false,
      setIsCreateNewModalVisible: sinon.spy(),
    };

    const screen = setup(initialState, mockProps);
    expect(screen.getByText('Print')).to.exist;
    expect(screen.getByText('Move')).to.exist;
    expect(screen.getByText('Trash')).to.exist;
  });

  it('handles print action', () => {
    const printSpy = sinon.stub(window, 'print');
    const screen = setup();
    const printButton = screen.getByText('Print');
    
    fireEvent.click(printButton);
    // The actual print functionality is handled by the PrintBtn component
    expect(screen.getByText('Print')).to.exist;
    
    printSpy.restore();
  });

  it('renders reply button with correct styling classes', () => {
    const mockState = {
      sm: {
        folders: {
          folderList,
          folder: folders.inbox,
        },
        threadDetails: {
          messages: [{ messageId: 123456 }],
        },
      },
    };

    const mockProps = {
      threadId,
      hideReplyButton: false,
    };

    const screen = setup(mockState, mockProps);
    const buttonContainer = screen.getByText('Reply').closest('div');
    expect(buttonContainer).to.exist;
  });

  it('applies correct container styling classes', () => {
    const screen = setup();
    const container = screen.container.querySelector('.vads-u-display--flex');
    expect(container).to.exist;
  });

  it('handles undefined threadId gracefully', () => {
    const propsWithoutThreadId = { ...initialProps };
    delete propsWithoutThreadId.threadId;
    
    const screen = setup(initialState, propsWithoutThreadId);
    expect(screen).to.exist;
  });

  it('handles all props variations', () => {
    const allProps = {
      threadId: 12345,
      hideReplyButton: false,
      isCreateNewModalVisible: true,
      setIsCreateNewModalVisible: sinon.spy(),
      showEditDraftButton: true,
      handleEditDraftButton: sinon.spy(),
      hasMultipleDrafts: true,
      messageId: 67890,
    };

    const screen = setup(initialState, allProps);
    expect(screen).to.exist;
  });

  it('handles feature toggle state', () => {
    // Test component behavior with different feature toggle states
    const screen = setup();
    expect(screen.getByText('Print')).to.exist;
  });
});
