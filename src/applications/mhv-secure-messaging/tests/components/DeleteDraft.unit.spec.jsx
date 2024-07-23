import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { Router } from 'react-router-dom';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import { createTestHistory } from 'platform/testing/unit/helpers';

import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import DeleteDraft from '../../components/Draft/DeleteDraft';
import { drafts, inbox, sent } from '../fixtures/folder-inbox-response.json';
import thread from '../fixtures/reducers/thread-with-multiple-drafts-reducer.json';
import reducer from '../../reducers';
import { Prompts } from '../../util/constants';

describe('Delete Draft component', () => {
  // This renderWithStoreAndRouter function is a replica function from the /platform-testing/react-testing-library-helpers
  // file, the only difference is that 'store' is returned and used to mock the dispatch function in the tests.
  // **Special permissions may be needed to alter the /platform-testing/react-testing-library-helpers file.
  function renderWithStoreAndRouter(
    ui,
    { initialState, reducers = {}, store = null, path = '/', history = null },
  ) {
    const testStore =
      store ||
      createStore(
        combineReducers({ ...commonReducer, ...reducers }),
        initialState,
        applyMiddleware(thunk),
      );

    const historyObject = history || createTestHistory(path);
    const screen = renderInReduxProvider(
      <Router history={historyObject}>{ui}</Router>,
      {
        store: testStore,
        initialState,
        reducers,
      },
    );

    return { ...screen, history: historyObject, store: testStore };
  }

  let setIsModalVisibleSpy;
  let setNavigationErrorSpy;
  let setIsEditingSpy;
  let setHideDraftSpy;
  let refreshThreadCallbackSpy;
  let unsavedDeleteSuccessfulSpy;
  let dispatchSpy;

  beforeEach(() => {
    setIsModalVisibleSpy = sinon.spy();
    setNavigationErrorSpy = sinon.spy();
    setIsEditingSpy = sinon.spy();
    setHideDraftSpy = sinon.spy();
    refreshThreadCallbackSpy = sinon.spy();
    unsavedDeleteSuccessfulSpy = sinon.spy();
    dispatchSpy = sinon.spy();
  });

  it('handles saved draft and navigates correctly for /new-message', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
      },
    };

    const props = {
      draftId: 123456,
      draftsCount: 1,
      savedDraft: true,
      unsavedDraft: false,
      activeFolder: { folderId: '1' },
      location: { pathname: '/new-message' },
      history: { goBack: sinon.spy() },
    };

    const { getByTestId, history } = renderWithStoreAndRouter(
      <DeleteDraft
        {...props}
        setIsModalVisible={setIsModalVisibleSpy}
        setNavigationError={setNavigationErrorSpy}
        setIsEditing={setIsEditingSpy}
        setHideDraft={setHideDraftSpy}
        refreshThreadCallback={refreshThreadCallbackSpy}
        unsavedDeleteSuccessful={unsavedDeleteSuccessfulSpy}
      />,
      { initialState, reducers: reducer, path: '/new-message' },
    );

    fireEvent.click(getByTestId('delete-draft-button'));
    fireEvent.click(getByTestId('confirm-delete-draft'));

    await waitFor(() => {
      expect(setIsModalVisibleSpy.calledOnce).to.be.false;
      // expect(dispatchSpy.calledOnce).to.be.true;
      expect(history.location.pathname).to.equal('/new-message');
    });
  });

  it('renders without errors', async () => {
    const draft = thread.threadDetails.drafts[0];
    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
        threadDetails: {
          drafts: [
            { ...draft, isSaving: false, saveError: null, lastSaveTime: null },
          ],
          isSaving: false,
          saveError: null,
          lastSaveTime: draft.lastSaveTime,
          messages: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <DeleteDraft draftId={draft.messageId} />,
      {
        initialState,
        reducers: reducer,
        path: `/thread/${draft.messageId}/`,
      },
    );
    await waitFor(() => {
      expect(screen.findByTestId('delete-draft-button')).to.exist;
    });
  });

  it('opens modal on delete button click', async () => {
    const draft = thread.threadDetails.drafts[0];
    const pathname = `/thread/${draft.messageId}/`;
    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
      },
    };
    let screen = null;
    screen = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={draft.messageId}
        setNavigationError={setNavigationErrorSpy}
        savedReplyDraft
      />,
      {
        initialState,
        reducers: reducer,
        path: pathname,
      },
    );
    fireEvent.click(screen.getByTestId('delete-draft-button'));
    expect(screen.getByTestId('delete-draft-modal')).to.be.visible;
    expect(
      screen.findByText(Prompts.Draft.DELETE_DRAFT_CONFIRM, {
        exact: true,
      }),
    );
    expect(
      screen.findByText(Prompts.Draft.DELETE_DRAFT_CONFIRM_NOTE, {
        exact: true,
      }),
    );
    expect(screen.findByText('Delete draft', { exact: true }));
    expect(screen.findByText('Cancel', { exact: true }));
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );
  });

  it('on delete draft confirmation, calls deleteDraft action on saved draft', async () => {
    const draft = thread.threadDetails.drafts[0];
    const pathname = `/thread/${draft.messageId}/`;

    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
        threadDetails: {
          drafts: [draft],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={draft.messageId}
        setNavigationError={setNavigationErrorSpy}
        isModalVisible
      />,
      {
        initialState,
        reducers: reducer,
        path: pathname,
      },
    );
    fireEvent.click(screen.getByTestId('delete-draft-button'));
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );
    fireEvent.click(document.querySelector('va-button[text="Delete draft"]'));
    await waitFor(() => {
      expect(setNavigationErrorSpy.called).to.be.true;
    });
  });

  it('deletes blank, unsaved new draft confirmation', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [],
          cannotReply: false,
        },
      },
    };

    const props = {
      draftId: undefined,
      draftsCount: 0,
      draftBody: '',
      messageBody: '',
      savedDraft: false,
      unsavedDraft: true,
      editableDraft: false,
    };

    const initialHistory = `/new-message/`;
    const { getByTestId } = renderWithStoreAndRouter(
      <DeleteDraft {...props} />,
      { initialState, reducers: reducer, path: initialHistory },
    );

    fireEvent.click(getByTestId('delete-draft-button'));

    await waitFor(() => {
      expect(setIsModalVisibleSpy.called).to.be.false;
    });
  });

  it('closes delete modal on blank, unsaved new draft', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [],
          cannotReply: false,
        },
      },
    };

    const props = {
      draftId: undefined,
      draftsCount: 0,
      draftBody: '',
      messageBody: '',
      savedDraft: false,
      unsavedDraft: true,
      editableDraft: false,
    };

    const initialHistory = `/new-message/`;
    const { getByTestId } = renderWithStoreAndRouter(
      <DeleteDraft {...props} />,
      { initialState, reducers: reducer, path: initialHistory },
    );

    fireEvent.click(getByTestId('delete-draft-button'));
    fireEvent.click(getByTestId('cancel-delete-draft'));

    await waitFor(() => {
      expect(setIsModalVisibleSpy.called).to.be.false;
    });
  });

  it('renders blank /new-message draft without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [],
          cannotReply: false,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={undefined}
        navigationError={null}
        formPopulated={false}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/new-message/',
      },
    );

    const deleteButton = screen.getByTestId('delete-draft-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('deletes unsaved /new-message draft without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          cannotReply: false,
        },
      },
    };
    const props = {
      unsavedDraft: true,
      newMessageNavErr: sinon.spy(),
      setIsModalVisible: setIsModalVisibleSpy,
    };
    const initialHistory = `/new-message/`;
    const { getByTestId, store } = renderWithStoreAndRouter(
      <DeleteDraft {...props} />,
      {
        initialState,
        reducers: reducer,
        path: initialHistory,
      },
    );

    store.dispatch = dispatchSpy;

    const deleteButton = getByTestId('delete-draft-button');
    expect(deleteButton).to.exist;
    fireEvent.click(deleteButton);

    const deleteModal = getByTestId('delete-draft-modal');
    expect(deleteModal).to.exist;
    expect(deleteModal).to.have.attribute('visible', 'true');

    const deleteModalButton = getByTestId('confirm-delete-draft');
    fireEvent.click(deleteModalButton);

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(setIsModalVisibleSpy.called).to.be.false;
    });
  });

  it('renders blank /reply draft from Sent folder without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: sent,
        },
        threadDetails: {
          drafts: [],
          cannotReply: false,
          messages: [{ messageId: 1234567 }],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={undefined}
        formPopulated={undefined}
        messageBody=""
        unsavedDraft
        blankReplyDraft
        draftBody={undefined}
        savedReplyDraft={false}
        newMessageNavErr={false}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/reply/123456/`,
      },
    );

    const deleteButton = screen.getByTestId('delete-draft-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );
  });
});
