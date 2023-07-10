import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders } from '../actions';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import { DefaultFolders } from '../util/constants';
import ActionButtons from './shared/ActionButtons';
import TrashButton from './MessageActionButtons/TrashButton';
import { Actions } from '../util/actionTypes';

const MessageActionButtons = props => {
  const { id, threadId } = props;
  const dispatch = useDispatch();
  const folders = useSelector(state => state.sm.folders.folderList);
  const activeFolder = useSelector(state => state.sm.folders.folder);

  useEffect(
    () => {
      const abortCont = new AbortController();
      dispatch(getAllFolders(), { abort: abortCont.signal });
      return () => abortCont.abort();
    },
    [dispatch],
  );

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
      return buttons;
    },
    [activeFolder, folders, id, props, threadId],
  );

  return <ActionButtons buttonsArray={buttonsArray} />;
};

MessageActionButtons.propTypes = {
  id: PropTypes.number,
};

export default MessageActionButtons;
