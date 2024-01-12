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
  const {
    threadId,
    hideReplyButton,
    handleReplyButton,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
    accordionShadowRoot,
    // setAccordionState,
  } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handlePrint = printOption => {
    dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
      payload: printOption,
    });

    if (printOption !== null) {
      // expands all messages
      // ON CLICK, FIRST CAPTURE ACCORDION STATE, THEN
      // IF ANY OF THE ACCORDION PART HEADERS CONTAIN ARIA-EXPANDED=FALSE,
      // THEN CLICK EXPAND ALL BUTTON,
      // THEN CALL PRINT.WINDOW()

      accordionShadowRoot.click();
      window.print();
    }
  };

  const handleAfterPrint = () => {};

  // IN A USE EFFECT
  // THEN WHEN THE PRINT.WINDOW CLOSES,
  // REVERT ACCORDION TO PREV ACCORDION STATE

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
  accordionItemShadowRoot: PropTypes.object,
  accordionShadowRoot: PropTypes.object,
  accordionState: PropTypes.object,
  handleReplyButton: PropTypes.func,
  hideReplyButton: PropTypes.bool,
  isCreateNewModalVisible: PropTypes.bool,
  messageId: PropTypes.number,
  setAccordionState: PropTypes.func,
  setIsCreateNewModalVisible: PropTypes.func,
  threadId: PropTypes.number,
};

export default MessageActionButtons;
