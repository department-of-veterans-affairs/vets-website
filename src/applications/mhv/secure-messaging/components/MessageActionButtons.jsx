import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders } from '../actions';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';
import * as Constants from '../util/constants';
import ActionButtons from './shared/ActionButtons';
import ReplyButton from './MessageActionButtons/ReplyButton';
import TrashButton from './MessageActionButtons/TrashButton';

const MessageActionButtons = props => {
  const { id, hideReplyButton } = props;
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

  const buttonsArray = [
    <li key="print">
      <PrintBtn handlePrint={handlePrint} id={id} />
    </li>,
    <TrashButton
      key="trashButton"
      activeFolder={activeFolder}
      messageId={id}
      visible={
        activeFolder?.folderId !== Constants.DefaultFolders.SENT.id &&
        activeFolder?.folderId !== Constants.DefaultFolders.DELETED.id
      }
    />,
    <MoveMessageToFolderBtn
      key="moveMessageToFolderBtn"
      isVisible={activeFolder?.folderId !== Constants.DefaultFolders.SENT.id}
      messageId={id}
      allFolders={folders}
    />,
    <ReplyButton
      key="replyButton"
      visible={!hideReplyButton}
      onReply={props.onReply}
    />,
  ];

  return <ActionButtons buttonsArray={buttonsArray} />;
};

MessageActionButtons.propTypes = {
  handlePrintThreadStyleClass: PropTypes.func,
  hideReplyButton: PropTypes.bool,
  id: PropTypes.number,
  onReply: PropTypes.func,
};

export default MessageActionButtons;
