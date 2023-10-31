import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import TrashButton from './MessageActionButtons/TrashButton';
import ReplyButton from './ReplyButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const { threadId, hideReplyButton, handleReplyButton } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handlePrint = printOption => {
    dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
      payload: printOption,
    });
    if (printOption !== null) {
      window.print();
    }
  };

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
      <div className="vads-u-flex--3 vads-u-margin-right--1 reply-button-container">
        <ReplyButton
          key="replyButton"
          visible={!hideReplyButton}
          onReply={handleReplyButton}
        />
      </div>
      <div className="vads-u-display--flex vads-u-flex--1 vads-u-flex-direction--row medium-">
        <PrintBtn key="print" handlePrint={handlePrint} />
        {folders && (
          <MoveMessageToFolderBtn
            activeFolder={activeFolder}
            key="moveMessageToFolderBtn"
            isVisible={activeFolder?.folderId !== DefaultFolders.SENT.id}
            threadId={threadId}
            allFolders={folders}
          />
        )}
        <TrashButton
          key="trashButton"
          activeFolder={activeFolder}
          threadId={threadId}
          visible={
            activeFolder?.folderId !== DefaultFolders.SENT.id &&
            activeFolder?.folderId !== DefaultFolders.DELETED.id
          }
        />
      </div>
    </div>
  );
};

MessageActionButtons.propTypes = {
  handleReplyButton: PropTypes.func,
  hideReplyButton: PropTypes.bool,
  messageId: PropTypes.number,
  threadId: PropTypes.number,
};

export default MessageActionButtons;
