import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import TrashButton from './MessageActionButtons/TrashButton';
import ReplyButton from './ReplyButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const {
    threadId,
    hideReplyButton,
    handleReplyButton,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
  } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const [printThread, setPrintThread] = useState(false);

  const handlePrint = () => {
    dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
    });
    setPrintThread(true);
  };

  useEffect(() => {
    if (printThread) {
      window.print();
    }
  });

  // Removes PRINT_THREAD component
  const handleAfterPrint = () => {
    setPrintThread(false);
  };
  window.onafterprint = handleAfterPrint;

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
      {!hideReplyButton && (
        <div className="vads-u-flex--3 xsmall-screen:vads-u-margin-right--1 reply-button-container">
          <ReplyButton
            key="replyButton"
            visible={!hideReplyButton}
            onReply={handleReplyButton}
          />
        </div>
      )}

      <div className="vads-u-display--flex vads-u-flex--1 vads-u-flex-direction--column xsmall-screen:vads-u-flex-direction--row ">
        <PrintBtn
          key="print"
          handlePrint={handlePrint}
          activeFolder={activeFolder}
        />
        {folders && (
          <MoveMessageToFolderBtn
            activeFolder={activeFolder}
            key="moveMessageToFolderBtn"
            isCreateNewModalVisible={isCreateNewModalVisible}
            setIsCreateNewModalVisible={setIsCreateNewModalVisible}
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
  isCreateNewModalVisible: PropTypes.bool,
  messageId: PropTypes.number,
  printThread: PropTypes.bool,
  setIsCreateNewModalVisible: PropTypes.func,
  setPrintThread: PropTypes.func,
  threadId: PropTypes.number,
};

export default MessageActionButtons;
