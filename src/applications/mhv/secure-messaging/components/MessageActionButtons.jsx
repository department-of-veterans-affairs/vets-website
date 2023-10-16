import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import ActionButtons from './shared/ActionButtons';
import TrashButton from './MessageActionButtons/TrashButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const { threadId } = props;
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
          <PrintBtn handlePrint={handlePrint} />
        </li>,
      );

      if (folders) {
        buttons.push(
          <MoveMessageToFolderBtn
            activeFolder={activeFolder}
            key="moveMessageToFolderBtn"
            isVisible={activeFolder?.folderId !== DefaultFolders.SENT.id}
            threadId={threadId}
            allFolders={folders}
          />,
        );
      }

      buttons.push(
        <TrashButton
          key="trashButton"
          activeFolder={activeFolder}
          threadId={threadId}
          visible={
            activeFolder?.folderId !== DefaultFolders.SENT.id &&
            activeFolder?.folderId !== DefaultFolders.DELETED.id
          }
        />,
      );

      return buttons;
    },
    [activeFolder, folders, props, threadId],
  );

  return <ActionButtons buttonsArray={buttonsArray} />;
};

MessageActionButtons.propTypes = {
  threadId: PropTypes.number,
};

export default MessageActionButtons;
