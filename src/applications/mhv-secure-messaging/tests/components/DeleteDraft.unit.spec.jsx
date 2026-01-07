import React from 'react';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import DeleteDraft, {
  _computeDraftDeleteRedirect,
} from '../../components/Draft/DeleteDraft';
import { drafts, inbox, sent } from '../fixtures/folder-inbox-response.json';
import thread from '../fixtures/reducers/thread-with-multiple-drafts-reducer.json';
import reducer from '../../reducers';
import { Prompts, Paths } from '../../util/constants';
import { drafts as mockDraft } from '../fixtures/saved-draft-mock-prop.json';

describe('Delete Draft component', () => {
  let setIsModalVisibleSpy;
  let setNavigationErrorSpy;
  let setIsEditingSpy;
  let setHideDraftSpy;
  let refreshThreadCallbackSpy;
  let unsavedDeleteSuccessfulSpy;

  beforeEach(() => {
    setIsModalVisibleSpy = sinon.spy();
    setNavigationErrorSpy = sinon.spy();
    setIsEditingSpy = sinon.spy();
    setHideDraftSpy = sinon.spy();
    refreshThreadCallbackSpy = sinon.spy();
    unsavedDeleteSuccessfulSpy = sinon.spy();
  });

  afterEach(() => cleanup());

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
    // expect(screen.getByTestId('delete-draft-modal')).to.be.visible;
    await waitFor(() => {
      const deleteDraftModal = screen.getByTestId('delete-draft-modal');
      expect(deleteDraftModal).to.have.attribute('visible', 'true');
      expect(deleteDraftModal).to.have.attribute(
        'modal-title',
        Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER,
      );
      screen.getByText(Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT);
      screen.getByText('Delete draft');
      screen.getByTestId('cancel-delete-draft');
    });
  });

  it('renders saved /new-message draft without errors', async () => {
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
      activeFolder: { folderId: '1' },
    };

    const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
      <DeleteDraft
        {...props}
        setIsModalVisible={setIsModalVisibleSpy}
        setNavigationError={setNavigationErrorSpy}
        setIsEditing={setIsEditingSpy}
        setHideDraft={setHideDraftSpy}
        refreshThreadCallback={refreshThreadCallbackSpy}
        unsavedDeleteSuccessful={unsavedDeleteSuccessfulSpy}
      />,
      { initialState, reducers: reducer, path: Paths.COMPOSE },
    );

    fireEvent.click(getByTestId('delete-draft-button'));
    fireEvent.click(getByTestId('confirm-delete-draft'));

    expect(queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  // Unsaved /new-message draft
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
        path: Paths.COMPOSE,
      },
    );

    const deleteButton = screen.getByTestId('delete-draft-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });
  it('closes blank, unsaved /new-message draft delete modal,', async () => {
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
      editableDraft: false,
    };

    const initialHistory = Paths.COMPOSE;
    const { getByTestId, queryByTestId, history } = renderWithStoreAndRouter(
      <DeleteDraft {...props} />,
      { initialState, reducers: reducer, path: initialHistory },
    );

    fireEvent.click(getByTestId('delete-draft-button'));
    fireEvent.click(getByTestId('cancel-delete-draft'));

    expect(queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );

    await waitFor(() => {
      expect(setIsModalVisibleSpy.called).to.be.false;
      expect(history.location.pathname).to.equal(initialHistory);
    });
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
    const initialHistory = Paths.COMPOSE;
    const { getByTestId, history } = renderWithStoreAndRouter(
      <DeleteDraft draftsCount={1} setNavigationError={() => {}} />,
      {
        initialState,
        reducers: reducer,
        path: initialHistory,
      },
    );

    const deleteButton = getByTestId('delete-draft-button');
    expect(deleteButton).to.exist;
    fireEvent.click(deleteButton);

    const deleteModal = getByTestId('delete-draft-modal');
    expect(deleteModal).to.exist;
    expect(deleteModal).to.have.attribute('visible', 'true');

    const deleteModalButton = getByTestId('confirm-delete-draft');
    fireEvent.click(deleteModalButton);
    await waitFor(() => {
      expect(history.push.calledWith('/inbox/')).to.be.true;
    });
    expect(deleteModal).to.have.attribute('visible', 'false');
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
        blankReplyDraft
        draftBody={undefined}
        savedReplyDraft={false}
        newMessageNavErr={false}
      />,
      {
        initialState,
        reducers: reducer,
        path: `${Paths.REPLY}123456/`,
      },
    );

    const deleteButton = screen.getByTestId('delete-draft-button');

    fireEvent.click(deleteButton);
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );
    expect(screen.getByTestId('delete-draft-modal')).to.have.text(
      Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT,
    );
    fireEvent.click(screen.getByTestId('cancel-delete-draft'));
    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('renders saved /reply draft from Sent folder without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: sent,
        },
        threadDetails: {
          drafts: mockDraft,
          cannotReply: false,
          messages: [{ messageId: 1234567 }],
          threadFolderId: -1,
          replyToMessageId: 1234567,
          isSaving: false,
          saveError: null,
          lastSaveTime: 1721914522123,
        },
      },
    };
    const screen = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={mockDraft[0].messageId}
        messageBody={mockDraft[0].body}
        blankReplyDraft={false}
        draftBody={mockDraft[0].body}
        savedReplyDraft
      />,
      {
        initialState,
        reducers: reducer,
        path: `${Paths.REPLY}1234567/`,
      },
    );

    const deleteButton = screen.getByTestId('delete-draft-button');

    fireEvent.click(deleteButton);
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );

    expect(screen.getByTestId('delete-draft-modal')).to.have.text(
      Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT,
    );
    fireEvent.click(screen.getByTestId('cancel-delete-draft'));
    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('deletes saved /reply draft from Sent folder without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: sent,
        },
        threadDetails: {
          drafts: mockDraft,
          cannotReply: false,
          messages: [{ messageId: 1234567 }],
          threadFolderId: -1,
          replyToMessageId: 1234567,
          isSaving: false,
          saveError: null,
          lastSaveTime: 1721914522123,
        },
      },
    };
    const { getByTestId } = renderWithStoreAndRouter(
      <DeleteDraft
        draftId={mockDraft[0].messageId}
        messageBody={mockDraft[0].body}
        blankReplyDraft={false}
        draftBody={mockDraft[0].body}
        savedReplyDraft
        inProgressReplyDraft={false}
        draftsCount={1}
        setNavigationError={setNavigationErrorSpy}
        setIsModalVisible={setIsModalVisibleSpy}
      />,
      {
        initialState,
        reducers: reducer,
        path: `${Paths.REPLY}1234567/`,
      },
    );

    const deleteButton = getByTestId('delete-draft-button');

    fireEvent.click(deleteButton);

    const deleteModal = getByTestId('delete-draft-modal');
    expect(deleteModal).to.exist;
    expect(deleteModal).to.have.attribute('visible', 'true');
    expect(deleteModal).to.have.text(
      Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT,
    );

    const deleteModalButton = getByTestId('confirm-delete-draft');
    fireEvent.click(deleteModalButton);
    await waitFor(() => {
      expect(setNavigationErrorSpy.calledWith(null)).to.be.true;
    });
  });

  describe('redirectPath prop', () => {
    it('renders with redirectPath prop', async () => {
      const initialState = {
        sm: {
          folders: {
            folder: inbox,
          },
        },
      };

      const redirectPath = '/my-health/medications';
      const { getByTestId } = renderWithStoreAndRouter(
        <DeleteDraft
          draftId={123456}
          draftsCount={1}
          redirectPath={redirectPath}
          savedComposeDraft
        />,
        { initialState, reducers: reducer, path: Paths.COMPOSE },
      );

      expect(getByTestId('delete-draft-button')).to.exist;
    });
  });

  describe('_computeDraftDeleteRedirect', () => {
    it('should add draftDeleteSuccess=true to path without query params', () => {
      const result = _computeDraftDeleteRedirect('/my-health/medications');
      expect(result).to.equal('/my-health/medications?draftDeleteSuccess=true');
    });

    it('should add draftDeleteSuccess=true to path with existing query params', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?tab=renewals',
      );
      expect(result).to.equal(
        '/my-health/medications?tab=renewals&draftDeleteSuccess=true',
      );
    });

    it('should remove rxRenewalMessageSuccess=true and add draftDeleteSuccess=true', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?rxRenewalMessageSuccess=true',
      );
      expect(result).to.equal('/my-health/medications?draftDeleteSuccess=true');
    });

    it('should remove rxRenewalMessageSuccess=false and add draftDeleteSuccess=true', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?rxRenewalMessageSuccess=false',
      );
      expect(result).to.equal('/my-health/medications?draftDeleteSuccess=true');
    });

    it('should remove rxRenewalMessageSuccess without value and add draftDeleteSuccess=true', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?rxRenewalMessageSuccess',
      );
      expect(result).to.equal('/my-health/medications?draftDeleteSuccess=true');
    });

    it('should handle rxRenewalMessageSuccess in middle of query string', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?tab=renewals&rxRenewalMessageSuccess=true&other=param',
      );
      expect(result).to.equal(
        '/my-health/medications?tab=renewals&other=param&draftDeleteSuccess=true',
      );
    });

    it('should handle rxRenewalMessageSuccess at end of query string', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?tab=renewals&rxRenewalMessageSuccess=true',
      );
      expect(result).to.equal(
        '/my-health/medications?tab=renewals&draftDeleteSuccess=true',
      );
    });

    it('should handle rxRenewalMessageSuccess at start of query string', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?rxRenewalMessageSuccess=true&other=param',
      );
      expect(result).to.equal(
        '/my-health/medications?other=param&draftDeleteSuccess=true',
      );
    });

    it('should handle multiple rxRenewalMessageSuccess params (edge case)', () => {
      const result = _computeDraftDeleteRedirect(
        '/my-health/medications?rxRenewalMessageSuccess=true&rxRenewalMessageSuccess=false',
      );
      expect(result).to.equal('/my-health/medications?draftDeleteSuccess=true');
    });
  });
});
