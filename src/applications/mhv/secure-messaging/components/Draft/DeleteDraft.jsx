import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropType from 'prop-types';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { deleteDraft } from '../../actions/draftDetails';
import { clearMessageHistory } from '../../actions/messages';

const DeleteDraft = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handleDeleteDraftConfirm = () => {
    props.setNavigationError(null);
    setIsModalVisible(false);
    dispatch(
      props.draftId
        ? deleteDraft(props.draftId)
        : deleteDraft(props.draft.messageId),
    ).then(() => {
      dispatch(clearMessageHistory());
      navigateToFolderByFolderId(
        activeFolder
          ? activeFolder.folderId
          : Constants.DefaultFolders.DRAFTS.id,
        history,
      );
    });
  };

  return (
    <>
      {/* TODO add GA event */}
      <button
        type="button"
        data-testid="delete-draft-button"
        className="usa-button-secondary delete-draft-button vads-u-flex--1 vads-u-margin-y--1"
        onClick={e => {
          setIsModalVisible(true);
          props.setLastFocusableElement(e.target);
        }}
      >
        Delete draft
      </button>
      <DeleteDraftModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DeleteDraft.propTypes = {
  draftId: PropType.number.isRequired,
  draft: PropType.object,
  setLastFocusableElement: PropType.func,
  setNavigationError: PropType.func,
};

export default DeleteDraft;
