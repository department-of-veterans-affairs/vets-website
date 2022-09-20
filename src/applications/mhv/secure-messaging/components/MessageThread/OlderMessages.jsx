import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getThread } from '../../actions';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';

const OlderMessages = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.message.message);
  const messageThread = useSelector(state => state.message.messages);
  const [viewCount, setViewCount] = useState(5);

  useEffect(
    () => {
      if (message) {
        dispatch(getThread(message.id));
      }
    },
    [message, dispatch],
  );

  const handleLoadMoreMessages = () => {
    setViewCount(viewCount + 5);
  };

  return (
    messageThread?.length > 0 &&
    viewCount && (
      <div className="older-messages vads-u-margin-y--3 vads-u-padding-left--0p5">
        <h3 className="vads-u-font-weight--bold">
          Messages in this conversation
        </h3>
        <HorizontalRule />

        {messageThread.map((m, i) => {
          return i < viewCount && <MessageThreadItem key={i} message={m} />;
        })}

        {viewCount < messageThread?.length && (
          <div className="vads-u-margin-top--1 vads-l-row vads-u-justify-content--center">
            <va-button
              secondary
              text="Load more messages"
              onClick={handleLoadMoreMessages}
            />
          </div>
        )}
      </div>
    )
  );
};

export default OlderMessages;
