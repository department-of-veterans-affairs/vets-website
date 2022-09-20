import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getThread } from '../../actions';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';

const OlderMessages = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.message.message);
  const messageThread = useSelector(state => state.message.messages);

  useEffect(
    () => {
      if (message) {
        dispatch(getThread(message.id));
      }
    },
    [message, dispatch],
  );

  return (
    messageThread?.length > 0 && (
      <div className="older-messages vads-u-margin-y--3 vads-u-padding-left--0p5">
        <h3 className="vads-u-font-weight--bold">
          Messages in this conversation
        </h3>
        <HorizontalRule />
        {messageThread.map((m, i) => {
          return <MessageThreadItem key={i} message={m} />;
        })}
      </div>
    )
  );
};

export default OlderMessages;
