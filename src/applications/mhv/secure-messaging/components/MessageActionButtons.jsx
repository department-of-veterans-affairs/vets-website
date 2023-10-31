import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import ActionButtons from './shared/ActionButtons';
import TrashButton from './MessageActionButtons/TrashButton';
import ReplyButton from './ReplyButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const { threadId, hideReplyButton, handleReplyButton } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const buttonsArray = useMemo(
    () => {
      const handlePrint = printOption => {
        dispatch({
          type: Actions.Message.SET_THREAD_PRINT_OPTION,
          payload: printOption,
        });
        if (printOption !== null) {
          window.print();
        }
      };

      const buttons = [];

      buttons.push(
        <ReplyButton
          key="replyButton"
          visible={!hideReplyButton}
          onReply={handleReplyButton}
        />,
      );

      buttons.push(
        <span className="mobile-row flex" key="flex-action-buttons">
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
        </span>,
      );

      return buttons;
    },
    [activeFolder, folders, props, threadId],
  );

  return <ActionButtons buttonsArray={buttonsArray} />;
};

MessageActionButtons.propTypes = {
  handleReplyButton: PropTypes.func,
  hideReplyButton: PropTypes.bool,
  messageId: PropTypes.number,
  threadId: PropTypes.number,
};

export default MessageActionButtons;
