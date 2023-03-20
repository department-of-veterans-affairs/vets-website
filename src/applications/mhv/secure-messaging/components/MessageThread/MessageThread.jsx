import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropType from 'prop-types';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';
import { clearMessageHistory } from '../../actions/messages';

const MessageThread = props => {
  const dispatch = useDispatch();
  const { messageHistory } = props;
  const [viewCount, setViewCount] = useState(5);

  useEffect(
    () => {
      return () => {
        dispatch(clearMessageHistory());
      };
    },
    [dispatch],
  );

  const handleLoadMoreMessages = () => {
    setViewCount(viewCount + 5);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      // prevent from scrolling to the footer
      e.preventDefault();
      handleLoadMoreMessages();
    }
  };

  // value for screen readers to indicate how many messages are being loaded
  const messagesLoaded = useMemo(
    () => {
      if (messageHistory?.length)
        return messageHistory?.length > viewCount
          ? 5
          : messageHistory.length - viewCount + 5;
      return null;
    },
    [viewCount, messageHistory],
  );

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      {messageHistory?.length > 0 &&
        viewCount && (
          <div className="older-messages vads-u-margin-top--3 vads-u-padding-left--0p5">
            <h2 className="vads-u-font-weight--bold">
              Messages in this conversation
            </h2>
            <HorizontalRule />

            {messageHistory.map((m, i) => {
              return (
                i < viewCount && (
                  <MessageThreadItem key={m.messageId} message={m} />
                )
              );
            })}

            {viewCount < messageHistory?.length && (
              <div className="vads-u-margin-top--1 vads-l-row vads-u-justify-content--flex-start">
                {/* Per design decision it was determined to use a link instead of a button */}
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  aria-label="Load 5 more messages"
                  role="button"
                  tabIndex="0"
                  onKeyPress={handleKeyPress}
                  onClick={handleLoadMoreMessages}
                >
                  + 5 more messages
                </a>
              </div>
            )}
            {viewCount > 6 && (
              <div
                // announce to screen readers that more messages have been loaded
                aria-live="polite"
                role="alert"
                aria-label={`${messagesLoaded} more message${
                  messagesLoaded > 1 ? 's are' : ' is'
                } loaded. Press Tab to navigate to the next message`}
              />
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
