import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropType from 'prop-types';
import DiscardDraftModal from '../Modals/DiscardDraftModal';
import * as Constants from '../../util/constants';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { deleteDraft } from '../../actions/draftDetails';

const DiscardDraft = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handleDeleteDraftConfirm = () => {
    setIsModalVisible(false);
    dispatch(deleteDraft(props.draft.messageId));
    navigateToFolderByFolderId(
      activeFolder ? activeFolder.folderId : Constants.DefaultFolders.DRAFTS.id,
      history,
    );
  };

  return (
    <>
      <button
        type="button"
        data-testid="discard-draft-button"
        className="usa-button-secondary discard-draft-button vads-u-flex--fill vads-u-margin-right--0"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <i className="fas fa-trash-alt vads-u-padding-right--0p5" aria-hidden />
        Discard
      </button>
      <DiscardDraftModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onDelete={handleDeleteDraftConfirm}
      />
    </>
  );
};

DiscardDraft.propTypes = {
  draft: PropType.object,
};

export default DiscardDraft;
