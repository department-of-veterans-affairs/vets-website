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
    showEditDraftButton = false,
    handleEditDraftButton,
    hasMultipleDrafts = false,
  } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handlePrint = () => {
    dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
    });
    window.print();
  };

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
      {showEditDraftButton && (
        <div className="vads-u-flex--3 xsmall-screen:vads-u-margin-right--1 reply-button-container">
          <button
            type="button"
            className="usa-button vads-u-width--full reply-button-in-body vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center vads-u-align-items--center"
            data-testid="edit-draft-button-body"
            onClick={handleEditDraftButton}
          >
            <div className="vads-u-margin-right--0p5">
              <va-icon icon="undo" aria-hidden="true" />
            </div>
            <span
              className="message-action-button-text"
              data-testid="edit-draft-button-body-text"
            >
              {`Edit draft repl${hasMultipleDrafts ? 'ies' : 'y'}`}
            </span>
          </button>
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
  handleEditDraftButton: PropTypes.func,
  handleReplyButton: PropTypes.func,
  hasMultipleDrafts: PropTypes.bool,
  hideReplyButton: PropTypes.bool,
  isCreateNewModalVisible: PropTypes.bool,
  messageId: PropTypes.number,
  setIsCreateNewModalVisible: PropTypes.func,
  showEditDraftButton: PropTypes.bool,
  threadId: PropTypes.number,
};

export default MessageActionButtons;
