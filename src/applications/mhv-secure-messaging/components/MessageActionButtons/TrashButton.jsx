import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeleteMessageModal from '../Modals/DeleteMessageModal';
import { deleteMessage } from '../../actions/messages';
import { addAlert } from '../../actions/alerts';
import { navigateToFolderByFolderId } from '../../util/helpers';
import * as Constants from '../../util/constants';
import { getListOfThreads } from '../../actions/threads';

const TrashButton = props => {
  const { activeFolder, messageId, threadId, visible } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const threadSort = useSelector(state => state.sm.threads.threadSort);

  const handleDeleteMessageConfirm = () => {
    setIsDeleteVisible(false);
    dispatch(deleteMessage(threadId)).then(() => {
      const redirectToFolderId = activeFolder
        ? activeFolder.folderId
        : Constants.DefaultFolders.INBOX.id;
      dispatch(
        getListOfThreads(
          redirectToFolderId,
          Constants.THREADS_PER_PAGE_DEFAULT,
          threadSort.page,
          threadSort.value,
          true,
        ),
      );
      navigateToFolderByFolderId(redirectToFolderId, history);
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
          id="trash-button"
          type="button"
          className="usa-button-secondary
          mobile-lg:vads-u-flex--3
          vads-u-display--flex
          vads-u-flex-direction--row
          vads-u-justify-content--center
          vads-u-align-items--center
          vads-u-padding-x--2
          message-action-button
          vads-u-margin--0
          vads-u-margin-top--1
          mobile-lg:vads-u-margin-top--0
          mobile-lg:vads-u-margin-left--1"
          onClick={() => {
            setIsDeleteVisible(true);
          }}
          data-dd-action-name="Trash Button"
        >
          <div className="vads-u-margin-right--0p5">
            <va-icon icon="delete" aria-hidden />
          </div>
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
