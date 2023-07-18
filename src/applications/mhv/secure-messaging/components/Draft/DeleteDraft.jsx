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
  };

  const handleDeleteModalClose = () => {
    setIsModalVisible(false);
    focusElement(
      deleteDraftButtonRef.current.shadowRoot.querySelector('button'),
    );
  };

  return (
    <>
      {/* TODO add GA event */}
      <va-button
        ref={deleteDraftButtonRef}
        text="Delete draft"
        secondary
        data-testid="delete-draft-button"
        class="usa-button-secondary delete-draft-button vads-u-margin-bottom--1"
        onClick={e => {
          setIsModalVisible(true);
          props.setLastFocusableElement(e.target);
        }}
      />
      <DeleteDraftModal
        visible={isModalVisible}
        onClose={handleDeleteModalClose}
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
