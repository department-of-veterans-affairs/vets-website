import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DeleteDraftModal from '../Modals/DeleteDraftModal';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { deleteDraft } from '../../actions/draftDetails';
import { clearMessageHistory } from '../../actions/messages';

const DeleteDraft = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deleteDraftButtonRef = useRef();
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handleDeleteDraftConfirm = () => {
    if (props.draftId) {
      props.setNavigationError(null);
      setIsModalVisible(false);
      dispatch(deleteDraft(props.draftId)).then(() => {
        dispatch(clearMessageHistory());
        navigateToFolderByFolderId(
          activeFolder
            ? activeFolder.folderId
            : Constants.DefaultFolders.DRAFTS.id,
          history,
        );
      });
    }
  };

  const handleDeleteModalClose = () => {
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
        className="usa-button usa-button-secondary delete-draft-button vads-u-flex--1 vads-u-margin-top--0 vads-u-margin-right--0"
        data-testid="delete-draft-button"
        onClick={() => {
          if (props.draftId) {
            setIsModalVisible(true);
          }
        }}
      >
        <i className="fas fa-trash-alt" aria-hidden="true" />
        Delete draft
      </button>
      <DeleteDraftModal
        visible={isModalVisible}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DeleteDraft.propTypes = {
  draftId: PropType.number,
  draft: PropType.object,
  setNavigationError: PropType.func,
};

export default DeleteDraft;
