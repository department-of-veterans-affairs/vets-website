import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeleteMessageModal from '../Modals/DeleteMessageModal';
import { deleteMessage } from '../../actions/messages';
import { addAlert } from '../../actions/alerts';
import { navigateToFolderByFolderId } from '../../util/helpers';
import * as Constants from '../../util/constants';

const TrashButton = props => {
  const { activeFolder, messageId, threadId, visible } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleDeleteMessageConfirm = () => {
    setIsDeleteVisible(false);
    dispatch(deleteMessage(threadId)).then(() => {
      navigateToFolderByFolderId(
        activeFolder
          ? activeFolder.folderId
          : Constants.DefaultFolders.DELETED.id,
        history,
      );
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_SUCCESS,
          '',
          Constants.Alerts.Message.DELETE_MESSAGE_SUCCESS,
        ),
      );
    });
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
      <>
        <button
          type="button"
          className="usa-button-secondary small-screen:vads-u-flex--3"
          style={{ minWidth: '100px' }}
          onClick={() => {
            setIsDeleteVisible(true);
          }}
          data-dd-action-name="Trash Button"
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
      </>
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
