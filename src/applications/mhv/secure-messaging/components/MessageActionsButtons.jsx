import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders, deleteMessage } from '../actions';
import MoveMessageToFolderBtn from './MessageActionButtons/MoveMessageToFolderBtn';
import PrintBtn from './MessageActionButtons/PrintBtn';

const MessageActionButtons = props => {
  const { id } = props;
  const dispatch = useDispatch();
  const { folders } = useSelector(state => state?.folders);

  useEffect(
    () => {
      const abortCont = new AbortController();
      dispatch(getAllFolders(), { abort: abortCont.signal });
      return () => abortCont.abort();
    },
    [dispatch],
  );

  const handleDeleteMessage = () => {
    dispatch(deleteMessage(props.id));
  };

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

  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around">
      <PrintBtn handlePrint={handlePrint} id={id} />

      <button
        type="button"
        className="message-action-button"
        onClick={handleDeleteMessage}
      >
        <i className="fas fa-trash-alt" aria-hidden />
        <span className="message-action-button-text">Delete</span>
      </button>

      <MoveMessageToFolderBtn messageId={id} allFolders={folders} />

      <button type="button" className="message-action-button">
        <i className="fas fa-reply" aria-hidden="true" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

MessageActionButtons.propTypes = {
  handlePrintThreadStyleClass: PropTypes.func,
  id: PropTypes.number,
};

export default MessageActionButtons;
