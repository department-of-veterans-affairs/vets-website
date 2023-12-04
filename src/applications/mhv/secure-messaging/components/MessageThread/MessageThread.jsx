/*
On each <MessageThreadItem> expand we need to send a /read call to the backend to retrieve full message data.
We are able to do this by using the onAccordionItemToggled event from the <va-accordion> component.
However, as of 4/11/2023 <va-accordion> Expand All button is not triggering onAccordionItemToggled 
for each individual <va-accordion-item> event. Preloading all messages on the first render of <MessageThread>
is not an option since it will mark all messages as read. 
*/

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import PropType from 'prop-types';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import MessageThreadItem from './MessageThreadItem';
import {
  clearMessageHistory,
  markMessageAsReadInThread,
} from '../../actions/messages';
import { Actions } from '../../util/actionTypes';
import useInterval from '../../hooks/use-interval';

const MessageThread = props => {
  const dispatch = useDispatch();
  const { messageHistory, isDraftThread, isForPrint, viewCount } = props;
  const accordionRef = useRef();
  const [hasListener, setHasListener] = useState(false);
  const messageHistoryRef = useRef([]);
  const viewCountRef = useRef();

  const messageCount = useMemo(
    () => {
      if (messageHistory?.length) {
        return messageHistory.filter(m => m.sentDate !== null).length || 0;
      }
      return 0;
    },
    [messageHistory],
  );

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

  useEffect(
    () => {
      messageHistoryRef.current = messageHistory;
      viewCountRef.current = viewCount;
    },
    [messageHistory, viewCount],
  );

  const expandListener = useCallback(
    () => {
      if (messageHistoryRef.current?.length) {
        messageHistoryRef.current.forEach((m, i) => {
          if (i < viewCountRef.current && !m.preloaded) {
            dispatch(markMessageAsReadInThread(m.messageId, isDraftThread));
          }
        });
      }
    },
    [messageHistoryRef, viewCountRef, dispatch, isDraftThread],
  );

  // shadow dom is not available on the first render, so we need to wait for it to be available
  // before we can add the event listener
  // event listener is requried as it is not handled by native event handler in <va-accordion>
  // this is a temporary solution until the <va-accordion> component is updated to handle this event
  useInterval(() => {
    if (!hasListener && accordionRef) {
      const button = accordionRef.current?.shadowRoot?.querySelector('button');
      if (button) {
        button.addEventListener('click', () => {
          expandListener();
        });
        setHasListener(true);
      }
    }
  }, 500);

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
      if (viewCount > 5) {
        focusElement(
          `[data-testid="expand-message-button-${
            messageHistory[viewCount - 5].messageId
          }"]`,
        );
      }
    },
    [viewCount, messageHistory],
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

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      <section
        aria-label={
          messageCount > 0 &&
          `${messageCount} Message${
            messageCount > 1 ? 's' : ''
          } in this conversation`
        }
        className={`older-messages vads-u-margin-top--3 vads-u-padding-left--0p5 ${
          isForPrint ? 'print' : 'do-not-print'
        }`}
      >
        <h2 className="messages-in-conversation vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {messageCount > 0 &&
            `${messageCount} Message${
              messageCount > 1 ? 's' : ''
            } in this conversation`}
        </h2>
        <VaAccordion ref={accordionRef} bordered>
          {messageHistory.map((m, i) => {
            return (
              i < viewCount && (
                <MessageThreadItem
                  open={i === 0}
                  key={m.messageId}
                  message={m}
                  isDraftThread={isDraftThread}
                  preloaded={m.preloaded}
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
            } loaded. Continue to navigate to the next message`}
          />
        )}
      </section>
    </>
  );
};

MessageThread.propTypes = {
  isDraftThread: PropType.bool,
  isForPrint: PropType.bool,
  messageHistory: PropType.array,
  replyMessage: PropType.object,
  viewCount: PropType.number,
};

export default MessageThread;
