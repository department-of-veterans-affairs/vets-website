import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import {
  ALERT_TYPE_SUCCESS,
  Alerts,
  DefaultFolders,
} from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { addAlert } from '../../actions/alerts';
import { deleteDraft } from '../../actions/draftDetails';

const DeleteDraft = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deleteDraftButtonRef = useRef();
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const {
    cannotReply,
    draftId,
    draftsCount,
    formPopulated,
    navigationError,
    refreshThreadCallback,
    setDeleteButtonClicked,
    setNavigationError,
    setUnsavedNavigationError,
    messageBody,
  } = props;

  const savedDraft = draftId;
  const savedReplyDraft = !!savedDraft === true && formPopulated === undefined;
  const unsavedReplyDraft = draftId === null;
  const unsavedNewDraft = draftId === undefined;
  const inProgressReplyDraft =
    messageBody !== '' && !!unsavedReplyDraft === true;
  const blankReplyDraft =
    unsavedReplyDraft && formPopulated === undefined && messageBody === '';
  const editableDraft = !!savedDraft === true && formPopulated === true;
  const newMessageNavErr = unsavedNewDraft && navigationError !== null;
  const blankNewMessage =
    (unsavedNewDraft || unsavedReplyDraft) && navigationError === null;

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
          navigateToFolderByFolderId(
            activeFolder ? activeFolder.folderId : DefaultFolders.DRAFTS.id,
            history,
          );
        } else {
          refreshThreadCallback();
        }
      });
    }

    if (unsavedNewDraft || unsavedReplyDraft) {
      setIsModalVisible(false);
      unsavedDeleteSuccessful();
      navigateToFolderByFolderId(
        activeFolder ? activeFolder.folderId : DefaultFolders.INBOX.id,
        history,
      );
    }
  };

  const handleDeleteModalClose = () => {
    if (blankNewMessage) {
      setUnsavedNavigationError('no attachments and navigating away');
    }
    setIsModalVisible(false);
    focusElement(deleteDraftButtonRef.current);
  };

  return (
    <>
      {/* TODO add GA event */}
      <button
        type="button"
        id="delete-draft-button"
        ref={deleteDraftButtonRef}
        className={`usa-button usa-button-${
          cannotReply
            ? 'primary vads-u-padding-x--4'
            : 'secondary vads-u-flex--1'
        } delete-draft-button vads-u-margin-top--0 vads-u-margin-right--0 vads-u-margin-bottom--0 vads-u-padding-x--0p5`}
        data-testid="delete-draft-button"
        onClick={() => {
          if (
            newMessageNavErr ||
            editableDraft ||
            savedReplyDraft ||
            inProgressReplyDraft
          ) {
            setIsModalVisible(true);
            setDeleteButtonClicked(true);
            setNavigationError(null);
          }
          if (blankReplyDraft) {
            unsavedDeleteSuccessful();
            navigateToFolderByFolderId(
              activeFolder ? activeFolder.folderId : DefaultFolders.SENT.id,
              history,
            );
          }
          if (blankNewMessage) {
            unsavedDeleteSuccessful();
            navigateToFolderByFolderId(
              activeFolder ? activeFolder.folderId : DefaultFolders.INBOX.id,
              history,
            );
          }
        }}
      >
        <i className="fas fa-trash-alt" aria-hidden="true" />
        Delete draft
      </button>
      <DeleteDraftModal
        unsavedNewDraft={unsavedNewDraft}
        visible={isModalVisible}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DeleteDraft.propTypes = {
  cannotReply: PropType.bool,
  draft: PropType.object,
  draftId: PropType.number,
  draftsCount: PropType.number,
  formPopulated: PropType.bool,
  messageBody: PropType.string,
  navigationError: PropType.object,
  refreshThreadCallback: PropType.func,
  setDeleteButtonClicked: PropType.func,
  setNavigationError: PropType.func,
  setUnsavedNavigationError: PropType.func,
};

export default DeleteDraft;
