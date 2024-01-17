/*
On each <MessageThreadItem> expand we need to send a /read call to the backend to retrieve full message data.
We are able to do this by using the onAccordionItemToggled event from the <va-accordion> component.
However, as of 4/11/2023 <va-accordion> Expand All button is not triggering onAccordionItemToggled 
for each individual <va-accordion-item> event. Preloading all messages on the first render of <MessageThread>
is not an option since it will mark all messages as read. 
*/

import React, { useRef, useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import PropType from 'prop-types';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MessageThreadItem from './MessageThreadItem';
import { markMessageAsReadInThread } from '../../actions/messages';
import useInterval from '../../hooks/use-interval';

const MessageThread = props => {
  const dispatch = useDispatch();
  const { messageHistory, isDraftThread } = props;
  const accordionRef = useRef();
  const [hasListener, setHasListener] = useState(false);
  const messageHistoryRef = useRef([]);
  const viewCountRef = useRef();

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

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      <section
        aria-label={
          messageHistory?.length > 0 &&
          `${messageHistory?.length} Message${
            messageHistory?.length > 1 ? 's' : ''
          } in this conversation`
        }
        className="older-messages vads-u-margin-top--3 vads-u-padding-left--0p5 do-not-print"
      >
        <h2 className="messages-in-conversation vads-u-font-weight--bold vads-u-margin-bottom--0p5">
          {messageHistory?.length > 0 &&
            `${messageHistory?.length} Message${
              messageHistory?.length > 1 ? 's' : ''
            } in this conversation`}
        </h2>
        <VaAccordion ref={accordionRef} bordered>
          {messageHistory.map((m, i) => {
            return (
              <>
                <MessageThreadItem
                  open={i === 0}
                  key={m.messageId}
                  message={m}
                  isDraftThread={isDraftThread}
                  preloaded={m.preloaded}
                  expanded
                />
              </>
            );
          })}
        </VaAccordion>
      </section>
    </>
  );
};

MessageThread.propTypes = {
  isDraftThread: PropType.bool,
  messageHistory: PropType.array,
  replyMessage: PropType.object,
  viewCount: PropType.number,
};

export default MessageThread;
