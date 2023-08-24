import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import ActionButtons from './shared/ActionButtons';
import ReplyBtn from './MessageActionButtons/ReplyBtn';
import TrashButton from './MessageActionButtons/TrashButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const { id, hideReplyButton, threadId } = props;
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
        <li key="print">
          <PrintBtn handlePrint={handlePrint} id={id} />
        </li>,
      );

      if (folders) {
        buttons.push(
          <MoveMessageToFolderBtn
            activeFolder={activeFolder}
            key="moveMessageToFolderBtn"
            isVisible={activeFolder?.folderId !== DefaultFolders.SENT.id}
            threadId={threadId}
            messageId={id}
            allFolders={folders}
          />,
        );
      }

      buttons.push(
        <TrashButton
          key="trashButton"
          activeFolder={activeFolder}
          threadId={threadId}
          messageId={id}
          visible={
            activeFolder?.folderId !== DefaultFolders.SENT.id &&
            activeFolder?.folderId !== DefaultFolders.DELETED.id
          }
        />,
      );

      if (activeFolder?.folderId === DefaultFolders.SENT.id) {
        buttons.push(
          <ReplyBtn
            key="replyBtn"
            visible={!hideReplyButton}
            onReply={props.onReply}
          />,
        );
      }

      return buttons;
    },
    [activeFolder, folders, hideReplyButton, id, props, threadId],
  );

  return <ActionButtons buttonsArray={buttonsArray} />;
};

MessageActionButtons.propTypes = {
  hideReplyButton: PropTypes.bool,
  id: PropTypes.number,
  threadId: PropTypes.number,
  onReply: PropTypes.func,
};

export default MessageActionButtons;
