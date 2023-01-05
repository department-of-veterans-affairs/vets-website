import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders } from '../actions';
import { deleteMessage } from '../actions/messages';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { navigateToFolderByFolderId } from '../util/helpers';
import DeleteMessageModal from './Modals/DeleteMessageModal';
import * as Constants from '../util/constants';

const MessageActionButtons = props => {
  const { id, hideReplyButton } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  useEffect(
    () => {
      const abortCont = new AbortController();
      dispatch(getAllFolders(), { abort: abortCont.signal });
      return () => abortCont.abort();
    },
    [dispatch],
  );

  const handleDeleteMessageConfirm = () => {
    setIsDeleteVisible(false);
    dispatch(deleteMessage(props.id)).then(() => {
      navigateToFolderByFolderId(
        activeFolder
          ? activeFolder.folderId
          : Constants.DefaultFolders.DELETED.id,
        history,
      );
    });
  };

  const deleteMessageModal = () => {
    return (
      <DeleteMessageModal
        id={props.id}
        visible={isDeleteVisible}
        onClose={() => {
          setIsDeleteVisible(false);
        }}
        onDelete={() => {
          handleDeleteMessageConfirm();
        }}
      />
    );
  };

  const handlePrint = printOption => {
    if (printOption === 'all messages') {
      props.handlePrintThreadStyleClass('print thread');
    }
    if (printOption === 'this message') {
      props.handlePrintThreadStyleClass('this message');
    }
    if (printOption !== null) {
      window.print();
    }
  };

  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around vads-u-margin-y--4">
      <PrintBtn handlePrint={handlePrint} id={id} />

      {activeFolder?.folderId !== Constants.DefaultFolders.SENT.id &&
        activeFolder?.folderId !== Constants.DefaultFolders.DELETED.id && (
          <button
            type="button"
            className="message-action-button middle-button middle-left-button usa-button-secondary"
            onClick={() => {
              setIsDeleteVisible(true);
            }}
          >
            <i
              className="fas fa-trash-alt .vads-u-margin-right--0p5"
              aria-hidden
            />
            <span
              className="message-action-button-text"
              data-testid="move-button-text"
            >
              Trash
            </span>
          </button>
        )}

      {isDeleteVisible && deleteMessageModal()}

      {activeFolder?.folderId !== Constants.DefaultFolders.SENT.id && (
        <MoveMessageToFolderBtn messageId={id} allFolders={folders} />
      )}

      {!hideReplyButton && (
        <button
          type="button"
          className="message-action-button right-button usa-button-secondary"
          data-testid="reply-button-top"
          onClick={props.onReply}
        >
          <i
            className="fas fa-reply vads-u-margin-right--0p5"
            aria-hidden="true"
          />
          <span
            className="message-action-button-text"
            data-testid="move-button-text"
          >
            Reply
          </span>
        </button>
      )}
    </div>
  );
};

MessageActionButtons.propTypes = {
  handlePrintThreadStyleClass: PropTypes.func,
  hideReplyButton: PropTypes.func,
  id: PropTypes.number,
  onReply: PropTypes.func,
};

export default MessageActionButtons;
