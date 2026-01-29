import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import TrashButton from './MessageActionButtons/TrashButton';
import ReplyButton from './ReplyButton';
import { Actions } from '../util/actionTypes';
import useFeatureToggles from '../hooks/useFeatureToggles';

const MessageActionButtons = props => {
  const {
    threadId,
    hideReplyButton,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
  } = props;
  const dispatch = useDispatch();
  const { customFoldersRedesignEnabled } = useFeatureToggles();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const handlePrint = () => {
    dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
    });
    window.print();
  };

  return (
    <div
      className={`vads-u-display--flex vads-u-flex-direction--column tablet:vads-u-flex-direction--row ${customFoldersRedesignEnabled &&
        'vads-u-margin-top--3 mobile-lg:vads-u-margin-top--4'}`}
    >
      {!hideReplyButton &&
        !customFoldersRedesignEnabled && (
          <div className="reply-button-container vads-u-flex--3 vads-u-flex--auto">
            <ReplyButton key="replyButton" visible />
          </div>
        )}

      <div
        className={`vads-u-display--flex
          vads-u-flex--1
          vads-u-flex-direction--column
          mobile-lg:vads-u-flex-direction--row
          ${!customFoldersRedesignEnabled &&
            !hideReplyButton &&
            'tablet:vads-u-margin-left--1'}`}
      >
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
  threadId: PropTypes.number.isRequired,
  hideReplyButton: PropTypes.bool,
  isCreateNewModalVisible: PropTypes.bool,
  messageId: PropTypes.number,
  setIsCreateNewModalVisible: PropTypes.func,
};

export default MessageActionButtons;
