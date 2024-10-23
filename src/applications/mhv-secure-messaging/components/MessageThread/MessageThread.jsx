/*
On each <MessageThreadItem> expand we call getMessages(messageId) to mark unread messages as read.
We no longer need to handle an additional expansion call 
*/

import React, { useState, useRef } from 'react';

import PropType from 'prop-types';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MessageThreadItem from './MessageThreadItem';

const MessageThread = props => {
  const { messageHistory, isDraftThread } = props;
  const accordionRef = useRef();
  const [expanded, setExpanded] = useState('');

  return (
    <>
      {messageHistory === undefined && (
        <va-loading-indicator message="Loading message history..." />
      )}

      <section
        aria-label={
          messageHistory?.length > 0 &&
          `${messageHistory?.length} message${
            messageHistory?.length > 1 ? 's' : ''
          } in this conversation`
        }
        className="older-messages vads-u-margin-top--3 vads-u-padding-left--0p5 do-not-print"
      >
        <h2
          data-testid="not-for-print-header"
          className="messages-in-conversation vads-u-font-weight--bold vads-u-margin-bottom--0p5"
        >
          {messageHistory?.length > 0 &&
            `${messageHistory?.length} message${
              messageHistory?.length > 1 ? 's' : ''
            } in this conversation`}
        </h2>
        <VaAccordion
          ref={accordionRef}
          data-testid="thread-expand-all"
          bordered
          onClick={e => {
            setExpanded(
              e.target?.shadowRoot
                ?.querySelector('.usa-accordion')
                ?.querySelector('button').innerText,
            );
          }}
          data-dd-action-name={`${expanded} Accordion Button`}
        >
          {messageHistory.map((m, i) => {
            return (
              <MessageThreadItem
                open={i === 0}
                key={m.messageId}
                message={m}
                isDraftThread={isDraftThread}
                expanded
              />
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
};

export default MessageThread;
