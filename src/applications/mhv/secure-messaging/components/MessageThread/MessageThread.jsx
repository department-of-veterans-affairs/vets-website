/*
On each <MeesageThreadItem> expand we need to send a /read call to the backend to retrieve full message data.
We are able to do this by using the onAccordionItemToggled event from the <va-accordion> component.
However, as of 4/11/2023 <va-accordion> Expand All button is not triggering onAccordionItemToggled 
for each individual <va-accordion-item> event. Prelaoding all messages on the first render of <MessageThread>
is not an option since it will mark all messages as read. 
*/

import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropType from 'prop-types';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadItem from './MessageThreadItem';
import {
  clearMessageHistory,
  markMessageAsReadInThread,
} from '../../actions/messages';
import { Actions } from '../../util/actionTypes';

const MessageThread = props => {
  const dispatch = useDispatch();
  const { messageHistory, isDraftThread, isForPrint, viewCount } = props;
  const accordionRef = useRef();

  useEffect(
    () => {
      return () => {
        dispatch(clearMessageHistory());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (messageHistory?.length) {
        messageHistory.forEach((m, i) => {
          if (i < viewCount && !m.preloaded) {
            dispatch(markMessageAsReadInThread(m.messageId));
          }
        });
      }
    },
    [viewCount],
  );

  const setViewCount = count => {
    dispatch({ type: Actions.Message.SET_THREAD_VIEW_COUNT, payload: count });
  };

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
          <div
            className={`older-messages vads-u-margin-top--3 vads-u-padding-left--0p5 ${
              isForPrint ? 'print' : 'do-not-print'
            }`}
          >
            <h2 className="vads-u-font-weight--bold">
              Messages in this conversation
            </h2>
            <HorizontalRule />

            <VaAccordion ref={accordionRef} bordered>
              {messageHistory.map((m, i) => {
                return (
                  i < viewCount && (
                    <MessageThreadItem
                      key={m.messageId}
                      message={m}
                      isDraftThread={isDraftThread}
                      expanded
                    />
                  )
                );
              })}
            </VaAccordion>

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
  isDraftThread: PropType.bool,
  isForPrint: PropType.bool,
  messageHistory: PropType.array,
  viewCount: PropType.number,
};

export default MessageThread;
