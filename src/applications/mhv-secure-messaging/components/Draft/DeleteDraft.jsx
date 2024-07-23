import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import {
  ALERT_TYPE_SUCCESS,
  Alerts,
  DefaultFolders,
  ErrorMessages,
  Paths,
} from '../../util/constants';
import {
  navigateToFolderByFolderId,
  setUnsavedNavigationError,
} from '../../util/helpers';
import { addAlert } from '../../actions/alerts';
import { deleteDraft } from '../../actions/draftDetails';

const DeleteDraft = props => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const deleteDraftButtonRef = useRef();
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const {
    cannotReply,
    draftId,
    draftsCount,
    draftBody,
    formPopulated,
    navigationError,
    refreshThreadCallback,
    setNavigationError,
    messageBody,
    draftSequence,
    setHideDraft,
    setIsEditing,
    setIsModalVisible,
    isModalVisible,
    savedComposeDraft,
  } = props;

  // Navigation props
  const savedDraft = draftId;
  const unsavedDraft = draftId === undefined;
  const savedReplyDraft = !!savedDraft === true && formPopulated === undefined;
  const blankReplyDraft = draftBody === undefined && messageBody === '';
  const inProgressReplyDraft = !blankReplyDraft && messageBody !== draftBody;
  const editableDraft = !!savedDraft === true && formPopulated === true;
  const newMessageNavErr = unsavedDraft && navigationError !== null;
  const unsavedNewDraftMsg = draftId === undefined && navigationError === null;
  const showIcon = !!cannotReply;

  const unsavedDeleteSuccessful = () =>
    dispatch(
      addAlert(ALERT_TYPE_SUCCESS, '', Alerts.Message.DELETE_DRAFT_SUCCESS),
    );

  const handleDeleteDraftConfirm = () => {
    if (savedDraft) {
      setNavigationError(null);
      setIsModalVisible(false);
      dispatch(deleteDraft(draftId)).then(() => {
        if (draftsCount === 1) {
          const { pathname } = location;
          const defaultFolderId = activeFolder
            ? activeFolder.folderId
            : DefaultFolders.DRAFTS.id;

          if (pathname.includes('/new-message')) {
            navigateToFolderByFolderId(
              activeFolder ? activeFolder.folderId : DefaultFolders.DRAFTS.id,
              history,
            );
          }

          if (pathname.includes('/reply')) {
            history.goBack();
          } else if (pathname.includes(Paths.MESSAGE_THREAD + draftId)) {
            navigateToFolderByFolderId(defaultFolderId, history);
          } else if (pathname.includes(Paths.MESSAGE_THREAD)) {
            setIsEditing(false);
            setHideDraft(true);
          }
        } else {
          refreshThreadCallback();
        }
      });
    }

    if (unsavedDraft) {
      setIsModalVisible(false);
      unsavedDeleteSuccessful();
      history.goBack();
    }
  };

  const handleDeleteModalClose = () => {
    if (unsavedNewDraftMsg) {
      setUnsavedNavigationError(
        ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
        setNavigationError,
        ErrorMessages,
      );
    }
    setIsModalVisible(false);
    focusElement(deleteDraftButtonRef.current);
  };

  return (
    <>
      {/* TODO add GA event */}
      <button
        type="button"
        id={`delete-draft-button${draftSequence ? `-${draftSequence}` : ''}`}
        ref={deleteDraftButtonRef}
        className={`usa-button usa-button-secondary ${
          cannotReply ? 'vads-u-padding-x--4' : 'vads-u-flex--1'
        } delete-draft-button vads-u-margin-top--0 vads-u-margin-right--0 vads-u-margin-bottom--0 vads-u-padding-x--0p5 vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center`}
        data-testid={`delete-draft-button${
          draftSequence ? `-${draftSequence}` : ''
        }`}
        onClick={() => {
          if (
            newMessageNavErr ||
            editableDraft ||
            savedReplyDraft ||
            inProgressReplyDraft ||
            savedComposeDraft
          ) {
            setIsModalVisible(true);
            setNavigationError(null);
          }
          if (blankReplyDraft || unsavedNewDraftMsg) {
            unsavedDeleteSuccessful();
            history.goBack();
          }
        }}
      >
        {showIcon && <va-icon icon="delete" aria-hidden="true" />}
        Delete draft {draftSequence && `${draftSequence}`}
      </button>
      <DeleteDraftModal
        draftSequence={draftSequence}
        unsavedDraft={unsavedDraft}
        visible={isModalVisible}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DeleteDraft.propTypes = {
  cannotReply: PropType.bool,
  draftBody: PropType.string,
  draftId: PropType.number,
  draftSequence: PropType.number,
  draftsCount: PropType.number,
  formPopulated: PropType.bool,
  isModalVisible: PropType.bool,
  messageBody: PropType.string,
  navigationError: PropType.object,
  refreshThreadCallback: PropType.func,
  savedComposeDraft: PropType.bool,
  setHideDraft: PropType.func,
  setIsEditing: PropType.func,
  setIsModalVisible: PropType.func,
  setNavigationError: PropType.func,
  setUnsavedNavigationError: PropType.func,
  showIcon: PropType.bool,
};

export default DeleteDraft;
