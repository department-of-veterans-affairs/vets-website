import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import { getThread } from '../../actions';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';
import { clearMessageHistory } from '../../actions/messages';

const MessageThread = props => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.message.message);
  const { messageHistory } = props;
  const [viewCount, setViewCount] = useState(5);

  useEffect(
    () => {
      if (message) {
        dispatch(getThread(message.id));
      }
      return () => {
        dispatch(clearMessageHistory());
      };
    },
    [message, dispatch],
  );

  const handleLoadMoreMessages = () => {
    setViewCount(viewCount + 5);
  };

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      {messageHistory?.length > 0 &&
        viewCount && (
          <div className="older-messages vads-u-margin-y--3 vads-u-padding-left--0p5">
            <h3 className="vads-u-font-weight--bold">
              Messages in this conversation (test)
            </h3>
            <HorizontalRule />

            {messageHistory.map((m, i) => {
              return i < viewCount && <MessageThreadItem key={i} message={m} />;
            })}

            {viewCount < messageHistory?.length && (
              <div className="vads-u-margin-top--1 vads-l-row vads-u-justify-content--center">
                <va-button
                  secondary
                  text="Load more messages"
                  onClick={handleLoadMoreMessages}
                />
              </div>
            )}
          </div>
        )}
    </>
  );
};

MessageThread.propTypes = {
  messageHistory: PropType.array,
};

export default MessageThread;
