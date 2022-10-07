import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getThread } from '../actions';
import MessageThreadItem from './MessageThread/MessageThreadItem';

const PrintMessageThread = props => {
  const { messageId } = props;
  const dispatch = useDispatch();
  const messageThread = useSelector(state => state.message.messages);
  const printView = true;
  useEffect(
    () => {
      if (messageId) {
        dispatch(getThread(messageId));
      }
    },
    [dispatch, messageId],
  );

  const messageThreadList = () => {
    return (
      <div className="message-thread-list">
        {messageThread.map((m, i) => {
          return (
            <div key={i}>
              <MessageThreadItem message={m} printView={printView} />
            </div>
          );
        })}
      </div>
    );
  };
  return <div>{messageThread ? messageThreadList() : null}</div>;
};

PrintMessageThread.propTypes = {
  messageId: PropTypes.number,
};

export default PrintMessageThread;
