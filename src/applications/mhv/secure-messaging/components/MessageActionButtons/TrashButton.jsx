import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeleteMessageModal from '../Modals/DeleteMessageModal';
import { deleteMessage } from '../../actions/messages';
// import { navigateToFolderByFolderId } from '../../util/helpers';
// import * as Constants from '../../util/constants';

const TrashButton = props => {
  const { activeFolder, messageId, threadId, visible } = props;
  const dispatch = useDispatch();
  // const history = useHistory();
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleDeleteMessageConfirm = () => {
    setIsDeleteVisible(false);
    dispatch(deleteMessage(threadId, activeFolder.folderId));
  };

  const deleteMessageModal = () => {
    return (
      visible && (
        <li>
          <DeleteMessageModal
            id={messageId}
            threadId={threadId}
            visible={isDeleteVisible}
            onClose={() => {
              setIsDeleteVisible(false);
            }}
            onDelete={() => {
              handleDeleteMessageConfirm();
            }}
          />
        </li>
      )
    );
  };

  return (
    props.visible && (
      <li key="trash">
        <button
          type="button"
          className="usa-button-secondary"
          onClick={() => {
            setIsDeleteVisible(true);
          }}
        >
          <i
            className="fas fa-trash-alt vads-u-margin-right--0p5"
            aria-hidden
          />
          <span
            className="message-action-button-text"
            data-testid="trash-button-text"
          >
            Trash
          </span>
        </button>
        {isDeleteVisible && deleteMessageModal()}
      </li>
    )
  );
};

TrashButton.propTypes = {
  activeFolder: PropTypes.object,
  messageId: PropTypes.number,
  threadId: PropTypes.number,
  visible: PropTypes.bool,
};
export default TrashButton;
