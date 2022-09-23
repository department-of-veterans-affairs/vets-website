import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders } from '../actions';
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

  const handlePrint = printOption => {
    // if (printOption === 'this message') {
    //   console.log('print option one: ', printOption);
    // } else if (printOption === 'all messages') {
    //   console.log('print option all: ', printOption);
    // }
    if (printOption) {
      window.print();
    }
    window.print();
  };

  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around">
      <PrintBtn handlePrint={handlePrint} id={id} />

      <button type="button" className="message-action-button">
        <i className="fas fa-trash-alt" aria-hidden="true" />
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
  id: PropTypes.number,
};

export default MessageActionButtons;
