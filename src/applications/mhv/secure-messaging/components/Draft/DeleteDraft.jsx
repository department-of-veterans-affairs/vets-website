import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import { DefaultFolders } from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { deleteDraft } from '../../actions/draftDetails';
import { clearMessageHistory } from '../../actions/messages';

const DeleteDraft = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deleteDraftButtonRef = useRef();
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const {
    cannotReply,
    draftId,
    formPopulated,
    navigationError,
    setDeleteButtonClicked,
    setNavigationError,
    setUnsavedNavigationError,
  } = props;

  const savedDraft = draftId;
  const unsavedReplyDraft = draftId === null;
  const unsavedNewDraft = draftId === undefined;
  const editableDraft = !!savedDraft === true && formPopulated === true;
  const newMessageNavErr =
    (unsavedNewDraft || unsavedReplyDraft) && navigationError !== null;
  const replyDraft = !!savedDraft === true && formPopulated === undefined;
  const blankNewMessage =
    (unsavedNewDraft || unsavedReplyDraft) && navigationError === null;
  const blankReplyDraft = savedDraft === null && formPopulated === undefined;

  const handleDeleteDraftConfirm = () => {
    if (savedDraft) {
      setNavigationError(null);
      setIsModalVisible(false);
      dispatch(deleteDraft(draftId)).then(() => {
        dispatch(clearMessageHistory());
        navigateToFolderByFolderId(
          activeFolder ? activeFolder.folderId : DefaultFolders.DRAFTS.id,
          history,
        );
      });
    }

    if (unsavedNewDraft || unsavedReplyDraft) {
      setIsModalVisible(false);
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
          if (newMessageNavErr || editableDraft || replyDraft) {
            setIsModalVisible(true);
            setDeleteButtonClicked(true);
            setNavigationError(null);
          }
          if (blankReplyDraft) {
            navigateToFolderByFolderId(
              activeFolder ? activeFolder.folderId : DefaultFolders.SENT.id,
              history,
            );
          }
          if (blankNewMessage) {
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
  formPopulated: PropType.bool,
  navigationError: PropType.object,
  setDeleteButtonClicked: PropType.func,
  setNavigationError: PropType.func,
  setUnsavedNavigationError: PropType.func,
};

export default DeleteDraft;
